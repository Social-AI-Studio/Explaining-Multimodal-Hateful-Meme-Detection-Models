import torch
import torchvision
import tqdm

import logging
import os

from mmf.trainers.mmf_trainer import MMFTrainer
from mmf.common.sample import to_device
from mmf.utils.distributed import gather_tensor

from mmf.common.meter import Meter
from mmf.common.report import Report

from caffe2.python.timeout_guard import CompleteInTimeOrDie

from torchvision.transforms import Compose, Normalize, ToTensor

from pytorch_grad_cam.utils.image import show_cam_on_image, \
                                         deprocess_image

import cv2
import numpy as np

logger = logging.getLogger(__name__)

def custom_evaluation_loop(cam: object, cam_name: str, trainer: MMFTrainer, dataset_type: str, use_tqdm: bool = False, single_batch: bool = False):
    meter = Meter()
    reporter = trainer.dataset_loader.get_test_reporter(dataset_type)
    use_cpu = trainer.config.evaluation.get("use_cpu", False)
    loaded_batches = 0
    skipped_batches = 0

    # with torch.no_grad():
    trainer.model.eval()
    while reporter.next_dataset(flush_report=False):
        dataloader = reporter.get_dataloader()
        combined_report = None

        dataloader = tqdm.tqdm(dataloader)
        for batch in dataloader:
            # Do not timeout quickly on first batch, as workers might start at
            # very different times.
            with CompleteInTimeOrDie(600 if loaded_batches else 3600 * 24):
                loaded_batches += 1
                prepared_batch = reporter.prepare_batch(batch)
            
                # Additional steps
                rgb_img = np.array(prepared_batch.image[0])
                prepared_batch.add_field('image', 
                                         preprocess_image(rgb_img, 
                                                          mean=[0.46777044, 0.44531429, 0.40661017],
                                                          std=[0.12221994, 0.12145835, 0.14380469]))
                prepared_batch = to_device(prepared_batch, trainer.device)

                if not validate_batch_sizes(prepared_batch.get_batch_size()):
                    logger.info("Skip batch due to uneven batch sizes.")
                    skipped_batches += 1
                    continue
                
                # Generate Class Acitvation Map
                generate_cam(cam, cam_name, rgb_img, prepared_batch, trainer.config.model, dataset_type)

                model_output = trainer.model(prepared_batch)
                report = Report(prepared_batch, model_output)
                report = report.detach()

                meter.update_from_report(report)

                moved_report = report
                # Move to CPU for metrics calculation later if needed
                # Explicitly use `non_blocking=False` as this can cause
                # race conditions in next accumulate
                if use_cpu:
                    moved_report = report.copy().to("cpu", non_blocking=False)

                # accumulate necessary params for metric calculation
                if combined_report is None:
                    # make a copy of report since `reporter.add_to_report` will
                    # change some of the report keys later
                    combined_report = moved_report.copy()
                else:
                    combined_report.accumulate_tensor_fields_and_loss(
                        moved_report, trainer.metrics.required_params
                    )
                    combined_report.batch_size += moved_report.batch_size

                # Each node generates a separate copy of predict JSON from the
                # report, which will be used to evaluate dataset-level metrics
                # (such as mAP in object detection or CIDEr in image captioning)
                # Since `reporter.add_to_report` changes report keys,
                # (e.g scores) do this after
                # `combined_report.accumulate_tensor_fields_and_loss`
                if "__prediction_report__" in trainer.metrics.required_params:
                    # Still need to use original report here on GPU/TPU since
                    # it will be gathered
                    reporter.add_to_report(report, trainer.model)

                if single_batch is True:
                    break
                
    logger.info(f"Finished training. Loaded {loaded_batches}")
    logger.info(f" -- skipped {skipped_batches} batches.")

    reporter.postprocess_dataset_report()
    assert (
        combined_report is not None
    ), "Please check if your validation set is empty!"
    # add prediction_report is used for set-level metrics
    combined_report.prediction_report = reporter.report

    combined_report.metrics = trainer.metrics(combined_report, combined_report)

    # Since update_meter will reduce the metrics over GPUs, we need to
    # move them back to GPU but we will only move metrics and losses
    # which are needed by update_meter to avoid OOM
    # Furthermore, do it in a non_blocking way to avoid any issues
    # in device to host or host to device transfer
    if use_cpu:
        combined_report = combined_report.to(
            trainer.device, fields=["metrics", "losses"], non_blocking=False
        )

    meter.update_from_report(combined_report, should_update_loss=False)

    return combined_report, meter

def generate_cam(cam, cam_name, rgb_img, prepared_batch, model_name, dataset_type):
    # Generate cam
    grayscale_cam = cam(input_tensor=prepared_batch)

    # Here grayscale_cam has only one image in the batch
    rgb_img = rgb_img / 255
    grayscale_cam = grayscale_cam[0, :]

    cam_image = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    # cam_image is RGB encoded whereas "cv2.imwrite" requires BGR encoding.
    cam_image = cv2.cvtColor(cam_image, cv2.COLOR_RGB2BGR)

    image_dir = f'/opt/mshee/code/explainable-multimodal-hateful-content/images/{cam_name}/{dataset_type}/{model_name}'
    os.makedirs(image_dir, exist_ok=True)

    cv2.imwrite(f'{image_dir}/{prepared_batch.id[0].item()}_cam.jpg', cam_image)

def preprocess_image(img: np.ndarray, mean=None, std=None) -> torch.Tensor:
    if std is None:
        std = [0.5, 0.5, 0.5]
    if mean is None:
        mean = [0.5, 0.5, 0.5]

    preprocessing = Compose([
        ToTensor(),
        GrayScaleTo3Channels(),
        Normalize(mean=mean, std=std)
    ])

    return preprocessing(img.copy()).unsqueeze(0)

class GrayScaleTo3Channels:
    def __init__(self, *args, **kwargs):
        return

    def __call__(self, x):
        return self.transform(x)

    def transform(self, x):
        assert isinstance(x, torch.Tensor)
        # Handle grayscale, tile 3 times
        if x.size(0) == 1:
            x = torch.cat([x] * 3, dim=0)
        return x

def validate_batch_sizes(my_batch_size: int) -> bool:
    """
    Validates all workers got the same batch size.
    """
    batch_size_tensor = torch.IntTensor([my_batch_size])
    if torch.cuda.is_available():
        batch_size_tensor = batch_size_tensor.cuda()
    all_batch_sizes = gather_tensor(batch_size_tensor)
    for j, oth_batch_size in enumerate(all_batch_sizes.data):
        if oth_batch_size != my_batch_size:
            logger.error(f"Node {j} batch {oth_batch_size} != {my_batch_size}")
            return False
    return True