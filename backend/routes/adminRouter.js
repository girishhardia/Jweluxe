const router = require('express').Router();
const db = require('../db/dbConnect');
const utils = require('../utils/utils');
router.post("/login", (req, res) => {
    const statement = `select * from admin where email = ? AND password = ?`;
    const { email, password } = req.body;
    db.query(statement, [email, password], (err, result) => {
        if (result.length === 0) {
            res.send(utils.createResult("user does not exist"));
        } else {
            res.send(utils.createResult(err, result));
        }
    });
});

module.exports = router;
