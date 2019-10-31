const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
    '/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters'
              ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Case 1: See if user exists
            let user = await User.findOne({ email : email });       // Or    findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Case 2: Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg', 
                d: 'mm'
            });

            // Create a new user instance when you have user data,
            // this doesn't save user data in database yet, you should bcrypt password before saving into database
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Case 3: Encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            // This code saves user data into database
            await user.save();

            // Case 4: Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id    // _id or id gets available after you save user data into database
                }
            };

            // "jwtSecret" is imported from config/default.json. Should not display its value here.
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
            // res.send('User registered');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


module.exports = router;
