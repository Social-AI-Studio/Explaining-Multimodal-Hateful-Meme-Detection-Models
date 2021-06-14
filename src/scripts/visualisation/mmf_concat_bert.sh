#!/bin/bash
CUDA_VISIBLE_DEVICES=0 python visualisation/image/main.py model=concat_bert \
                                                          dataset=hateful_memes \
                                                          config=config/visualisation/concat_bert.yaml \
                                                          checkpoint.resume_file=models/concat_bert/concat_bert_final.pth \
                                                          checkpoint.resume_pretrained=False \
                                                          run_type=$1