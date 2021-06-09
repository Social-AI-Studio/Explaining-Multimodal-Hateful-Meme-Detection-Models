#!/bin/bash
CUDA_VISIBLE_DEVICES=0 python visualisation/visualise.py model=late_fusion \
                                                         dataset=hateful_memes \
                                                         config=config/late_fusion.yaml \
                                                         checkpoint.resume_file=models/late_fusion/late_fusion_final.pth \
                                                         checkpoint.resume_pretrained=False \
                                                         run_type=val