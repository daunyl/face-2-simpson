# Character Resemblance Predictor

Discover which "The Simpsons" character you resemble with our state-of-the-art ML-powered Next.js application.

🚀 [Live Application](https://face-2-simpson.vercel.app/)

## Table of Contents

- [Application Overview](#application-overview)
- [AWS Infrastructure](#aws-infrastructure)
- [Python ML Models](#python-ml-models)
- [Getting Started](#getting-started)
- [Developers](#developers)

## Application Overview

Crafted using Next.js 13 with TypeScript and supercharged by SSR, this application uses ML to identify the Simpson character that an uploaded image most resembles. The dashboard provides rich analytics powered by Chart.js.

### Features

- **Image Prediction**: Find your Simpson character match.
- **Tailwind CSS**: Sleek and modern styling.
- **Dashboard Analytics**:
  - Predicted Character Distribution.
  - Model Accuracy Evolution.
  - Time-based Prediction Analytics.

### Tech Stack

- **Next.js 13**: Enhanced performance and SSR.
- **TypeScript**: Robust application design.
- **MongoDB**: Efficient data management with advanced retrieval.
- **Tailwind CSS**: Responsive UI design.
- **Chart.js**: Dashboard data visualization.

## AWS Infrastructure

Our setup uses AWS to create a seamless interaction between the ML model deployment and the user.

### Core Components:

1. **AWS Lambda**: Rapid ML model execution via Docker images from AWS ECR.
2. **AWS API Gateway**: RESTful interface to Lambda functions, assuring scalability and security.
3. **AWS ECR**: Docker image storage, integrated with GitHub Actions for automated CI/CD.
4. **AWS S3**: Image storage with secure, direct client uploads via Presigned URLs.

### CI/CD Workflow:

1. GitHub Actions activate upon code pushes.
2. Images are dockerized and pushed to ECR.
3. Lambda functions are updated with the new images.

### Security:

- **Presigned URLs**: Temporary secured links ensuring safe S3 client operations.

## Python ML Models

### Model Architecture

The core of the model is MobileNet, which serves as a pre-trained convolutional neural network (CNN). MobileNet is well-suited for tasks like image classification and feature extraction. Transfer learning involves fine-tuning MobileNet on a dataset of images that resemble the target characters.

### Data Collection

The model relies on a dataset comprising images of individuals who closely resemble "The Simpsons" characters. Each character category (Homer, Marge, Bart, Lisa) consists of 350 hand-selected images obtained from internet sources. The data collection process involved a [script to search the internet for suitable images](model_notebooks/get_images.ipynb), and manual curation to ensure the quality and relevance of the images.

### Optimization Techniques

To improve the model's performance, several optimization techniques were employed:

**Learning Rate Scheduler**

A learning rate scheduler was implemented to adjust the learning rate during training. This technique helps to converge faster and achieve better accuracy.

**Early Stopper**

The early stopper mechanism was integrated to monitor the validation loss during training. If the validation loss stops improving for a specified number of epochs, training is terminated early to prevent overfitting.

**Dropout**

Dropout layers were introduced in the model architecture to reduce overfitting. Dropout randomly deactivates a fraction of neurons during each training iteration, preventing the model from relying too heavily on specific features.

**Data Augmentation**

Custom image transformations were developed to augment the training dataset. These transformations include random horizontal flips, contrast adjustments, and brightness variations. Data augmentation helps the model generalize better to unseen data.

### Image Transforms

Here is an example of the image transforms applied during training:

```python
train_transformer = transforms.Compose([
      transforms.Resize(IMAGE_SIZE),
      transforms.CenterCrop(IMAGE_SIZE),
      transforms.RandomChoice( [
                                transforms.RandomHorizontalFlip(p=0.5),
                                transforms.ColorJitter(contrast=0.9),
                                transforms.ColorJitter(brightness=0.1),
                                transforms.RandomApply( [ transforms.RandomHorizontalFlip(p=1), transforms.ColorJitter(contrast=0.9) ], p=0.5),
                                transforms.RandomApply( [ transforms.RandomHorizontalFlip(p=1), transforms.ColorJitter(brightness=0.1) ], p=0.5),
                                ] ),
      transforms.ToTensor(),
      transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
  ])
```

### Training Configuration

- Batch Size: 32
- Optimizer: Adam
- Loss Function: CrossEntropyLoss with label smoothing (0.1)

### Retraining Mechanism

In this project, a sophisticated retraining mechanism has been implemented to ensure that the model remains up-to-date and continues to deliver accurate predictions over time. The primary goal of this mechanism is to keep the model's performance optimized and adaptive to changing data.

**How it Works**

- **Regular Retraining**: The retraining process is scheduled to occur at regular intervals, specifically every three days. This periodicity ensures that the model is continually exposed to new data and can adapt to any emerging trends or variations in the input data.

- **Evaluatio**n: During each retraining cycle, the model is trained anew on the most recent data. After training, the model's performance is evaluated using a test dataset to measure its accuracy.

- **Comparison**: The accuracy of the newly trained model is compared to the accuracy of the previous model. This step is crucial in determining whether the new model is an improvement over the existing one.

- **Decision Making**: A decision-making mechanism is employed to assess whether the newly trained model is superior in terms of accuracy. If the new model exhibits higher accuracy, it replaces the old one as the current working model. Otherwise, the old model is retained.

**Benefits of Retraining**

The retraining functionality provides several advantages:

- **Adaptability**: By retraining at regular intervals, the model remains adaptable to changes in data distribution and the evolving characteristics of the target characters (Homer, Marge, Bart, Lisa).

- **Performance Maintenance**: The mechanism ensures that the model's performance remains optimized, preventing issues like overfitting or underfitting that may arise from stagnant models.

- **Consistent Accuracy**: Users can trust that the model is continually fine-tuned to provide reliable predictions, enhancing the overall user experience.

- **Automated**: The entire process is automated, reducing the need for manual intervention and enabling seamless updates.

By implementing this retraining mechanism, this project ensures that the model's predictive capabilities remain robust and dependable, contributing to its long-term success in identifying individuals resembling characters from "The Simpsons."

### Conclusion

The Character Resemblance Prediction Model leverages transfer learning, careful data curation, and optimization techniques to accurately predict how much a person resembles "The Simpsons" characters. It offers a powerful tool for character resemblance analysis and can be further fine-tuned and extended for various applications.

## Getting Started

Learn how to set up and run the Next.js application and the Python server with AWS Lambda functions locally.

### 📌 Prerequisites

- Yarn package manager
- AWS SAM CLI

### 🖥️ 1. Next.js Application Setup

1. **Navigate to the `next-app` directory**:
    ```bash
    cd next-app
    ```

2. **Install dependencies**:
    ```bash
    yarn
    ```

3. **Start the development server**:
    ```bash
    yarn dev
    ```

Visit [`http://localhost:3000`](http://localhost:3000).

### 🐍 2. Python Server with AWS Lambda Functions

1. **Return to the project root**:
    ```bash
    cd ..
    ```

2. **Enter the `python-server` directory**:
    ```bash
    cd python-server
    ```

3. **Set up AWS SAM CLI** as per the [official documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

4. **Build using the SAM CLI**:
    ```bash
    sam build
    ```

5. **Start the local API**:
    ```bash
    sam local start-api -d 5858 --debug
    ```

## Developers

- [Ruslan Kotliarenko](https://www.linkedin.com/in/ruslan-kotliarenko/) - Application & AWS Infrastructure
- [Danylo Sushko](https://www.linkedin.com/in/danylo-sushko/) - Python ML Models
