const express = require('express');
const db = require('../db/dbConnect');
const utils = require('../utils/utils');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' });

router.get('/:jewellery_id', async (req, res) => {
    const statement =
        `select j.jewellery_id,j.jewellery_name, jd.jewellery_description, jd.jewellery_price, jd.jewellery_image, j.stock_qty
         from jewellery j join jewellery_details jd
         where j.jewellery_id = jd.jewellery_id AND j.jewellery_id = ?`;
    const { jewellery_id } = req.params;
    await db.query(statement, [jewellery_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.get('/', async (req, res) => {
    const statement =
        `select j.jewellery_id,c.category_name,j.jewellery_name, jd.jewellery_description, jd.jewellery_price, jd.jewellery_image, j.stock_qty
         from jewellery j join jewellery_details jd join category c
         where j.jewellery_id = jd.jewellery_id and c.category_id = j.category_id`;
    await db.query(statement, (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.post('/add', upload.single("jewellery_image"), async (req, res) => {
    const statement1 =
        `insert into jewellery(category_id, jewellery_name, offer_id, stock_qty)
            values(?,?,?,?)`;
    const statement2 =
        `insert into jewellery_details(jewellery_id,jewellery_description, jewellery_image, jewellery_price)
        values (?,?,?,?)`;
    const statement3 = `select category_id from category where category_name=?`;
    const statement4 = `select offer_id from offer where offer_name=?`;
    const { category_name, offer_name, jewellery_name, stock_qty, jewellery_description, jewellery_price } = req.body;
    const { filename } = req.file;
    await db.query(statement3, [category_name], (err, result1) => {
        if (result1.length === 1) {
            db.query(statement4, [offer_name], (err, result) => {
                if (result.length === 1) {
                    db.query(statement1, [result1[0].category_id, jewellery_name, result[0].offer_id, stock_qty], (err, result2) => {
                        db.query(statement2, [result2.insertId, jewellery_description, filename, jewellery_price], (err, result3) => {
                            res.send(utils.createResult(err, result3));
                        });
                    });
                }
            });
        } else {
            res.send(utils.createResult('Category or offer does not exist!!'));
        }
    });
});
router.put('/update/:jewellery_id', async (req, res) => {
    const statement =
        `update jewellery j, jewellery_details jd set j.jewellery_name=?,
          j.stock_qty=?, jd.jewellery_description=?,
          jd.jewellery_price=? where j.jewellery_id = jd.jewellery_id and jd.jewellery_id = ?`;
    const { jewellery_name, stock_qty, jewellery_description, jewellery_price } = req.body;
    const { jewellery_id } = req.params;
    await db.query(statement, [jewellery_name, stock_qty, jewellery_description, jewellery_price, jewellery_id],
        (err, result) => {
            res.send(utils.createResult(err, result));
        });
});
router.delete('/delete/:jewellery_id', (req, res) => {
    const statement = "delete from jewellery where jewellery_id = ?";
    const { jewellery_id } = req.params;
    db.query(statement, [jewellery_id], (err, result) => {
        res.send(result);
    });
});
module.exports = router;

/*
 select j.jewellery_id, c.category_name, j.jewellery_name, jd.jewellery_description, jd.jewellery_price, j.stock_qty
         from jewellery j join jewellery_details jd join category c
         where j.jewellery_id = jd.jewellery_id and c.category_id = j.category_id;
         */
