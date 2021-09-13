#!/bin/bash
mmf_run dataset=hateful_memes \
        model=vilbert \
        config=config/general/vilbert.yaml \
        checkpoint.resume_file=models/vilbert/vilbert_final.pth \
        checkpoint.resume_pretrained=False \
        run_type=$1