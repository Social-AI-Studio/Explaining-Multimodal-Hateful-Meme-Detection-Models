#!/bin/bash
mmf_run dataset=hateful_memes \
        model=visual_bert \
        config=projects/hateful_memes/configs/visual_bert/from_coco.yaml \
        env.save_dir=./models_clean/visual_bert_coco \
        training.max_epochs=20 \
        training.checkpoint_interval=67 \
        training.evaluation_interval=67 \
        training.log_interval=67 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/cleaned_train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/cleaned_dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/cleaned_test_seen.jsonl