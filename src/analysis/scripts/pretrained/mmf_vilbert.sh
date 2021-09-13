#!/bin/bash
CUDA_VISIBLE_DEVICES=0 mmf_run dataset=hateful_memes \
    model=vilbert \
    config=projects/hateful_memes/configs/vilbert/defaults.yaml \
    checkpoint.resume_zoo=vilbert.finetuned.hateful_memes.direct \
    checkpoint.resume_pretrained=False \
    dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/train.jsonl \
    dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/dev_seen.jsonl \
    dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/test_seen.jsonl \
    run_type=$1
