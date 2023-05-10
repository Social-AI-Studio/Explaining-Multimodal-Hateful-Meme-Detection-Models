# On Explaining Multimodal Hateful Meme Detection Models

## Abstract

Hateful meme detection is a new multimodal task that has gained significant traction in academic and industry research communities. Recently, researchers have applied pre-trained visual-linguistic models to perform the multimodal classification task, and some of these solutions have yielded promising results. However, what these visual-linguistic models learn for the hateful meme classification task remains unclear. For instance, it is unclear if these models are able to capture the derogatory or slurs references in multimodality (i.e., image and text) of the hateful memes. To fill this research gap, this paper propose three research questions to improve our understanding of these visual-linguistic models performing the hateful meme classification task. We found that the image modality contributes more to the hateful meme classification task, and the visual-linguistic models are able to perform visual-text slurs grounding to a certain extent. Our error analysis also shows that the visual-linguistic models have acquired biases, which resulted in false-positive predictions.

## Repository Introduction
This repository provides a detailed guide to (1) reproduce the observations and results presented in the short paper and (2) facilitate the application of the techniques to analogous datasets by the academic community. The analysis described in the paper was conducted using the [Captum](https://captum.ai/) model interpretability library, a well-known tool that integrates a range of established techniques and methods for model-agnostic interpretation.

The content of the repository is as follows: 
- [On Explaining Multimodal Hateful Meme Detection Models](#on-explaining-multimodal-hateful-meme-detection-models)
  - [Abstract](#abstract)
  - [Repository Introduction](#repository-introduction)
  - [Updates](#updates)
  - [Packages](#packages)
  - [Forked MMF Repository](#forked-mmf-repository)
  - [Data Preprocessing](#data-preprocessing)
    - [Visual Feature Cleaning](#visual-feature-cleaning)
    - [Model Checkpoints](#model-checkpoints)
  - [RQ1: Modality Attribution](#rq1-modality-attribution)
  - [RQ2: Visual-Slurs Grounding](#rq2-visual-slurs-grounding)
    - [Facebook's "MMF" Library (Used in this paper)](#facebooks-mmf-library-used-in-this-paper)
    - [Huggingface's "Transformers" Library](#huggingfaces-transformers-library)

## Updates
- 10th May 2023: Included better explanations, clean features and fine-tuned model checkpoints. Thanks Prof. Debora (Bocconi University) for raising the issues on results reproducibility.

## Packages
- captum==0.5.0
- torch==1.9.1+cu111
- torchvision==0.10.1+cu111
- torchaudio==0.9.1
- setuptools==59.5.0
- protobuf==3.20.0
- future==0.18.3

## Forked MMF Repository

We have provided a modification of the MMF codebase: https://github.com/mingshanhee/ExplainHatefulMeme-mmf

*Note: The forked version is meant for model inference. You are encouraged to train the model using the original MMF library.* 

## Data Preprocessing

### Visual Feature Cleaning
Multimodal memes often contain overlaid text on images, which can adversely affect classification performance. To mitigate this issue, we have implemented the image cleaning process developed by [HimariO](https://github.com/HimariO/HatefulMemesChallenge/blob/main/data_utils/README.md). This process improves the alignment between visual and textual features, thereby enhancing the performance of visual-language models and enabling better evaluation of their capabilities.

We have made available an lmdb file containing the visual features of the cleaned memes. However, we are unable to share the clean image files due to restrictions imposed by the participation agreements of the Facebook Hateful Memes Challenge. If you require the clean images for research purposes, we encourage you to rerun the image cleaning process and contact us at mingshan_hee@mymail.sutd.edu.sg for assistance.
- [img_clean.zip](https://sutdapac-my.sharepoint.com/:u:/g/personal/mingshan_hee_mymail_sutd_edu_sg/EWHrFCPMOGlHh25BPdbdxn0BQfMHiV18ycC6x6mhT6SDOA?e=8ePYsY)
- [detectron_clean.lmdb](https://sutdapac-my.sharepoint.com/:u:/g/personal/mingshan_hee_mymail_sutd_edu_sg/EfNA-XklRgxPiu9Pd-S1_dMBBR4cCHAF6cHwbOm9zK7f1A?e=5w7yaM)

Once you have downloaded the detectron.lmdb (by Facebook) or detectron_clean.lmdb (from us), you can refer to the modified version of the MMF codebase for feature extraction steps: [ExplainHatefulMeme-mmf - Feature Extraction](https://github.com/mingshanhee/ExplainHatefulMeme-mmf#feature-extraction)

*Important: This section is not mentioned in the paper due to an oversight and paper length restriction. A newer copy will be uploaded onto arxiv soon.*

### Model Checkpoints

We also made available the VisualBERT and ViLBERT model checkpoint that is fine-tuned on the visual features of cleaned memes. 
- [VisualBERT](https://sutdapac-my.sharepoint.com/:u:/g/personal/mingshan_hee_mymail_sutd_edu_sg/EUCFE11qI_NAjMetRpr0ZngB7s4tWkWgZJys7DmraqeFVg?e=qMmr6o)
- [ViLBERT](https://sutdapac-my.sharepoint.com/:u:/g/personal/mingshan_hee_mymail_sutd_edu_sg/ERhL5n9SokhOvzPXJ5FcimEBbNgdaxycsQQkLs9XHSBh3w?e=qyISVk)

## RQ1: Modality Attribution

To study the attribution of each modality, we utilized the [Integrated Gradients](https://arxiv.org/abs/1703.01365) technique. Integrated Gradients explain the relationship between a model's prediction in terms of its features. Specifically, it calculates the integral of gradients along the path from a given baseline to input. As we are dealing with multimodality inputs (in this case, vision and text modality), we will need to establish two baselines:
- Text Baselines: We use the "[PAD]" token for the baseline, as the "[PAD]" token indicates empty word tokens.
- Image Baselines: We use the value of 0.0 for the baseline, as the value of 0.0 can either (i) signify a completely black image or (2) represent there is no value to the image feature. *Note: it is possible to use other value for image baselines. For example, you can use a value of 255.0 to signify a completely white image. *

```python
from captum.attr import TokenReferenceBase

# Text Baseline
text_length = 128 # or input_ids.shape[1]
token_reference = TokenReferenceBase(reference_token_idx=102) # 102 is the [PAD] token ID
text_baseline = token_reference.generate_reference(128, device='cuda').unsqueeze(0)

# Image Baseline
# "image_features" can represents either
# (1) NxM matrix where N = length, M = width
# (2) NxM matrix where N = num_features, M = num_dimensions
image_baseline = image_features * 0.0 
```

As the process of using Layer Integrated Gradients involves multiple steps, we strongly encourage that you visit the following tutorials to grasp a better understanding
- [Intepreting Multimodal Models](https://captum.ai/tutorials/IMDB_TorchText_Interpret)
- [Interpreting Question Answering with BERT Part 2](https://captum.ai/tutorials/Bert_SQUAD_Interpret2)

Nevertheless, the implementation of Layer Integrated Gradients has been included in the [forked MMF repository](#forked-mmf-repository), which supports the modality attribution for VisualBERT and ViLBERT.

## RQ2: Visual-Slurs Grounding

To analyze the visual-text slurs alignments within the *Transformer-based* models, we retrieved the attention weights from the self-attention layers. In this section, we describe how to retrieve the attention weights from (1) MMF framework, and (2) Huggingface's Transformers Library. 

In a similar fashion, the ability to retrieve attention weights from the self-attention layers is incorporated in the [forked MMF repository](#forked-mmf-repository)

### Facebook's "MMF" Library (Used in this paper)

Facebook's "MMF" is a config-first framework that uses OmegaConf for its configuration system. To obtain the attention weights from the VisualBERT and ViLBERT, you have to turn on the following configuration settings:

**VisualBERT's Additional Configuration**
```bash
model_config.visual_bert.output_attentions=True
```

**ViLBERT's Additional Configuration**
```bash
model_config.vilbert.output_attentions=True
model_config.vilbert.visualization=True
```

### Huggingface's "Transformers" Library

According to the Huggingface's [documentation]("https://huggingface.co/docs/transformers/model_doc/visual_bert#transformers.VisualBertModel"), you will need to perform inference with "output_attentions=True"

```python
from transformers import VisualBertModel

# Initialize the model
model = VisualBertModel.from_pretrained("uclanlp/visualbert-vqa-coco-pre")

...

# Perform inference (IMPORTANT: output_attentions=True)
outputs = model(**inputs, output_attentions=True)
```