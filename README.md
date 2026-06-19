# ATS Resume Analyzer 🚀

ATS Resume Analyzer is a modern web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The application parses resumes (PDFs), compares them against specific Job Descriptions (JD), calculates compatibility scores, highlights matching and missing keywords/skills, and provides AI-driven suggestions to improve resume visibility.

---

## 🌟 Key Features

- **🔐 Secure Authentication:** User signup and login utilizing JWT (JSON Web Tokens) and bcrypt password hashing.
- **📄 PDF Parsing:** Local client-side and server-side PDF parsing to extract clean resume text.
- **🤖 Gemini AI Integration:** Leverages the **Google Gemini API (`gemini-2.5-flash`)** to deliver intelligent suggestions and deep skill gap analysis.
- **📉 Local Fallback Analyzer:** Features a built-in regex-based keyword matching algorithm as a fallback if the Gemini API key is not configured.
- **📊 ATS Compatibility Scoring:** Displays a color-coded percentage score based on matching skill keywords.
- **🗃️ Dashboard History:** Users can track, view, and manage their previously uploaded and analyzed resumes.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 (via Vite)
- **Routing:** React Router v7
- **Styling:** Vanilla CSS (Modern, responsive grid & flexbox design)
- **Utility:** `pdfjs-dist` for client-side PDF handling, `jspdf`

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS
- **File Upload:** Multer middleware
- **PDF Text Extraction:** `pdfjs-dist`

---

## 📁 Project Structure

```text
ATS-Analyzer/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/      # Images & SVGs
│   │   ├── components/  # Page & reusable components (Login, Register, Dashboard, Navbar, etc.)
│   │   ├── utils/       # Client-side PDF reader utilities
│   │   ├── App.jsx      # Core React Router routing
│   │   └── main.jsx     # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/              # Node.js Express Backend
│   ├── controllers/     # Auth and Resume request handlers
│   ├── middleware/      # Auth security guard & Multer setup
│   ├── models/          # Mongoose database schemas (User, Resume)
│   ├── routes/          # Express API endpoints
│   ├── utils/           # AI analysis logic & local keyword matchers
│   ├── server.js        # Backend entry point
│   └── package.json
│
├── .gitignore           # Global git ignore file
└── README.md            # Project documentation
```

---

## ⚡ Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas URI string)

---

### 🚀 Installation & Setup

Follow these steps to get a local copy up and running:

#### 1. Clone the Repository
```bash
git clone https://github.com/krishnamnamithaa/ATS-Analyzer.git
cd ATS-Analyzer
```

#### 2. Configure Backend Server
Navigate to the `server/` directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder and add the following keys:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ats-analyzer
JWT_SECRET=your_super_secret_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> 💡 *Note: If `GEMINI_API_KEY` is left blank, the application will automatically fallback to the local keyword matching engine.*

Start the backend server in development mode:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

#### 3. Configure Frontend Client
Navigate to the `client/` directory from the root:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The client application will start running, usually at `http://localhost:5173`.

---

## 🛡️ License

This project is licensed under the ISC License.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
