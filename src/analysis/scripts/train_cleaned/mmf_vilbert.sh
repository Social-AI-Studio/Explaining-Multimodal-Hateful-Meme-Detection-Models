#!/bin/bash
CUDA_VISIBLE_DEVICES=0 nohup mmf_run dataset=hateful_memes \
        model=vilbert \
        config=projects/hateful_memes/configs/vilbert/defaults.yaml \
        env.save_dir=./models_clean/vilbert \
        training.max_epochs=50 \
        training.checkpoint_interval=266 \
        training.evaluation_interval=266 \
        training.log_interval=266 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/cleaned_train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/cleaned_dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/cleaned_test_seen.jsonl > vilbert_clean.log &
