# Troubleshooting Guide

## Backend Issues

### MongoDB Connection Error

**If MongoDB is not running:**

**Option 1: Install and run MongoDB locally**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: Run as Administrator and execute `net start MongoDB`
   - Mac/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`

**Option 2: Use MongoDB Atlas (Cloud, Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free tier)
4. In "Database Access", create a database user with username/password
5. In "Network Access", add IP address `0.0.0.0/0` (allows all IPs for development)
6. Click "Connect" → "Connect your application"
7. Copy the connection string
8. Update `.env` file with:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/expense-tracker
   ```

**Option 3: Use MongoDB Docker (if you have Docker)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Verify MongoDB is running:**
```bash
# Try to connect using MongoDB Compass or run:
mongosh
# or
mongo
```

## Frontend Issues

### CORS or API Connection Errors

**If you see CORS errors:**

1. Make sure backend is running:
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `Server running on port 5000` and `Connected to MongoDB`

2. Check if backend is accessible:
   - Open browser and visit: `http://localhost:5000`
   - You should see: "Expense Tracker API"

3. Clear browser cache and cookies

4. Restart both frontend and backend

**If frontend won't start:**

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. If npm install fails, try:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Start frontend:
   ```bash
   npm run dev
   ```

## Common Fixes

1. **Restart both servers** after making changes
2. **Check console** in browser (F12) for detailed errors
3. **Check terminal** for backend error messages
4. **Make sure ports 3000 and 5000 are not in use**
5. **Verify .env file exists** in backend directory

## Port Already in Use

If port 5000 is already in use:
- Change PORT in `.env` to 5001
- Update frontend `api.js` baseURL to match

If port 3000 is already in use:
- Change port in `vite.config.js` server.port to 3001
