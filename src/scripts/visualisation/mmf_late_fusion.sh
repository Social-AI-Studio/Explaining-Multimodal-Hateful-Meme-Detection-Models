#!/bin/bash
CUDA_VISIBLE_DEVICES=0 python visualisation/image/main.py model=late_fusion \
                                                          dataset=hateful_memes \
                                                          config=config/visualisation/late_fusion.yaml \
                                                          checkpoint.resume_file=models/late_fusion/late_fusion_final.pth \
                                                          checkpoint.resume_pretrained=False \
                                                          run_type=$1