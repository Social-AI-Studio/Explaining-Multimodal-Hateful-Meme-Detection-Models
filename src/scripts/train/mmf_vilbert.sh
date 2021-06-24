#!/bin/bash
mmf_run dataset=hateful_memes \
        model=vilbert \
        config=projects/hateful_memes/configs/vilbert/defaults.yaml \
        env.save_dir=./models/vilbert \
        training.max_epochs=20 \
        training.checkpoint_interval=266 \
        training.evaluation_interval=266 \
        training.log_interval=266 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/test_seen.jsonl