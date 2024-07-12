const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {
    GoogleGenerativeAI,
  } = require('@google/generative-ai');

require('dotenv').config(); // Load environment variables from .env file  

const app = express();
const PORT = 5002;
const JWT_SECRET = 'your_jwt_secret'; 
const apiKey = process.env.REACTREACT_APP_GEMINI_API_KEY;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/auth', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/verify-token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send('Token is required');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, userId: decoded.userId });
    } catch (error) {
        res.status(401).send('Invalid token');
    }
});

// Google Generative AI setup
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: "You are a friendly assistant that helps users with their shopping errands..." },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Okay! I'm ready to help you whip up something delicious. First, tell me..." },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(userMessage);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 