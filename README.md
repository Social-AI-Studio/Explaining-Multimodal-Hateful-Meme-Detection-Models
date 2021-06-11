# Explainable Multimodal Hateful Content

## 1. Experiment Results

### 1.1 Using Pretrained Keys (from MMF)

| **Validation**       | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
|----------------------|---------------|------------|-----------|----------|---------|
| Concat BERT          | 0.7506        | 0.7506     | 0.3197    | 0.6296   | 0.6165  |
| VilBERT              | 2.2624        | 2.2624     | 0.4000    | 0.6778   | 0.6566  |
| VisualBert           | 1.2431        | 1.2431     | 0.4120    | 0.6685   | 0.6944  |
| VilBERT (CC)         | 0.7821        | 0.7821     | 0.4779    | 0.4741   | 0.5024  |
| VisualBert (COCO)    | 0.6766        | 0.6766     | 0.1151    | 0.5925   | 0.4806  |

| **Testing**          | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
|----------------------|---------------|------------|-----------|----------|---------|
| Concat BERT          | 0.7142        | 0.7142     | 0.3611    | 0.6355   | 0.6399 | 
| VilBERT              | 1.9272        | 1.9272     | 0.5004    | 0.7045   | 0.7242 |
| Visual Bert          | 1.0653        | 1.0653     | 0.5530    | 0.7015   | 0.7286 |
| VilBERT (CC)         | 0.7760        | 0.7760     | 0.4681    | 0.4665   | 0.5084 |
| VisualBert (COCO)    | 0.9020        | 0.902 0    | 0.5455    | 0.3750   | 0.5178 |

### 1.2 Training from Scratch (10 epochs)

| **Validation**       | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
|----------------------|---------------|------------|-----------|----------|---------|
| Late Fusion          |1.0994|1.0994|0.3031|0.6333|0.5906|
| Concat BERT          |2.3705|2.3705|0.3762|0.6444|0.6142|
| VilBERT              |
| VisualBert           |1.3544|1.3544|0.3531|0.6611|0.6734|

| **Testing**          | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
|----------------------|---------------|------------|-----------|----------|---------|
| Late Fusion          |1.0149|1.0149|0.3744|0.6560|0.6524|
| Concat BERT          |2.2556|2.2556|0.4198|0.6625|0.6625|
| VilBERT              |
| VisualBert           |1.2591|1.2591|0.4187|0.6860|0.7092|

## 2. Visualisation - Class Activation Maps
https://docs.google.com/spreadsheets/d/15T45TmdODYCIYIzuluP_bdOvrpPkdT1VdSiWgLCPI0M/edit?usp=sharing