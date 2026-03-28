const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');

// @route   GET api/leads
// @desc    Get all leads for the logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/leads
// @desc    Add new lead
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, email, status } = req.body;

  try {
    const newLead = new Lead({
      name,
      email,
      status,
      createdBy: req.user.id,
    });

    const lead = await newLead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, status } = req.body;

  // Build lead object
  const leadFields = {};
  if (name) leadFields.name = name;
  if (email) leadFields.email = email;
  if (status) leadFields.status = status;

  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Make sure user owns lead
    if (lead.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: leadFields },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Make sure user owns lead
    if (lead.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({ message: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
