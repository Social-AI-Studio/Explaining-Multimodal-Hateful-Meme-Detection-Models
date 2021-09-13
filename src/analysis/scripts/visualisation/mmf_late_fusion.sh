#!/bin/bash
CUDA_VISIBLE_DEVICES=0 python visualisation/image/main.py model=late_fusion \
    dataset=hateful_memes \
    config=config/visualisation/late_fusion.yaml \
    checkpoint.resume_file=models/late_fusion/late_fusion_final.pth \
    checkpoint.resume_pretrained=False \
    dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/cleaned_train.jsonl \
    dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/cleaned_dev_seen.jsonl \
    dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/cleaned_test_seen.jsonl \
    run_type=$1
