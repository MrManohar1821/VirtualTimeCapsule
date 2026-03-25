# Comprehensive Project Setup Guide 🚀

This guide provides a step-by-step process to clone, configure, and run the **Virtual Time Capsule** project on any machine.

---

## 📋 Prerequisites
Ensure you have the following installed:
- [Git](https://git-scm.com/downloads)
- [Node.js (v18+)](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server & SSMS](https://www.microsoft.com/sql-server/sql-server-downloads)
- [ngrok](https://ngrok.com/download) (for public URL access)

---

## 🔗 Step 1: Clone the Project
Open your terminal (PowerShell or Bash) and run:
```bash
git clone https://github.com/MrManohar1821/VirtualTimeCapsule.git
cd VirtualTimeCapsule
```

---

## 🗄️ Step 2: Database Setup
1. **Open SSMS**: Connect to your local SQL Server instance.
2. **Create Database**:
   ```sql
   CREATE DATABASE VirtualTimeCapsuleDB;
   ```
3. **Run Tables Script**: Locate your SQL scripts (or ensure your connection is pointed toward the correct DB) and execute them within `VirtualTimeCapsuleDB`.
4. **Update Connection String**:
   Open `VirtualTimeCapsule/VirtualTimeCapsule/appsettings.json` and update the `DefaultConnection`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_COMPUTER_NAME;Database=VirtualTimeCapsuleDB;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```
   *(Find your computer name by right-clicking "This PC" > Properties)*

---

## 📧 Step 3: Backend Configuration (Email & OTP)
To enable the **Forgot Password** and **Registration OTP** features:
1. Open `VirtualTimeCapsule/VirtualTimeCapsule/appsettings.json`.
2. Update the `EmailSettings`:
   ```json
   "EmailSettings": {
     "SenderEmail": "your-gmail@gmail.com",
     "SenderPassword": "your-app-password"
   }
   ```
   *Note: For Gmail, you MUST generate an **App Password** from your Google Account settings.*

---

## 🌐 Step 4: ngrok Setup (For Mobile/External Access)
1. **Start ngrok**: Open a terminal and run:
   ```bash
   ngrok http 5152
   ```
2. **Copy URL**: Note the `Forwarding` URL (it looks like `https://xxxx-xxx.ngrok-free.app`).
3. **Leave this terminal open!**

---

## 🏗️ Step 5: Frontend Configuration
1. **Navigate to FrontEnd**:
   ```bash
   cd FrontEnd
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Environment Variables**:
   Create a file named `.env` in the `FrontEnd` folder and paste your **ngrok URL** from Step 4:
   ```env
   VITE_BACKEND_URL=https://xxxx-xxx.ngrok-free.app
   ```
   *If you are running ONLY locally without ngrok, use `http://localhost:5152`.*

---

## 🏃 Step 6: Run the Project
### A. Start the Backend
- Open the `.sln` file in Visual Studio and press **F5** (Play).
- *OR run via terminal:*
  ```bash
  cd VirtualTimeCapsule/VirtualTimeCapsule
  dotnet run
  ```

### B. Start the Frontend
- Open a **new** terminal in the `FrontEnd` folder:
  ```bash
  npm run dev
  ```

---

## ✅ Ready!
Visit the Local URL provided by Vite (usually `http://localhost:5173`) in your browser. All API requests will now route through your backend!
