#!/bin/bash
CUDA_VISIBLE_DEVICES=0 mmf_predict dataset=hateful_memes \
    model=visual_bert \
    config=projects/hateful_memes/configs/visual_bert/from_coco.yaml \
    checkpoint.resume_file=models_clean/visual_bert/visual_bert_final.pth \
    checkpoint.resume_pretrained=False \
    dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/cleaned_train.jsonl \
    dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/cleaned_dev_seen.jsonl \
    dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/cleaned_test_seen.jsonl \
    run_type=$1
