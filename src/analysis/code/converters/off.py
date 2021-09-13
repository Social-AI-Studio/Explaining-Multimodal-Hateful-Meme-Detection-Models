import os, shutil, logging
import pandas as pd

from os import listdir
from os.path import isfile, join

class OFFConverter:
    def __init__(self, raw_folder: str, mmf_folder: str):
        self.labels = {
            'Non-offensiv': 0,
            'offensive': 1
        }

        self.img_folder = os.path.join(raw_folder, 'labeled_images')
        self.train_df = self.load_dataset(raw_folder, 'Training_meme_dataset.csv')
        self.val_df = self.load_dataset(raw_folder, 'Validation_meme_dataset.csv')
        self.test_df = self.load_dataset(raw_folder, 'Testing_meme_dataset.csv')

        logging.info(f"# Train Records: {len(self.train_df)}")
        logging.info(f"# Val Records: {len(self.val_df)}")
        logging.info(f"# Test Records: {len(self.test_df)}")

        self.mmf_folder = os.path.join(mmf_folder, 'defaults')

    def load_dataset(self, raw_folder: str, filename: str) -> pd.DataFrame:
        filepath = os.path.join(raw_folder, 'split_dataset', filename)
        return pd.read_csv(filepath)

    def convert_dataset(self, df: pd.DataFrame, img_mapping: dict):
        df['id'] = df['image_name'].apply(lambda x: img_mapping[x.split('.')[0]])
        df['img'] = df['image_name'].apply(lambda x: f"{img_mapping[x.split('.')[0]]}.{x.split('.')[-1]}")
        df['label'] = df['label'].map(self.labels)

        df.rename(columns={"sentence": "text"}, inplace=True)
        df.drop(columns="image_name", inplace=True)

        return df

    def convert(self):
        os.makedirs(self.mmf_folder, exist_ok=True)
        
        img_files = listdir(self.img_folder)
        img_files.sort()
        img_mapping = {k.split('.')[0]: v for v, k in enumerate(img_files)}

        # Image Conversion
        mmf_img_folder = os.path.join(self.mmf_folder, "images", "img")
        logging.info(f"Copying images into: {mmf_img_folder}")
        for img in img_files:
            img_parts = img.split('.')
            idx, ext = img_parts[0], img_parts[-1]

            logging.info(f"{img} -> {img_mapping[idx]}.{ext}...")
            shutil.copy(os.path.join(self.img_folder, img), 
                        os.path.join(mmf_img_folder, f"{img_mapping[idx]}.{ext}"))

        # # Convert NPY
        # npy_folder = os.path.join(self.mmf_folder, 'features')
        # npy_files = [f for f in listdir(npy_folder) if '_info' not in f]
        # npy_files = [f for f in npy_files if 'detectron' not in f]
        # for npy in npy_files:
        #     npy_parts = npy.split('.')
        #     idx, ext = npy_parts[0], npy_parts[-1]

        #     logging.info(f"{npy} -> {img_mapping[idx]}.{ext}...")
        #     shutil.move(os.path.join(npy_folder, npy), 
        #                 os.path.join(npy_folder, f"{img_mapping[idx]}.{ext}"))

        #     logging.info(f"{idx}_info.{ext} -> {img_mapping[idx]}_info.{ext}...")
        #     shutil.move(os.path.join(npy_folder, f"{idx}_info.{ext}"), 
        #                 os.path.join(npy_folder, f"{img_mapping[idx]}_info.{ext}"))

        # Dataset Conversion
        logging.info(f"Creating Annotations Folder...")
        annotations_folder = os.path.join(self.mmf_folder, "annotations")
        os.makedirs(annotations_folder, exist_ok=True)

        logging.info(f"Creating Data Splits")
        mmf_train_filepath = os.path.join(annotations_folder, "train.jsonl")
        ctrain_df = self.convert_dataset(self.train_df, img_mapping)
        ctrain_df.to_json(mmf_train_filepath, orient='records', lines=True)

        mmf_val_filepath = os.path.join(annotations_folder, "val.jsonl")
        cval_df = self.convert_dataset(self.val_df, img_mapping)
        cval_df.to_json(mmf_val_filepath, orient='records', lines=True)

        mmf_test_filepath = os.path.join(annotations_folder, "test.jsonl")
        ctest_df = self.convert_dataset(self.test_df, img_mapping)
        ctest_df.to_json(mmf_test_filepath, orient='records', lines=True)
        

        