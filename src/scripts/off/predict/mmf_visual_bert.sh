#!/bin/bash
CUDA_VISIBLE_DEVICES=1 mmf_predict dataset=hateful_memes \
    model=visual_bert \
    config=projects/hateful_memes/configs/visual_bert/direct.yaml \
    checkpoint.resume_file=models/off/visual_bert/visual_bert_final.pth \
    checkpoint.resume_pretrained=False \
    dataset_config.hateful_memes.annotations.train[0]=off/defaults/annotations/train.jsonl \
    dataset_config.hateful_memes.annotations.val[0]=off/defaults/annotations/val.jsonl \
    dataset_config.hateful_memes.annotations.test[0]=off/defaults/annotations/test.jsonl \
    run_type=$1
