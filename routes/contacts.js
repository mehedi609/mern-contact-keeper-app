const express = require('express');
const auth = require('./../middleware/auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Import Models
const User = require('./../models/User');
const Contact = require('./../models/Contact');

// @route  GET api/contacts
// @desc   get all users contacts
// access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (e) {
    console.log(e.msg);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route  POST api/contacts
// @desc   add new contact
// access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is Required')
        .not()
        .isEmpty(),
      check('email', 'Email is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, type, phone } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        type,
        phone,
        user: req.user.id
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (e) {
      console.log(e.msg);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route  POST api/contacts/:id
// @desc   Update contact
// access  Private
router.put('/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, type, phone } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (type) contactFields.type = type;
  if (phone) contactFields.phone = phone;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not Found!!' });

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = Contact.findByIdAndUpdate(
      req.user.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (e) {
    console.log(e.msg);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route  POST api/contacts/:id
// @desc   delete contact
// access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete contact');
});

module.exports = router;
