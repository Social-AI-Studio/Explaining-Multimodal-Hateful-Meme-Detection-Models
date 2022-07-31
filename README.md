# Explainable Multimodal Hateful Content

## Obtaining Input Gradients

To better understand how the different modalities input features contribute to the hateful meme classification task ("modality attribution"), we used a popular model interpretability library - *Captum*. 

In this section, we state (1) the specific package version and (2) the techniques used to compute the input feature attribution.

### Packages
- captum==0.5.0
- torch==1.9.1+cu111
- torchvision==0.10.1+cu111
- torchaudio==0.9.1

### Layer Integrated Gradients

To compute the input feature attribution, we computed the [Integrated Gradients](https://arxiv.org/abs/1703.01365) for each input modality. Specifically, we used the [Layer Integrated Gradients](https://captum.ai/docs/algorithms#layer-integrated-gradients) in the Captum library for this computation.

*Integrated Gradients* aims to explain the relationship between a model's prediction in terms of its features. Specifically, it calculates the integral of gradients along the path from a given baseline to input. As we are dealing with multimodality inputs (in this case, vision and text modality), we will need to establish two baselines:
- Text Baselines: We use the "[PAD]" token for the baseline, as the "[PAD]" token indicates empty word tokens.
- Image Baselines: We use the value of 0.0 for the baseline, as the value of 0.0 can either (i) signify a completely black image or (2) represent there is no value to the image feature. *Note: it is possible to use other value for image baselines. For example, you can use a value of 255.0 to signify a completely white image. *

```python
from captum.attr import TokenReferenceBase

# Text Baseline
token_reference = TokenReferenceBase(reference_token_idx=102)
text_baseline = token_reference.generate_reference(prepared_batch['input_ids'].shape[1], device='cuda').unsqueeze(0)

# Image Baseline
image_baseline = prepared_batch['image_feature_0'] * 0.0
```

As the process of using Layer Integrated Gradients involves multiple steps, we strongly encourage that you visit the following tutorials to grasp a better understanding
- [Intepreting Multimodal Models](https://captum.ai/tutorials/IMDB_TorchText_Interpret)
- [Interpreting Question Answering with BERT Part 2](https://captum.ai/tutorials/Bert_SQUAD_Interpret2)

Nonetheless, we have created a fork of the Facebook's *MMF* library with our implementation of the captum's library. Refer to the last section for further details.

## Obtaining Attention Weights

A primary focus of this paper focuses on analyzing the visual-text slurs alignments within *Transformer-based* models. the attention weights can be obtained from the respective models (i.e. VisualBERT, ViLBERT). The method of retrieving the attention weights is subjected to the libraries being used.

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


## Modified MMF Codebase For Visualization

Our modification of the MMF codebase can be found here: https://github.com/mingshanhee/ExplainHatefulMeme-mmf

*Note: The forked version is meant for model inference. You are encouraged to train the model using the original MMF library.* 