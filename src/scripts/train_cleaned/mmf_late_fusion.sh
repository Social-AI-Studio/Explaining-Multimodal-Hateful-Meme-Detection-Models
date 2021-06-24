#!/bin/bash
mmf_run dataset=hateful_memes \
        model=late_fusion \
        config=projects/hateful_memes/configs/late_fusion/defaults.yaml \
        env.save_dir=./models_clean/late_fusion \
        training.max_epochs=20 \
        training.checkpoint_interval=133 \
        training.evaluation_interval=133 \
        training.log_interval=133 \
        dataset_config.hateful_memes.annotations.train[0]=hateful_memes/defaults/annotations/cleaned_train.jsonl \
        dataset_config.hateful_memes.annotations.val[0]=hateful_memes/defaults/annotations/cleaned_dev_seen.jsonl \
        dataset_config.hateful_memes.annotations.test[0]=hateful_memes/defaults/annotations/cleaned_test_seen.jsonl
