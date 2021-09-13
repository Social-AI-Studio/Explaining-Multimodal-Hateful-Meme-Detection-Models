import os
import json

files = [
    'train.jsonl',
    'dev_unseen.jsonl',
    'dev_seen.jsonl',
    'test_unseen.jsonl',
    'test_seen.jsonl'
]

annot_dir = "/root/.cache/torch/mmf/data/datasets/hateful_memes/defaults/annotations"
img_dir = "/root/.cache/torch/mmf/data/datasets/hateful_memes/defaults/images"

for filename in files:
    with open(os.path.join(annot_dir, filename)) as f:
        data = [json.loads(line) for line in f]

    for d in data:
        d['img'] = d['img'].replace('img', 'img_clean')

        assert os.path.isfile(os.path.join(img_dir, d['img']))

    cleaned_filename = f'cleaned_{filename}'
    with open(os.path.join(annot_dir, cleaned_filename), 'w') as f:
        for line in data:
            f.write(json.dumps(line) + '\n')
