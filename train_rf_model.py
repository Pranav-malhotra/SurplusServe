import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# 1. Load your data
df = pd.read_csv('food_wastage_data.csv')

# 2. Drop unnecessary columns
cols_to_drop = [
    'Pricing', 'Storage Conditions', 
    'Purchase History', 'Preparation Method'
]
df = df.drop(columns=[col for col in cols_to_drop if col in df])

# 3. Preprocessing
categorical_features = ['Type of Food', 'Event Type', 'Seasonality', 'Geographical Location']
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_encoded = encoder.fit_transform(df[categorical_features])
encoded_columns = encoder.get_feature_names_out(categorical_features)
X_encoded_df = pd.DataFrame(X_encoded, columns=encoded_columns, index=df.index)

# Combine encoded cats and numeric cols
numeric_features = ['Number of Guests', 'Quantity of Food']
X_full = pd.concat([X_encoded_df, df[numeric_features]], axis=1)
y_full = df['Wastage Food Amount']

# 4. Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X_full, y_full, test_size=0.2, random_state=42
)

# 5. Scale numeric features
scaler = StandardScaler()
X_train[numeric_features] = scaler.fit_transform(X_train[numeric_features])
X_test[numeric_features] = scaler.transform(X_test[numeric_features])

# 6. Random Forest with GridSearchCV
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt', 'auto']
}

rf = RandomForestRegressor(random_state=42)

grid_search = GridSearchCV(
    rf, param_grid, 
    cv=3, n_jobs=-1, 
    scoring='neg_mean_squared_error', verbose=2
)
grid_search.fit(X_train, y_train)

best_rf = grid_search.best_estimator_
print('Best Parameters:', grid_search.best_params_)

# 7. Evaluate on Test Data
y_pred = best_rf.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print(f'MAE: {mae:.2f}')
print(f'RMSE: {rmse:.2f}')
print(f'R^2: {r2:.2f}')



# Save the trained Random Forest model
joblib.dump(best_rf, 'rf_model.pkl')

# Save the OneHotEncoder
joblib.dump(encoder, 'encoder.pkl')

# Save the StandardScaler
joblib.dump(scaler, 'scaler.pkl')

print("Model, encoder, and scaler saved successfully!")
