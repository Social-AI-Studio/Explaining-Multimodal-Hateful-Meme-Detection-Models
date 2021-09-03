# 1. Google Spreadsheet Link
https://docs.google.com/spreadsheets/d/1sXjDrAUR22iFHIjg3UPP11_E-l3JUatTxH5OSyOi2KA/edit?usp=sharing

# 2. Protected Category - Sex

## 2.1 Fine-Grained Category + Keywords

| Category   | Keywords                                              |
| ---------- | ----------------------------------------------------- |
| **Male**   | "he", "man", "men", "boy", "male"                     |
| **Female** | "she", "woman", "woman", "girl", "feminist", "female" |
| **LGBT**   | "lgbt", "gay", 'bisexual', 'queer', 'tran*'           |

## 2.1 Distribution (Manual Labeling)

| Category   | Train (train) | Validation (dev_seen) |
| ---------- | :-----------: | :-------------------: |
| Male       |       -       |           5           |
| Female     |      39       |          33           |
| LGBT       |      59       |          18           |
| Mislabeled |       2       |           -           |
| Total      |      100      |          56           |

## 2.3 Pseudo-Labels

|                    | Train (train) | Validation (dev_seen) |
| ------------------ | ------------- | --------------------- |
| Labelled           | 79 (79%)      | 41 (73.21%)           |
| Labelled (Correct) | 73            | 31                    |
| Precision          | 92.4%         | 75.6%                 |


# 2. Protected Category - Race

## 2.1 Distribution (Manual Labeling)

| Category                               | Train (train) | Validation (dev_seen) |
| -------------------------------------- | :-----------: | :-------------------: |
| **Black**                              |      62       |          42           |
| **White**                              |       9       |          11           |
| **Middle East**                        |       5       |           9           |
| **Hispanic/Latino**                    |       0       |           4           |
| **American Indian**                    |       3       |           0           |
| **Asia (East Asia + South East Asia)** |       5       |           2           |
| German                                 |       0       |           1           |
| White Or Black                         |       0       |           1           |
| ???                                    |      16       |           8           |
| Total                                  |      100      |          78           |

Middle East: Consists of Arabs, Iraqis and etc
Asia: Chinese, Koreas
Hispanic/Latino: Mexicans

## 2.2 Fine-Grained Category + Keywords

| Category                           | Keywords                                                |
| ---------------------------------- | ------------------------------------------------------- |
| Black                              | black, obama, barack, gorilla, mississippi, nigger, ape |
| White                              | cracker                                                 |
| Middle East                        | israel, arab, africa                                    |
| Hispanic/Latino                    |                                                         |
| Asia (East Asia + South East Asia) | brown, chinese, asia                                    |

## 2.3 Pseudo-Labels

|                    | Train (train) | Validation (dev_seen) |
| ------------------ | ------------- | --------------------- |
| Labelled           | 63 (75%)      | 35 (45.7%)            |
| Labelled (Correct) | 52            | 24                    |
| Precision          | 82.53%        | 68.57%                |



# 3. Protected Category - Religion

## 3.1 Distribution (Manual Labeling)

| Category               | Train (train) | Validation (dev_seen) |
| ---------------------- | :-----------: | :-------------------: |
| **Muslim**             |      65       |           -           |
| **Jews**               |      28       |           -           |
| **catholic christian** |       3       |           -           |
| **christian**          |       1       |           -           |
| ???                    |       3       |           -           |
| Total                  |      100      |           -           |

## 3.2 Fine-Grained Category + Keywords

| Category           | Keywords                                                   |
| ------------------ | ---------------------------------------------------------- |
| Muslim             | muslim, islamic, islam, moslem, hijab, jihad, burqa, abdul |
| Jews               | nazi, hitler, jew*                                         |
| Catholic Christian | catholic, pedo*                                            |
| Christian          |                                                            |

## 3.3 Pseudo-Labels

|                    | Train (train) | Validation (dev_seen) |
| ------------------ | ------------- | --------------------- |
| Labelled           | 73 (70%)      | -                     |
| Labelled (Correct) | 70            | -                     |
| Precision          | 95.89%        | -                     |


