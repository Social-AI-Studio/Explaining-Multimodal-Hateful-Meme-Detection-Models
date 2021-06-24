#!/bin/bash
mmf_run dataset=hateful_memes \
        model=concat_bert \
        config=projects/hateful_memes/configs/concat_bert/defaults.yaml \
        env.save_dir=./models_clean/concat_bert \
        training.max_epochs=20 \
        training.batch_size=256 \
        training.checkpoint_interval=34 \
        training.evaluation_interval=34 \
        training.log_interval=34 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/cleaned_train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/cleaned_dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/cleaned_test_seen.jsonl
