const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-tracker';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Habit Schema
const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  goal: { type: Number, default: 7 },
  createdAt: { type: Date, default: Date.now }
});

// Tracking Schema
const trackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitSchema);
const Tracking = mongoose.model('Tracking', trackingSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

// ===== AUTH ROUTES =====

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ===== HABIT ROUTES =====

// Get all habits for user
app.get('/api/habits', verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add habit
app.post('/api/habits', verifyToken, async (req, res) => {
  try {
    const { name, color, goal } = req.body;

    const habit = new Habit({
      userId: req.userId,
      name,
      color,
      goal
    });

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete habit
app.delete('/api/habits/:id', verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== TRACKING ROUTES =====

// Get tracking data for a month
app.get('/api/tracking/:date', verifyToken, async (req, res) => {
  try {
    const { date } = req.params; // YYYY-MM format
    const startDate = `${date}-01`;
    const endDate = `${date}-31`;

    const tracking = await Tracking.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle habit for a day
app.post('/api/tracking', verifyToken, async (req, res) => {
  try {
    const { habitId, date, completed } = req.body;

    // Check if tracking exists
    let tracking = await Tracking.findOne({ userId: req.userId, habitId, date });

    if (tracking) {
      tracking.completed = completed;
      await tracking.save();
    } else {
      tracking = new Tracking({
        userId: req.userId,
        habitId,
        date,
        completed
      });
      await tracking.save();
    }

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/api/stats/:month', verifyToken, async (req, res) => {
  try {
    const { month } = req.params; // YYYY-MM format

    const habits = await Habit.find({ userId: req.userId });
    const tracking = await Tracking.find({
      userId: req.userId,
      date: { $regex: `^${month}` }
    });

    const stats = {};
    habits.forEach(habit => {
      const habitTracking = tracking.filter(t => t.habitId.toString() === habit._id.toString());
      const completed = habitTracking.filter(t => t.completed).length;
      stats[habit._id] = {
        name: habit.name,
        completed,
        total: 30, // or calculate actual days in month
        percentage: Math.round((completed / 30) * 100)
      };
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
