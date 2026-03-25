# Virtual Time Capsule ⏳

A modern web application to create, store, and send digital memories into the future.

## Prerequisites

- **Node.js** (v18 or higher)
- **.NET 8.0 SDK**
- **SQL Server** (LocalDB or Express)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/MrManohar1821/VirtualTimeCapsule.git
cd VirtualTimeCapsule
```

### 2. Database Setup
1. Open **SQL Server Management Studio (SSMS)**.
2. Create a new database named `VirtualTimeCapsuleDB`.
3. Locate the `DB` folder and run the SQL scripts to create tables and stored procedures.
4. Update the connection string in `VirtualTimeCapsule/VirtualTimeCapsule/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=VirtualTimeCapsuleDB;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

### 3. Backend Configuration (Email Service)
To enable OTP and Forgot Password features, update `appsettings.json` with your SMTP details:
```json
"EmailSettings": {
  "SenderEmail": "your-email@gmail.com",
  "SenderPassword": "your-app-password"
}
```
*Note: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).*

### 4. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd FrontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `FrontEnd` root:
   ```env
   VITE_BACKEND_URL=http://localhost:5152
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## Troubleshooting

- **500 Internal Server Error (Email)**: Ensure your `SenderEmail` and `SenderPassword` are correct in `appsettings.json`. Check if "Less secure apps" or "App Passwords" are enabled for your Gmail account.
- **Database Connection**: Verify SQL Server is running and the connection string matches your local instance.
- **Port Conflict**: If port 5173 or 5152 is taken, adjust the ports in `vite.config.js` or `launchSettings.json`.

---

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: .NET 8 Web API, C#, ADO.NET, BCrypt.NET.
- **Database**: SQL Server.
