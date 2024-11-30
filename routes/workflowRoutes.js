const express = require('express');
const pool = require('../db/db');
const authenticate = require('../auth/authentication');

const router = express.Router();

// Create a new request
router.post('/requests', authenticate, async (req, res) => {
  const { request_type, status = 'Pending' } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO requests (user_id, request_type, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, request_type, status]
    );
    res.status(201).json({ message: 'Request created', request: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
});

// Get a user's requests
router.get('/requests', authenticate, async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM requests WHERE user_id = $1', [user_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Approve or Reject a request
router.post('/requests/:id/approve', authenticate, async (req, res) => {
  const { id } = req.params;
  const { approval_status, comment } = req.body;
  const approver_id = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO approvals (request_id, approver_id, approval_status, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, approver_id, approval_status, comment]
    );
    
    const updateRequestStatus = approval_status === 'Approved' ? 'In Progress' : 'Rejected';
    await pool.query('UPDATE requests SET status = $1 WHERE id = $2', [updateRequestStatus, id]);

    res.status(200).json({ message: 'Approval recorded', approval: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error processing approval' });
  }
});

module.exports = router;
