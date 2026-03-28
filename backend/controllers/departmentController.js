const pool = require('../db');

const getDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, d.name, COUNT(DISTINCT u.id) AS user_count
      FROM departments d
      LEFT JOIN users u ON d.id = u.department_id
      GROUP BY d.id, d.name
      ORDER BY d.name ASC
    `);

    const [[{ no_dept_count }]] = await pool.query(`
      SELECT COUNT(*) AS no_dept_count FROM users WHERE department_id IS NULL
    `);

    const data = [
      ...rows,
      { id: 'null', name: 'ไม่มีแผนก', user_count: Number(no_dept_count) }
    ];

    res.json({ success: true, data });
  } catch (err) {
    console.error('[getDepartments ERROR]', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    const [[dept]] = await pool.query(`
      SELECT d.id, d.name, COUNT(DISTINCT u.id) AS user_count
      FROM departments d
      LEFT JOIN users u ON d.id = u.department_id
      WHERE d.id = ?
      GROUP BY d.id, d.name
    `, [id]);

    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const [users] = await pool.query(`
      SELECT id, first_name, last_name, age, gender, email, phone
      FROM users WHERE department_id = ?
      ORDER BY first_name ASC
    `, [id]);

    res.json({ success: true, data: { ...dept, users } });
  } catch (err) {
    console.error('[getDepartmentById ERROR]', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getDepartments, getDepartmentById };