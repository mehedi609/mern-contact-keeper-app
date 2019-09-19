const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

const User = require('./../models/User');
const router = express.Router();

// @route POST api/users
// @desc Register a user
// @access Public
router.post(
  '/',
  [
    // username must be an email
    check('name', 'Please enter a Name')
      .not()
      .isEmpty(),
    // password must be at least 6 chars long
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('email', 'Please enter a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    /*let errorMsg = [];
    const errorsArray = errors.array();
    errorsArray.forEach(item => errorMsg.push(item.msg));*/

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
