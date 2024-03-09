import pickle
import pandas as pd
import numpy as np
import warnings
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

warnings.filterwarnings("ignore")

your_dataset = pd.read_csv('archive/data.csv')

# Sample a portion of the dataset (adjust the fraction as needed)
sampled_dataset = your_dataset.sample(frac=0.1, random_state=42)

# Drop columns that are not needed
sampled_dataset.drop(['nameOrig', 'nameDest', 'isFlaggedFraud'], axis=1, inplace=True)

sampled_dataset.dropna(inplace=True)

# Assuming the target column is named 'isFraud'
X = sampled_dataset.drop('isFraud', axis=1)
y = sampled_dataset['isFraud']

# Encode the categorical columns using LabelEncoder
label_encoder = LabelEncoder()

# Fit the LabelEncoder to the entire 'type' column to ensure all categories are encountered
label_encoder.fit(sampled_dataset['type'])
X['type'] = label_encoder.transform(X['type'])

# Use one-third of the sampled data for training
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1, random_state=42)

model = RandomForestClassifier(n_estimators=30, max_depth=10, random_state=42, n_jobs=-1)

# Train the classifier on the training data
model.fit(X_train, y_train)

# Make predictions on the test data
y_pred = model.predict(X_test)

# Evaluate the performance
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

# Print classification report
print("Classification Report:")
print(classification_report(y_test, y_pred))

input_data = {
    'step': 1,
    'type': 'PAYMENT',
    'amount': 9839.64,
    'oldbalanceOrg': 170136,
    'newbalanceOrig': 160296.36,
    'oldbalanceDest': 0,
    'newbalanceDest': 0
}

import pandas as pd

# Create a DataFrame from the input_data dictionary
input_df = pd.DataFrame(input_data, index=[0])

# Encode categorical columns in input_df
input_df['type'] = label_encoder.transform(input_df['type'])

# Predict label using the trained model
predicted_label = model.predict(input_df)[0]
print("Predicted Label:", predicted_label)

pickle.dump(model, open('model.pkl', 'wb'))
pickled_model = pickle.load(open('model.pkl', 'rb'))
print(pickled_model.predict(X_test))