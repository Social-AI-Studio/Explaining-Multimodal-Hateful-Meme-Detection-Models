#!/bin/bash
mmf_run dataset=hateful_memes \
        model=visual_bert \
        config=projects/hateful_memes/configs/visual_bert/direct.yaml \
        env.save_dir=./models/visual_bert \
        training.max_epochs=20 \
        training.checkpoint_interval=133 \
        training.evaluation_interval=133 \
        training.log_interval=133 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/test_seen.jsonl