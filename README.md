<div align="center">
  
# ✦ NOVA_
**Advanced Neural Architecture for Personal Styling**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5_Flash-Vision-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Physics-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> NOVA is a multimodal AI engine that extracts demographic and stylistic vectors from user photos to curate hyper-personalized, shoppable wardrobes and grade outfit aesthetics in real-time.

</div>

---

# ⚡ Overview

NOVA bridges the gap between high-end fashion and machine learning.

Instead of relying on manual quizzes, NOVA uses Google's **Gemini 2.5 Flash vision model** to visually analyze a user's physical traits or current outfit.

It then queries a custom-built **vector database of real-world e-commerce products using Cosine Similarity** to recommend the perfect clothing matches.

---

# ✨ Key Features

## 🧠 Neural Lookbook (Get Clothes)

Drag and drop a photo into the glassmorphism scanner.

The AI extracts **5 core vectors**:

- Gender  
- Age Group  
- Occasion  
- Skin Tone  
- Style  

It instantly curates a **12-piece shoppable wardrobe** from a dataset of real ASOS products.

---

## 👗 Spatial Aesthetic Rater (Rate Outfit)

Upload a mirror selfie to receive a **dynamic 4-point breakdown**:

- Overall Rating  
- Color Harmony  
- Proportions  
- Trendiness  

Along with **actionable styling feedback**.

---

## ⚡ Hardware-Accelerated UI

A premium **Apple-tier interface** featuring:

- 3D magnetic hover physics  
- React-powered CSS scanning laser  
- Dynamic layout routing  
- GPU-accelerated animations powered by Framer Motion  

---

## 🛡️ Graceful Degradation System

The backend includes a **self-healing architecture**.

If the Google Gemini API rate limits the application (HTTP 429):

- The engine intercepts the crash  
- Generates realistic fallback data  
- Keeps the user experience completely uninterrupted  

---

# 🏗️ Architecture & Tech Stack

NOVA is built on a **decoupled microservice architecture**.

---

## Frontend (Client)

**Framework**
- Next.js (App Router)

**Styling**
- Tailwind CSS  
- Custom CSS Variables  

**Animation**
- Framer Motion  
  - GPU transforms  
  - Layout ID animations  
  - Spring physics  

**Interaction**
- React Dropzone  
- Haptic Feedback API  

---

## Backend (Core Engine)

**Framework**
- FastAPI (Python)

**AI / ML**
- Google Generative AI SDK (Gemini 2.5 Flash)

**Math & Filtering**
- Scikit-Learn  
  - Cosine Similarity  
  - OneHotEncoding  

**Data Processing**
- Pandas  

**Data Pipeline**
- Custom ETL scraper pulling real e-commerce data via RapidAPI (ASOS)

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+  
- Python 3.10+  
- Google Gemini API Key  

---

# 1️⃣ Backend Setup

Navigate to the backend directory and install dependencies.

```bash
cd backend
pip install -r requirements.txt
```

Set your environment variable:

```bash
export GEMINI_API_KEY="your_google_ai_key_here"
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

---

# 2️⃣ Frontend Setup

Navigate to the web directory and install dependencies.

```bash
cd nova-web
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

to interact with the **NOVA Neural Architecture**.

---

# 🧠 Data Engineering (ETL Pipeline)

NOVA does **not rely on dummy data**.

The project includes a custom scraper:

```
backend/ml/fetch_real_clothes.py TEST
```

This script calls the **ASOS RapidAPI endpoint** to compile a dataset of real clothing items including:

- Product names  
- Prices  
- Images  
- Purchase URLs  

---

## ⚙️ On-the-Fly Vectorization

When the server boots:

1. **Pandas** loads the compiled dataset  
2. **Scikit-Learn** encodes the textual features  
3. The system builds **vector matrices in memory**

This avoids `.pkl` serialization issues across environments.

---

<div align="center">

Engineered and Designed by **Himanshu Singh**

</div>
