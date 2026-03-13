# Virtual Time Capsule ⏳

A modern web application to create, store, and send digital memories into the future.

## Prerequisites

- **Node.js** (v18 or higher)
- **.NET 8.0 SDK**
- **SQL Server** (LocalDB or Express)

---

## Getting Started

### 1. Database Setup
1. Open SQL Server Management Studio (SSMS).
2. Create a new database named `VirtualTimeCapsuleDB`.
3. Run the SQL scripts (if provided) to create tables and stored procedures.
4. Update the connection string in `VirtualTimeCapsule/VirtualTimeCapsule/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Data Source=YOUR_SERVER_NAME;Initial Catalog=VirtualTimeCapsuleDB;Integrated Security=True;..."
   }
   ```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd VirtualTimeCapsule/VirtualTimeCapsule
   ```
2. Restore and run:
   ```bash
   dotnet restore
   dotnet run
   ```
3. The backend will usually run on `http://localhost:5152`.

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd FrontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `VITE_BACKEND_URL` in `.env` with your backend URL (or ngrok link).
5. Run the development server:
   ```bash
   npm run dev
   ```

---

## Key Features
- **OTP Verification**: Secure registration via email.
- **Media Uploads**: Support for images, videos, and PDFs.
- **Parallel Processing**: High-performance saving and sending.
- **Smart Proxy**: Centralized API configuration via Vite.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Axios.
- **Backend**: .NET 8 Web API, C#, ADO.NET.
- **Database**: SQL Server.
- **Utilities**: ngrok for local tunneling.
