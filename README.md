<div align="center">
  
# 🧠 ClearMind

**An accessibility-first productivity platform designed specifically for students with ADHD, Dyslexia, and Autism.**

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>

---

## 🌟 Overview

ClearMind is not just another to-do list. It is an adaptive, AI-powered study companion built to understand and accommodate neurodivergent cognitive profiles. By transforming generic assignments into highly structured, visually accessible, and interactable roadmaps, ClearMind removes the executive dysfunction barriers that often prevent students from reaching their full potential.

## ✨ Key Features

### 🤖 AI Task Breakdown Engine (Powered by Gemini)
Upload a PDF, drop in an image, or just type out your assignment description. ClearMind's AI engine instantly breaks down the task into four distinct, interactable cognitive profiles:
- **ADHD Mode:** Focuses on single-step execution, high-dopamine microtasks, and gamified progress tracking.
- **Dyslexia Mode:** Transforms content into highly readable, distraction-free flashcard slides with large typography and pastel backgrounds.
- **Autism Mode:** Provides a highly structured, rigid, and predictable roadmap with explicit categorization (Preparation, Execution, Review, Completion).
- **Standard Mode:** A clean, traditional checklist with collapsible subtasks.

### ⏱️ Global Focus Timer
A persistent, floating Pomodoro timer that follows you across the entire application, ensuring you can manage work intervals and breaks without losing context.

### 🧩 Smart Onboarding & Assessment
A built-in diagnostic quiz that evaluates your study habits and cognitive preferences to automatically tailor the app's default mode to your specific needs.

### 💬 Community Hub
A safe, inclusive space for students to share wins, ask questions, and support each other.
- **Shoutouts:** Quick, encouraging posts with persistent likes.
- **Discussion Forum:** In-depth threads for peer support and study strategies.

### 🔒 Privacy-First Architecture
All task tracking, authentication states, and quiz results are managed securely within your browser's local storage and context providers. Your personal data never leaves your device.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/clearmind.git
   cd clearmind
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application running.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with responsive dark mode and custom accessibility tokens)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **AI Integration:** Google Gemini Generative Language REST API (`gemini-flash-latest`)
- **Backend/Database:** Firebase Firestore (for Community Forums and Shoutouts)
- **State Management:** React Context API & Custom Hooks

---

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI components (TaskCards, Timer, Nav, etc.)
├── context/          # React Context providers (Tasks, App State, Community)
├── logic/            # Core business logic and AI prompt generation templates
├── pages/            # Top-level route components (Dashboard, Community, Quiz)
├── services/         # External API integrations (Gemini AI, Firebase)
└── data/             # Static mock data and configuration files
```

---

## 🤝 Contributing

We welcome contributions! If you're passionate about accessibility and education, feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <i>Built with ❤️ for accessible education.</i>
</div>
