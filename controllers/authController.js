const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'changeme';

async function register(req, res) {
  const { account, password, confirmPassword } = req.body;
  if (!account || !password || !confirmPassword) return res.status(400).json({ code: 400, message: '参数缺失' });
  if (password !== confirmPassword) return res.status(400).json({ code: 400, message: '密码不一致' });

  const [rows] = await pool.execute('SELECT id FROM users WHERE account = ?', [account]);
  if (rows.length > 0) return res.status(409).json({ code: 409, message: '账号已存在' });

  const hashed = await bcrypt.hash(password, 10);
  const id = `user_${uuidv4()}`;
  const nickname = account.split('@')[0];
  await pool.execute('INSERT INTO users (id, account, password_hash, nickname, created_at) VALUES (?, ?, ?, ?, ?)', [id, account, hashed, nickname, Date.now()]);

  res.json({ code: 0, message: '注册成功', data: { userId: id } });
}

async function login(req, res) {
  const { account, password, rememberMe } = req.body;
  if (!account || !password) return res.status(400).json({ code: 400, message: '参数缺失' });

  const [rows] = await pool.execute('SELECT id, account, password_hash, nickname FROM users WHERE account = ?', [account]);
  if (rows.length === 0) return res.status(401).json({ code: 401, message: '账号或密码错误' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ code: 401, message: '账号或密码错误' });

  const expiresIn = rememberMe ? '7d' : '1d';
  const token = jwt.sign({ id: user.id, account: user.account }, jwtSecret, { expiresIn });
  res.json({ code: 0, message: '登录成功', data: { token, user: { id: user.id, account: user.account, nickname: user.nickname } } });
}

async function me(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ code: 401, message: '未授权' });
  const [rows] = await pool.execute('SELECT id, account, nickname FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) return res.status(401).json({ code: 401, message: '用户不存在' });
  const user = rows[0];
  res.json({ code: 0, message: 'ok', data: user });
}

async function logout(req, res) {
  // 对于无状态 JWT，这里仅做响应。若需实现黑名单，请增加存储。
  res.json({ code: 0, message: '已登出' });
}

module.exports = { register, login, me, logout };
