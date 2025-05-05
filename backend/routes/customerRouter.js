const express = require('express');
const db = require('../db/dbConnect');
const utils = require('../utils/utils');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');
const multer = require('multer');
const upload = multer({ dest: 'uploads' });
//for user login
router.post('/login', (request, response) => {
    const { email, password } = request.body;
    const encryptedPassword = String(cryptoJs.SHA256(password));
    const statement = 'SELECT * FROM customer WHERE email=? and password=?';
    db.query(statement, [email, encryptedPassword], (error, users) => {
        if (users.length === 0) {
            // if user does not exist, users array will be empty
            response.send(utils.createResult('user does not exist'));
        } else {
            // if user exists, the users will be an array with one user entry
            const user = users[0];
            const payload = {
                id: user['customer_id'],
                name: `${user['firstName']} ${user['lastName']}`,
            };
            const token = jwt.sign(payload, config.secret);
            response.send(
                utils.createResult(null, {
                    customer_id: `${user['customer_id']}`,
                    email: `${user['email']}`,
                    name: `${user['firstName']} ${user['lastName']}`,
                    // mobile: `$user['mobileNo']`,
                    // profileImage: user['profileImage'],
                    token: token,
                })
            );
        }
    });
});
router.post('/register', (request, response) => {
    const { firstName, lastName, email, password, mobileNo } = request.body;
    const encryptedPassword = String(cryptoJs.SHA256(password));
    db.query(
        'INSERT INTO customer(firstName , lastName , email , password , mobileNo ,profile) VALUES(?, ?, ?, ?, ?,?)',
        [firstName, lastName, email, encryptedPassword, mobileNo, "user.jpg"],
        (error, result) => {
            response.send(utils.createResult(error, result));
        }
    );
});
router.put('/change-password/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    const { password } = req.body;
    const encryptedPassword = String(cryptoJs.SHA256(password));
    const statement = 'update customer set password = ? where customer_id = ?';
    db.query(statement, [encryptedPassword, customer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.put('/edit-profile/:customer_id', upload.single("profile"), (req, res) => {
    const { customer_id } = req.params;
    const { email, password, mobileNo } = req.body;
    const { filename } = req.file;
    const encryptedPassword = String(cryptoJs.SHA256(password));
    const statement = 'update customer set email = ?, password = ?, mobileNo = ?, profile = ? where customer_id = ?';
    db.query(statement, [email, encryptedPassword, mobileNo, filename, customer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.get('/get-all-customer', async (req, res) => {
    const statement = ` select * from customer`;
    db.query(statement, (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.get('/:customer_id', (request, response) => {
    const { customer_id } = request.params;
    const statement = "SELECT * FROM customer WHERE customer_id = ?";
    db.query(statement, [customer_id], (err, users) => {
        if (users.length === 0) {
            response.send(utils.createResult('user does not exist'));
        } else {
            const user = users[0];
            response.send(
                utils.createResult(null, {
                    name: `${user['firstName']} ${user['lastName']}`,
                    profile: user['profile'],
                    mobile: user['mobileNo'],
                    email: user['email'],
                    id: user['customer_id'],
                })
            );
        }
    });
});
module.exports = router;
