#!/usr/bin/env python3 -u
# Copyright (c) Facebook, Inc. and its affiliates.
import argparse
import logging
import random
import typing

import torch
from mmf.common.registry import registry
from mmf.utils.build import build_config, build_trainer
from mmf.utils.configuration import Configuration
from mmf.utils.distributed import distributed_init, get_rank, infer_init_method, is_xla
from mmf.utils.env import set_seed, setup_imports
from mmf.utils.flags import flags
from mmf.utils.general import log_device_names
from mmf.utils.logger import setup_logger, setup_very_basic_config

from pytorch_grad_cam import GradCAM, EigenCAM
from evaluation_loop import custom_evaluation_loop

setup_very_basic_config()


def main(configuration, init_distributed=False, predict=False):
    # A reload might be needed for imports
    setup_imports()
    configuration.import_user_dir()
    config = configuration.get_config()

    if torch.cuda.is_available():
        torch.cuda.set_device(config.device_id)
        torch.cuda.init()

    if init_distributed:
        distributed_init(config)

    seed = config.training.seed
    config.training.seed = set_seed(seed if seed == -1 else seed + get_rank())
    registry.register("seed", config.training.seed)

    config = build_config(configuration)

    setup_logger(
        color=config.training.colored_logs, disable=config.training.should_not_log
    )
    logger = logging.getLogger("mmf_cli.run")
    # Log args for debugging purposes
    logger.info(configuration.args)
    logger.info(f"Torch version: {torch.__version__}")
    log_device_names()
    logger.info(f"Using seed {config.training.seed}")

    trainer = build_trainer(config)
    trainer.load()

    logger.info("===== Model =====")
    logger.info(trainer.model)
    logger.info(type(trainer))
    logger.info(type(trainer.model))

    for name, param in trainer.model.named_parameters():
        if param.requires_grad:
            print(name)

    if configuration.get_config()['model'] in ['concat_bert', 'late_fusion']:
        conv = trainer.model.base.modal.model[7][2].conv3

    # Prepare CAM object
    # cam_name = 'gradcam'
    # cam = GradCAM(model=trainer.model, 
    #               target_layer=conv,
    #               use_cuda=torch.cuda.is_available())

    cam_name = 'eigencam'
    cam = EigenCAM(model=trainer.model, 
                   target_layer=conv,
                   use_cuda=torch.cuda.is_available())
    
    # # trainer.inference()
    dataset = configuration.get_config()['run_type']
    trainer.on_test_start()
    logger.info(f"Starting inference on {dataset} set")
    report, meter = custom_evaluation_loop(cam, cam_name, trainer, dataset, use_tqdm=True)
    trainer.on_test_end(report=report, meter=meter)

def run(opts: typing.Optional[typing.List[str]] = None, predict: bool = False):
    """Run starts a job based on the command passed from the command line.
    You can optionally run the mmf job programmatically by passing an optlist as opts.

    Args:
        opts (typing.Optional[typing.List[str]], optional): Optlist which can be used.
            to override opts programmatically. For e.g. if you pass
            opts = ["training.batch_size=64", "checkpoint.resume=True"], this will
            set the batch size to 64 and resume from the checkpoint if present.
            Defaults to None.
        predict (bool, optional): If predict is passed True, then the program runs in
            prediction mode. Defaults to False.
    """
    setup_imports()

    if opts is None:
        parser = flags.get_parser()
        args = parser.parse_args()
    else:
        args = argparse.Namespace(config_override=None)
        args.opts = opts

    configuration = Configuration(args)
    # Do set runtime args which can be changed by MMF
    configuration.args = args
    config = configuration.get_config()
    config.start_rank = 0
    config.device_id = 0
    main(configuration, predict=predict)


if __name__ == "__main__":
    run()
