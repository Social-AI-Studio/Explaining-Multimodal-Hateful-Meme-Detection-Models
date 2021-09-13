#!/bin/bash
mmf_run dataset=hateful_memes \
        model=concat_bert \
        config=projects/hateful_memes/configs/concat_bert/defaults.yaml \
        env.save_dir=./models/concat_bert \
        training.max_epochs=20 \
        training.batch_size=128 \
        training.checkpoint_interval=67 \
        training.evaluation_interval=67 \
        training.log_interval=67 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/test_seen.jsonl
