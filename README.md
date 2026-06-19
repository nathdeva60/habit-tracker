# 🎯 Habit Tracker - Full Stack Application

**Complete system with Login, Database, and Habit Tracking!**

---

## 📁 **Files Included:**

1. **server.js** - Node.js + Express backend
2. **package.json** - Dependencies
3. **.env.example** - Environment variables template
4. **index.html** - Frontend (login, signup, tracker)

---

## 🚀 **Quick Setup (Local Testing)**

### **Step 1: MongoDB Setup (Free)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
2. Create a free account
3. Create a cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/habit-tracker`
5. Copy this string

### **Step 2: Backend Setup**

```bash
# 1. Create a folder
mkdir habit-tracker-backend
cd habit-tracker-backend

# 2. Copy these files here:
# - server.js
# - package.json
# - .env.example

# 3. Rename .env.example to .env
mv .env.example .env

# 4. Edit .env file and add:
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/habit-tracker
JWT_SECRET=your_super_secret_key_here_change_this
PORT=5000

# 5. Install dependencies
npm install

# 6. Start server
npm start
# Server will run on http://localhost:5000
```

### **Step 3: Frontend Setup**

1. Copy `index.html` to your computer
2. Update the `API_URL` in `index.html`:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```
3. Double-click `index.html` to open in browser
4. Register a new account
5. Start tracking habits!

---

## 🌐 **Deploy to Cloud (Production)**

### **Option 1: Railway (Recommended - Easy)**

#### **Deployment Steps:**

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to [Railway.app](https://railway.app)**
   - Sign in with GitHub
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Choose your habit-tracker repo
   - Add MongoDB plugin (Railway provides free MongoDB)

3. **Set Environment Variables:**
   - In Railway dashboard, go to Variables
   - Add:
     ```
     MONGODB_URI=<copied from Railway MongoDB plugin>
     JWT_SECRET=your_super_secret_key_change_this
     NODE_ENV=production
     ```

4. **Get your backend URL:**
   - Railway will give you a URL like: `https://your-app.up.railway.app`
   - This is your backend URL

5. **Update frontend index.html:**
   ```javascript
   const API_URL = 'https://your-app.up.railway.app/api';
   ```

6. **Deploy frontend:**
   - Push updated index.html to GitHub
   - Or deploy to Netlify (see below)

---

### **Option 2: Heroku (Also Easy)**

1. **Install Heroku CLI:**
   - Download from [heroku.com/cli](https://www.heroku.com/cli)

2. **Login and deploy:**
   ```bash
   heroku login
   heroku create your-habit-tracker
   git push heroku main
   ```

3. **Add MongoDB (use MongoDB Atlas - free tier)**
   - Set environment variables in Heroku:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_url
   heroku config:set JWT_SECRET=your_secret_key
   ```

4. **Get your URL:**
   ```bash
   heroku info
   # Will show something like: https://your-habit-tracker.herokuapp.com
   ```

---

### **Option 3: Frontend on Netlify**

1. **Go to [Netlify.com](https://netlify.com)**
2. **Drag & drop your index.html file** (after updating API_URL)
3. Gets instant URL like: `https://your-site.netlify.app`
4. (Backend stays on Railway/Heroku)

---

## ✅ **Testing the App**

### **Login/Signup:**
1. Click "Sign Up"
2. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`
3. Click "Create Account"
4. Automatically logged in!

### **Add Habits:**
1. Go to "Daily Tracker" tab
2. Click "+ Add New Habit"
3. Type habit name (e.g., "Morning Exercise")
4. Click "Add"

### **Track Daily:**
1. Click on days to mark as complete (✓)
2. Data automatically saves to database!
3. Logout and login again - data is still there!

---

## 🔐 **Security Notes**

- **Change JWT_SECRET** in production!
- **Use HTTPS** only in production
- **Never commit .env file** to GitHub
- Add `.env` to `.gitignore`

---

## 📊 **API Endpoints**

### **Auth:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### **Habits:**
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Add habit
- `DELETE /api/habits/:id` - Delete habit

### **Tracking:**
- `GET /api/tracking/:date` - Get tracking data
- `POST /api/tracking` - Toggle habit completion

---

## 🆘 **Troubleshooting**

### **"Cannot connect to server"**
- Make sure backend is running (`npm start`)
- Check API_URL in index.html

### **"Database connection error"**
- Check MongoDB connection string in .env
- Make sure IP is whitelisted in MongoDB Atlas

### **"Token error"**
- Clear browser cookies/storage
- Logout and login again

---

## 📱 **Access Your App**

### **After Deployment:**

**Backend URL:** `https://your-backend.up.railway.app`  
**Frontend URL:** `https://your-site.netlify.app`

### **Share with Others:**
```
Just share the frontend URL!
Users can:
- Create their own accounts
- Track their own habits
- Data saved permanently in database
```

---

## 🎉 **You're All Set!**

Your habit tracker is now:
- ✅ Fully functional with database
- ✅ Deployed on the internet
- ✅ Accessible from anywhere
- ✅ Secure with authentication
- ✅ Data persists forever

**Share with friends and family!** 🚀

---

## 📞 **Need Help?**

1. Check error messages in browser console (F12)
2. Check backend logs in Railway/Heroku dashboard
3. Verify all environment variables are set
4. Make sure MongoDB connection string is correct

---

**Happy Habit Tracking!** 🎯
