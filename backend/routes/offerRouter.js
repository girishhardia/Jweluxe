const express = require('express');
const db = require('../db/dbConnect');
const utils = require('../utils/utils');
const router = express.Router();

router.get('/', (req, res) => {
    const statement = 'select * from offer';
    db.query(statement, (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.post('/add', (req, res) => {
    const statement = "INSERT INTO offer(offer_name, offer_price, offer_percentage) VALUES(?,?,?)";
    const { offer_name, offer_price, offer_percentage } = req.body;
    db.query(statement, [offer_name, offer_price, offer_percentage], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.put('/update/:offer_id', (req, res) => {
    const statement = "UPDATE offer SET offer_name = ?, offer_price = ?, offer_percentage = ? WHERE offer_id = ?";
    const { offer_name, offer_price, offer_percentage } = req.body;
    const { offer_id } = req.params;
    db.query(statement, [offer_name, offer_price, offer_percentage, offer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.delete('/delete/:offer_id', (req, res) => {
    const statement = "DELETE FROM offer WHERE offer_id = ?";
    const { offer_id } = req.params;
    db.query(statement, [offer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
module.exports = router;
