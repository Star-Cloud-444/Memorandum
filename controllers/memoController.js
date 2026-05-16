const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function listMemos(req, res) {
  const userId = req.user.id;
  const [rows] = await pool.execute('SELECT id, title, content, created_at AS createdAt, updated_at AS updatedAt FROM memos WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  res.json({ code: 0, message: 'ok', data: rows });
}

async function getMemo(req, res) {
  const userId = req.user.id;
  const id = req.params.id;
  const [rows] = await pool.execute('SELECT id, title, content, created_at AS createdAt, updated_at AS updatedAt, user_id FROM memos WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ code: 404, message: '笔记不存在' });
  const memo = rows[0];
  if (memo.user_id !== userId) return res.status(403).json({ code: 403, message: '无权访问该笔记' });
  delete memo.user_id;
  res.json({ code: 0, message: 'ok', data: memo });
}

async function createMemo(req, res) {
  const userId = req.user.id;
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ code: 400, message: '标题不能为空' });
  const id = `memo_${uuidv4()}`;
  const now = Date.now();
  await pool.execute('INSERT INTO memos (id, user_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [id, userId, title, content || '', now, now]);
  const data = { id, title, content: content || '', createdAt: now, updatedAt: now };
  res.json({ code: 0, message: '创建成功', data });
}

async function updateMemo(req, res) {
  const userId = req.user.id;
  const id = req.params.id;
  const { title, content } = req.body;
  const [rows] = await pool.execute('SELECT user_id, created_at FROM memos WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ code: 404, message: '笔记不存在' });
  if (rows[0].user_id !== userId) return res.status(403).json({ code: 403, message: '无权修改该笔记' });
  const updatedAt = Date.now();
  await pool.execute('UPDATE memos SET title = ?, content = ?, updated_at = ? WHERE id = ?', [title || '', content || '', updatedAt, id]);
  const data = { id, title: title || '', content: content || '', createdAt: rows[0].created_at, updatedAt };
  res.json({ code: 0, message: '更新成功', data });
}

async function deleteMemo(req, res) {
  const userId = req.user.id;
  const id = req.params.id;
  const [rows] = await pool.execute('SELECT user_id FROM memos WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ code: 404, message: '笔记不存在' });
  if (rows[0].user_id !== userId) return res.status(403).json({ code: 403, message: '无权删除该笔记' });
  await pool.execute('DELETE FROM memos WHERE id = ?', [id]);
  res.json({ code: 0, message: '删除成功' });
}

module.exports = { listMemos, getMemo, createMemo, updateMemo, deleteMemo };
