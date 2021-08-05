# Explainable Multimodal Hateful Content

## 1. Experiment Results (HatefulMemes v1)

### 1.1 Experiment Results (Pretrained Model)

| **Validation**    | Binary F1 | Accuracy | ROC AUC |
| ----------------- | --------- | -------- | ------- |
| Late Fusion       | 0.3804    | 0.5700   | 0.6383  |
| Concat BERT       | 0.5561    | 0.6360   | 0.6644  |
| VilBERT           | 0.4393    | 0.6120   | 0.6881  |
| VisualBert        | 0.4401    | 0.5980   | 0.7105  |
| VilBERT (CC)      |
| VisualBert (COCO) | 0.4891    | 0.6420   | 0.7273  |

| **Testing**       | Binary F1 | Accuracy | ROC AUC |
| ----------------- | --------- | -------- | ------- |
| Late Fusion       | 0.4994    | 0.6070   | 0.6722  |
| Concat BERT       | 0.4739    | 0.6070   | 0.6891  |
| VilBERT           | 0.4565    | 0.6190   | 0.7218  |
| VisualBert        | 0.4972    | 0.6360   | 0.7307  |
| VilBERT (CC)      |
| VisualBert (COCO) | 0.4938    | 0.6330   | 0.7179  |

### 1.2 Experiment Results (Train & Test on Uncleaned Images)

| **Validation** | Binary F1 | Accuracy | ROC AUC | Epoch |
| -------------- | --------- | -------- | ------- | :---: |
| Late Fusion    | 0.4855    | 0.6100   | 0.6577  |  13   |
| Concat BERT    | 0.4538    | 0.5860   | 0.6459  |  16   |
| VilBERT        | 0.4820    | 0.6260   | 0.7172  |  18   |
| VisualBert     | 0.5238    | 0.6400   | 0.7142  |  20   |

| **Testing** | Binary F1 | Accuracy | ROC AUC |
| ----------- | --------- | -------- | ------- |
| Late Fusion | 0.5032    | 0.6110   | 0.6712  |
| Concat BERT | 0.5133    | 0.6150   | 0.6912  |
| VilBERT     | 0.5353    | 0.6580   | 0.7393  |
| VisualBert  | 0.5835    | 0.6760   | 0.7395  |

### 1.3 Experiment Results (Train & Test on Cleaned Images)

| **Validation**    | Binary F1 | Accuracy | ROC AUC | Epoch |
| ----------------- | --------- | -------- | ------- | :---: |
| VisualBert        | 0.5920    | 0.6720   | 0.7226  |  14   |
| VisualBert (COCO) | 0.5333    | 0.6500   | 0.7400  |  29   |
| VilBERT (CC)      | 0.5879    | 0.6720   | 0.7502  |  19   |

| **Testing**       | Binary F1 | Accuracy | ROC AUC |
| ----------------- | --------- | -------- | ------- |
| VisualBert        | 0.5902    | 0.6570   | 0.7325  |
| VisualBert (COCO) | 0.5333    | 0.6500   | 0.7445  |
| VilBERT (CC)      | 0.6073    | 0.6870   | 0.7570  |

## 2. Experiment Results (HatefulMemes v2)

### 2.2 Using Pretrained Keys (from MMF)

| **Validation**    | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
| ----------------- | ------------- | ---------- | --------- | -------- | ------- |
| Concat BERT       | 0.7506        | 0.7506     | 0.3197    | 0.6296   | 0.6165  |
| VilBERT           | 2.2624        | 2.2624     | 0.4000    | 0.6778   | 0.6566  |
| VisualBert        | 1.2431        | 1.2431     | 0.4120    | 0.6685   | 0.6944  |
| VilBERT (CC)      | 0.7821        | 0.7821     | 0.4779    | 0.4741   | 0.5024  |
| VisualBert (COCO) | 0.6766        | 0.6766     | 0.1151    | 0.5925   | 0.4806  |

| **Testing**       | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
| ----------------- | ------------- | ---------- | --------- | -------- | ------- |
| Concat BERT       | 0.7142        | 0.7142     | 0.3611    | 0.6355   | 0.6399  |
| VilBERT           | 1.9272        | 1.9272     | 0.5004    | 0.7045   | 0.7242  |
| Visual Bert       | 1.0653        | 1.0653     | 0.5530    | 0.7015   | 0.7286  |
| VilBERT (CC)      | 0.7760        | 0.7760     | 0.4681    | 0.4665   | 0.5084  |
| VisualBert (COCO) | 0.9020        | 0.902 0    | 0.5455    | 0.3750   | 0.5178  |

### 1.2 Training from Scratch (10 epochs)

| **Validation** | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
| -------------- | ------------- | ---------- | --------- | -------- | ------- |
| Late Fusion    | 1.0994        | 1.0994     | 0.3031    | 0.6333   | 0.5906  |
| Concat BERT    | 2.3705        | 2.3705     | 0.3762    | 0.6444   | 0.6142  |
| VilBERT        |
| VisualBert     | 1.3544        | 1.3544     | 0.3531    | 0.6611   | 0.6734  |

| **Testing** | Cross Entropy | Total Loss | Binary F1 | Accuracy | ROC AUC |
| ----------- | ------------- | ---------- | --------- | -------- | ------- |
| Late Fusion | 1.0149        | 1.0149     | 0.3744    | 0.6560   | 0.6524  |
| Concat BERT | 2.2556        | 2.2556     | 0.4198    | 0.6625   | 0.6625  |
| VilBERT     |               |
| VisualBert  | 1.2591        | 1.2591     | 0.4187    | 0.6860   | 0.7092  |

## 2. Visualisation - Class Activation Maps

https://docs.google.com/spreadsheets/d/15T45TmdODYCIYIzuluP_bdOvrpPkdT1VdSiWgLCPI0M/edit?usp=sharing

## 3. Datasets

### 3.1 Dataset Distribution

| **Validation** | Total Records | Hateful Records |
| -------------- | ------------- | --------------- |
| Overall        | 500           | 247 (0.494)     |
| Human          | 360           | 186 (0.5167)    |
| Non-Human      | 140           | 61 (0.4357)     |


| **Testing** | Total Records | Hateful Records |
| ----------- | ------------- | --------------- |
| Overall     | 1,000         | 490 (0.49)      |
| Human       | 713           | 379 (0.5316)    |
| Non-Human   | 287           | 111 (0.3868)    |


### 3.2 Human Gender Distribution

| Visual BERT | Hateful (True) | Not Hateful (True) | Hateful (Predicted) | Not Hateful (Predicted) |
| :---------- | -------------: | -----------------: | ------------------: | ----------------------: |
| Female      |            132 |                113 |                  87 |                     158 |
| Male        |            193 |                163 |                 130 |                     226 |
| Mixed       |             54 |                 58 |                  37 |                      75 |

| Visual BERT (COCO) | Hateful (True) | Not Hateful (True) | Hateful (Predicted) | Not Hateful (Predicted) |
| :----------------- | -------------: | -----------------: | ------------------: | ----------------------: |
| Female             |            132 |                113 |                  71 |                     174 |
| Male               |            193 |                163 |                 126 |                     230 |
| Mixed              |             54 |                 58 |                  30 |                      82 |

| VilBERT (CC) | Hateful (True) | Not Hateful (True) | Hateful (Predicted) | Not Hateful (Predicted) |
| :----------- | -------------: | -----------------: | ------------------: | ----------------------: |
| Female       |            132 |                113 |                  66 |                     179 |
| Male         |            193 |                163 |                 106 |                     250 |
| Mixed        |             54 |                 58 |                  31 |                      81 |

### 3.2 Human Race Distribution

| Visual BERT     | Hateful (True) | Not Hateful (True) | Hateful (Predicted) | Not Hateful (Predicted) |
| :-------------- | -------------: | -----------------: | ------------------: | ----------------------: |
| White           |            173 |                156 |                 118 |                     211 |
| Mixed           |             82 |                 77 |                  60 |                      99 |
| Black           |             61 |                 47 |                  34 |                      74 |
| Middle Eastern  |             10 |                  8 |                   9 |                       9 |
| East Asian      |             16 |                 16 |                   8 |                      24 |
| Latino_Hispanic |             17 |                 21 |                  14 |                      24 |
| Southeast Asian |              8 |                  5 |                   5 |                       8 |
| Indian          |             12 |                  4 |                   6 |                      10 |

| Visual BERT (COCO) | Hateful (True) | Not Hateful (True) | Hateful (Predicted) | Not Hateful (Predicted) |
| :----------------- | -------------: | -----------------: | ------------------: | ----------------------: |
| White              |            173 |                156 |                 108 |                     221 |
| Mixed              |             82 |                 77 |                  51 |                     108 |
| Black              |             61 |                 47 |                  30 |                      78 |
| Middle Eastern     |             10 |                  8 |                   9 |                       9 |
| East Asian         |             16 |                 16 |                   9 |                      23 |
| Latino_Hispanic    |             17 |                 21 |                  10 |                      28 |
| Southeast Asian    |              8 |                  5 |                   5 |                       8 |
| Indian             |             12 |                  4 |                   5 |                      11 |

| VilBERT (CC)    | Hateful (True) | Not Hateful (True) | Hateful (Predicted) | Not Hateful (Predicted) |
| :-------------- | -------------: | -----------------: | ------------------: | ----------------------: |
| White           |            173 |                156 |                 108 |                     221 |
| Mixed           |             82 |                 77 |                  51 |                     108 |
| Black           |             61 |                 47 |                  30 |                      78 |
| Middle Eastern  |             10 |                  8 |                   9 |                       9 |
| East Asian      |             16 |                 16 |                   9 |                      23 |
| Latino_Hispanic |             17 |                 21 |                  10 |                      28 |
| Southeast Asian |              8 |                  5 |                   5 |                       8 |
| Indian          |             12 |                  4 |                   5 |                      11 |