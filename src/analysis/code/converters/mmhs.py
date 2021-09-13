import re
import os, shutil, logging
import numpy as np
import pandas as pd

from collections import Counter

class MMHSConverter:
    def __init__(self, raw_folder: str, mmf_folder: str):
        self.labels = {
            'Non-offensiv': 0,
            'offensive': 1
        }

        self.img_folder = os.path.join(raw_folder, 'img_resized')
        self.img_txt_folder = os.path.join(raw_folder, 'img_txt')

        ground_truth = pd.read_json(os.path.join(raw_folder, "MMHS150K_GT.json"), 
                                    orient='index')
        ground_truth.index = ground_truth.index.astype(np.int64)
        logging.info(f"Total # Records: {len(ground_truth)}")

        self.train_df = self.load_dataset(ground_truth, raw_folder, 'train_ids.txt')
        self.val_df = self.load_dataset(ground_truth, raw_folder, 'val_ids.txt')
        self.test_df = self.load_dataset(ground_truth, raw_folder, 'test_ids.txt')

        logging.info(f"# Train Records: {len(self.train_df)}")
        logging.info(f"# Val Records: {len(self.val_df)}")
        logging.info(f"# Test Records: {len(self.test_df)}")

        self.mmf_folder = os.path.join(mmf_folder, 'defaults')

    def load_dataset(self, ground_truth: pd.DataFrame, raw_folder: str, filename: str) -> pd.DataFrame:
        filepath = os.path.join(raw_folder, 'splits', filename)
        with open(filepath) as f:
            ids = [x.strip() for x in f.readlines()]

        return ground_truth[ground_truth.index.isin(ids)]

    def convert_dataset(self, df: pd.DataFrame):
        # Majority Vote (Labels)
        df['labels'] = df['labels'].apply(lambda x: [ 1 if l >= 1 else 0 for l in x])
        df['label'] = df['labels'].apply(lambda x: Counter(x).most_common(1)[0][0])
        df['label'] = df['labels'].apply(lambda x: Counter(x).most_common(1)[0][0])
        # print(df.head(30))

        # Generate necessary columns
        df['img'] = df.index.to_series().apply(lambda x: f"img/{x}.jpg")
        df['text'] = df['tweet_text'].apply(lambda x: re.sub(r"http\S+", "", x).lower().strip())

        # Drop redundant columns
        df.reset_index(inplace=True)
        df.rename(columns={"index": "id"}, inplace=True)
        df.drop(columns=["labels_str", "tweet_url", "img_url", "tweet_text", "labels"], inplace=True)
        return df

    def print_statistics(self, df: pd.DataFrame):
        logging.info(f"# of Hateful Records: {len(df[df['label'] >= 1])}")
        logging.info(f"# of Not Hateful Records: {len(df[df['label'] == 0])}")


    def convert(self):
        os.makedirs(self.mmf_folder, exist_ok=True)

        # Image Conversion
        # mmf_img_folder = os.path.join(self.mmf_folder, "images")
        # if not os.path.exists(mmf_img_folder):
        #     logging.info(f"Copying images into: {mmf_img_folder}")
        #     shutil.copytree(self.img_folder, mmf_img_folder)

        # Dataset Conversion
        logging.info(f"Creating Annotations Folder...")
        annotations_folder = os.path.join(self.mmf_folder, "annotations")
        os.makedirs(annotations_folder, exist_ok=True)

        logging.info(f"Creating Dataset Splits...")
        mmf_train_filepath = os.path.join(annotations_folder, "train.jsonl")
        ctrain_df = self.convert_dataset(self.train_df)
        ctrain_df.to_json(mmf_train_filepath, orient='records', lines=True)

        mmf_val_filepath = os.path.join(annotations_folder, "val.jsonl")
        cval_df = self.convert_dataset(self.val_df)
        cval_df.to_json(mmf_val_filepath, orient='records', lines=True)

        mmf_test_filepath = os.path.join(annotations_folder, "test.jsonl")
        ctest_df = self.convert_dataset(self.test_df)
        ctest_df.to_json(mmf_test_filepath, orient='records', lines=True)
        
        logging.info("Train Dataset Statistics")
        self.print_statistics(ctrain_df)
        
        logging.info("Val Dataset Statistics")
        self.print_statistics(cval_df)

        logging.info("Test Dataset Statistics")
        self.print_statistics(ctest_df)

        