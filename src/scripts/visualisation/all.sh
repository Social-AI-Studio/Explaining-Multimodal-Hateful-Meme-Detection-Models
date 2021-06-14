#!/bin/bash
bash scripts/visualisation/mmf_concat_bert.sh val
bash scripts/visualisation/mmf_concat_bert.sh test

bash scripts/visualisation/mmf_late_fusion.sh val
bash scripts/visualisation/mmf_late_fusion.sh test
