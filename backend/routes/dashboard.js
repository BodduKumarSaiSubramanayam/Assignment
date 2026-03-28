const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/dashboard
// @desc    Get dashboard dummy data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Create some dummy data as requested
    const dashboardData = {
      message: `Welcome back, ${user.name}!`,
      user: user.name,
      stats: {
        leads: 45,
        tasks: 12,
        users: 128
      },
      recentActivity: [
        { id: 1, action: 'User login', time: '10 mins ago' },
        { id: 2, action: 'New lead added', time: '1 hour ago' },
        { id: 3, action: 'Task completed', time: '3 hours ago' }
      ]
    };

    res.json(dashboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
