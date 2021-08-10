import argparse
import logging

from converters.off import OFFConverter
from converters.mmhs import MMHSConverter
from formatter import setup_very_basic_config

if __name__ == "__main__":
    parser = argparse.ArgumentParser(formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("--dataset", required=True, type=str, help="Dataset")
    parser.add_argument("--data_folder", required=True, type=str, help="Raw Data Folder")
    parser.add_argument("--mmf_folder", required=True, type=str, help="MMF Folder")
    args = parser.parse_args()

    setup_very_basic_config()

    if args.dataset == "mmhs":
        converter = MMHSConverter(args.data_folder, args.mmf_folder)
    elif args.dataset == "off":
        converter = OFFConverter(args.data_folder, args.mmf_folder)
    else:
        raise NotImplementedError(f"{args.dataset} not implemented")
    converter.convert()
    