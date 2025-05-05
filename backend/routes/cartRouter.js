const express = require('express');
const db = require('../db/dbConnect');
const utils = require('../utils/utils');
const router = express.Router();

router.get('/:customer_id', async (req, res) => {
    const { customer_id } = req.params;
    const statement2 = ` select c.cart_id,c.jewellery_id,c.price,j.jewellery_name,
    c.qty,jd.jewellery_image from cart c join jewellery j join jewellery_details jd
    where c.jewellery_id=j.jewellery_id and j.jewellery_id = jd.jewellery_id and c.customer_id=?`;
    await db.query(statement2, [customer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.post('/add', async (req, res) => {
    const { customer_id, jewellery_id, qty, price } = req.body;
    const statement1 = `select * from cart where customer_id = ? and jewellery_id = ?`;
    const statement2 = `insert into cart(customer_id, jewellery_id, qty, price) values (?,?,?,?)`;
    db.query(statement1, [customer_id, jewellery_id], (err, result) => {
        if (result.length === 0) {
            db.query(statement2, [customer_id, jewellery_id, qty, price], (err, result2) => {
                res.send(utils.createResult(err, result2));
            });
        } else {
            const oldQty = result[0].qty;
            const statement3 = `update cart set qty=? where customer_id=? and jewellery_id=?`;
            db.query(statement3, [oldQty + qty, customer_id, jewellery_id], (err, result3) => {
                const statement5 = `select qty from cart where customer_id=? and jewellery_id=?`;
                db.query(statement5, [customer_id, jewellery_id], (err, data) => {
                    const statement4 = `update cart set price=? where customer_id=? and jewellery_id=?`;
                    db.query(statement4, [data[0].qty * price, customer_id, jewellery_id], (err, result5) => {
                        res.send(utils.createResult(err, result5));
                    });
                });
            });
        }
    });
});
router.put('/quantity/:cart_id', (request, response) => {
    const { cart_id } = request.params;
    const { qty } = request.body;
    db.query(
        `update cart set qty = ? where cart_id = ?`,
        [qty, cart_id],
        (error, result) => {
            response.send(utils.createResult(error, result));
        }
    );
});
// router.delete('/delete/:cart_id', (request, response) => {
//     const { cart_id } = request.params;
//     db.query(`delete from cart where cart_id = ? `, [cart_id], (error, result) => {
//         response.send(utils.createResult(error, result));
//     });
// });
router.delete('/delete/:jewellery_id', (request, response) => {
    const { jewellery_id } = request.params;
    db.query(`delete from cart where jewellery_id = ? `, [jewellery_id], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});
router.delete('/empty-cart/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    db.query(`delete from cart where customer_id = ? `, [customer_id], (error, result) => {
        res.send(utils.createResult(error, result));
    });
});
router.get('/getqty/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    const statement = `select cart_id,qty from cart where customer_id = ?`;
    db.query(statement, [customer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.get('/totalprice/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    const statement = 'select sum(price) as sum from cart where customer_id=? group by customer_id;';
    db.query(statement, [customer_id], (err, result) => {
        res.send(utils.createResult(err, result));
    });
});
router.put('/increase-qty-price/:jewellery_id', async (req, res) => {
    const { jewellery_id } = req.params;
    const { qty, price } = req.body;
    const statement1 = `update cart set qty = ?,price = ? where jewellery_id = ?`;
    await db.query(statement1, [qty, price, jewellery_id], (error, result1) => {
        res.send(utils.createResult(error, result1));
    });
});
module.exports = router;
