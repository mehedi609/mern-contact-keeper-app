const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('./../models/User');
const router = express.Router();

// @route  GET api/auth
// @desc   get logged in user
// access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) {
    console.log(e.msg);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route  POST api/auth
// @desc   Auth user & get token
// access  Public
router.post(
  '/',
  [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Password is Required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Password' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.msg);
    }
  }
);

module.exports = router;
