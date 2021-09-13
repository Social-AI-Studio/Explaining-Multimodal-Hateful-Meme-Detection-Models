#!/bin/bash
CUDA_VISIBLE_DEVICES=1 nohup mmf_run dataset=hateful_memes \
        model=vilbert \
        config=projects/hateful_memes/configs/vilbert/defaults.yaml \
        env.save_dir=./models/off/vilbert \
        training.max_epochs=40 \
        training.checkpoint_interval=14 \
        training.evaluation_interval=14 \
        training.log_interval=14 \
        dataset_config.hateful_memes.annotations.train[0]=off/defaults/annotations/train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=off/defaults/annotations/val.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=off/defaults/annotations/test.jsonl > off_vilbert.log & 