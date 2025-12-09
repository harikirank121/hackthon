import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sanjayaos-dev-secret';
const JWT_EXPIRES_IN = '7d';

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyCaptcha = async (token) => {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    throw new Error('Missing RECAPTCHA_SECRET_KEY');
  }
  const params = new URLSearchParams();
  params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
  params.append('response', token);
  const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', params);
  return data.success;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'victim', captchaToken } = req.body;

    if (!name || !email || !password || !captchaToken) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) {
      return res.status(400).json({ message: 'CAPTCHA verification failed' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = generateToken(safeUser);

    return res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;
    if (!email || !password || !captchaToken) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) {
      return res.status(400).json({ message: 'CAPTCHA verification failed' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = generateToken(safeUser);
    return res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const testProtected = async (req, res) => {
  return res.json({ message: 'Protected route accessed', user: req.user });
};

