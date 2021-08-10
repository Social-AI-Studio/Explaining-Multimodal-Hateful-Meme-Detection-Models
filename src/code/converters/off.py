import os, shutil, logging
import pandas as pd

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

        self.mmf_folder = os.path.join(mmf_folder, 'defaults')

    def load_dataset(self, raw_folder: str, filename: str) -> pd.DataFrame:
        filepath = os.path.join(raw_folder, 'split_dataset', filename)
        return pd.read_csv(filepath)

    def convert_dataset(self, df: pd.DataFrame):
        df = df.rename(columns={"image_name": "img", "sentence": "text"})

        df['id'] = df['img'].apply(lambda x: x.split('.')[0])
        df['label'] = df['label'].map(self.labels)

        return df

    def convert(self):
        os.makedirs(self.mmf_folder, exist_ok=True)

        # Image Conversion
        mmf_img_folder = os.path.join(self.mmf_folder, "images")
        if not os.path.exists(mmf_img_folder):
            logging.info(f"Copying images into: {mmf_img_folder}")
            shutil.copytree(self.img_folder, mmf_img_folder)

        # Dataset Conversion
        logging.info(f"Creating Annotations Folder...")
        annotations_folder = os.path.join(self.mmf_folder, "annotations")
        os.makedirs(annotations_folder, exist_ok=True)

        logging.info(f"Creating Annotations Folder...")
        mmf_train_filepath = os.path.join(annotations_folder, "train.jsonl")
        ctrain_df = self.convert_dataset(self.train_df)
        ctrain_df.to_json(mmf_train_filepath, orient='records', lines=True)

        mmf_val_filepath = os.path.join(annotations_folder, "val.jsonl")
        cval_df = self.convert_dataset(self.val_df)
        cval_df.to_json(mmf_val_filepath, orient='records', lines=True)

        mmf_test_filepath = os.path.join(annotations_folder, "test.jsonl")
        ctest_df = self.convert_dataset(self.test_df)
        ctest_df.to_json(mmf_test_filepath, orient='records', lines=True)
        

        