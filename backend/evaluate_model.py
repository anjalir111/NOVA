import pandas as pd
import numpy as np
import os
import random
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder

BASE = os.path.dirname(__file__)
CSV_PATH = os.path.join(BASE, "data", "fashion_dataset.csv")

def evaluate_engine(num_test_users=100):
    print(f"🚀 Initializing NOVA Evaluation Protocol for {num_test_users} simulated users...\n")
    try:
        df = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        print("❌ Could not find fashion_dataset.csv. Run your data generator first.")
        return

    features = ["gender", "age_group", "occasion", "skin_tone", "style"]
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    dataset_vecs = encoder.fit_transform(df[features])
    
    total_similarity = 0
    style_match_count = 0
    occasion_match_count = 0
    total_recommendations_checked = 0

    print("📊 Running Simulations...\n")
    print(f"{'User Request (Style / Occasion)':<40} | {'Avg Cosine Similarity':<25} | {'Match Quality'}")
    print("-" * 90)

    for i in range(num_test_users):
        test_user = {
            "gender": random.choice(df["gender"].unique()),
            "age_group": random.choice(df["age_group"].unique()),
            "occasion": random.choice(df["occasion"].unique()),
            "skin_tone": random.choice(df["skin_tone"].unique()),
            "style": random.choice(df["style"].unique())
        }

        user_df = pd.DataFrame([test_user])
        user_vec = encoder.transform(user_df)
        sim = cosine_similarity(user_vec, dataset_vecs)
        
        top_indices = sim[0].argsort()[-5:][::-1]
        top_scores = sim[0][top_indices]
        top_items = df.iloc[top_indices]

        avg_sim = np.mean(top_scores)
        total_similarity += avg_sim
        
        style_matches = sum(top_items["style"] == test_user["style"])
        occasion_matches = sum(top_items["occasion"] == test_user["occasion"])
        
        style_match_count += style_matches
        occasion_match_count += occasion_matches
        total_recommendations_checked += 5

        if i < 10:
            req_str = f"{test_user['style']} / {test_user['occasion']}"
            match_str = f"Style: {style_matches}/5 | Occasion: {occasion_matches}/5"
            print(f"{req_str:<40} | {avg_sim:.4f} (Max 1.0)           | {match_str}")

    system_avg_sim = total_similarity / num_test_users
    style_accuracy = (style_match_count / total_recommendations_checked) * 100
    occasion_accuracy = (occasion_match_count / total_recommendations_checked) * 100

    print("\n" + "="*50)
    print("📈 NOVA SYSTEM METRICS (Offline Evaluation)")
    print("="*50)
    print(f"System Mean Cosine Similarity : {system_avg_sim:.4f} (Ideal is > 0.80)")
    print(f"Style Match Rate              : {style_accuracy:.1f}% (Top 5 items matching requested style)")
    print(f"Occasion Match Rate           : {occasion_accuracy:.1f}% (Top 5 items matching requested occasion)")
    print("="*50)

if __name__ == "__main__":
    evaluate_engine(100)