const express = require('express');
const db = require('../db/dbConnect');
const utils = require('../utils/utils');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' });

router.get('/', (req, res) => {
    const statement = 'select * from category';
    db.query(statement, (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.post('/add', upload.single("category_img"), (req, res) => {
    const statement = "INSERT INTO category(category_name, category_description, category_img) VALUES(?,?,?)";
    const { category_name, category_description } = req.body;
    const { filename } = req.file;
    db.query(statement, [category_name, category_description, filename], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.put('/update/:category_id', (req, res) => {
    const statement = "UPDATE category SET category_name = ?, category_description =? WHERE category_id = ?";
    const { category_name, category_description } = req.body;
    const { category_id } = req.params;
    db.query(statement, [category_name, category_description, category_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.delete('/delete/:category_id', (req, res) => {
    const statement = "DELETE FROM category WHERE category_id = ?";
    const { category_id } = req.params;
    db.query(statement, [category_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
module.exports = router;
