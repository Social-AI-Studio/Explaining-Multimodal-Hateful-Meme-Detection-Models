#!/bin/bash
CUDA_VISIBLE_DEVICES=1 nohup mmf_run dataset=hateful_memes \
        model=visual_bert \
        config=projects/hateful_memes/configs/visual_bert/direct.yaml \
        env.save_dir=./models/off/visual_bert \
        training.max_epochs=40 \
        training.checkpoint_interval=14 \
        training.evaluation_interval=14 \
        training.log_interval=14 \
        dataset_config.hateful_memes.annotations.train[0]=off/defaults/annotations/train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=off/defaults/annotations/val.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=off/defaults/annotations/test.jsonl > off_visualbert.log & 