const express = require("express");
const db = require("../db/dbConnect");
const utils = require("../utils/utils");
const router = express.Router();

router.post("/add/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const { jewellery_id, order_total, qty } = req.body;
    // const dataToBeSent = req.body;
    const statement = `insert into orders(customer_id, jewellery_id, order_date, order_total, shipping_date, qty) values (?,?,?,?,?,?);`;
    const addDays = (date, days) => {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    db.query(
        statement, [customer_id, jewellery_id, new Date(), order_total, addDays(new Date(), 6), qty], (err, result) => {
            res.send(utils.createResult(err, result));
        }
    );
});
router.post('/add-multiple/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    const statement = `insert into orders(customer_id,order_date, shipping_date, jewellery_id, order_total, qty) values ?`;
    const dataToBeSent = req.body;
    const finalData = dataToBeSent.map(Object.values);
    const addDays = (date, days) => {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    let oneArr = [customer_id, new Date(), addDays(new Date(), 6)];
    let finalArray = [];
    finalData.map((f) => {
        finalArray.push(oneArr.concat(f));
    });
    db.query(
        statement, [finalArray], (err, result) => {
            res.send(utils.createResult(err, result));
        }
    );
});
router.get("/:id", (request, response) => {
    const id = request.params.id;
    const statement = `SELECT j.jewellery_id,o.customer_id,j.jewellery_name,o.order_total,
        o.shipping_date,o.order_date,o.qty,jd.jewellery_image FROM jewellery j
        INNER JOIN orders o inner join jewellery_details jd
        where j.jewellery_id = o.jewellery_id and j.jewellery_id=jd.jewellery_id
         and o.customer_id =?`;
    db.query(statement, [id], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});
module.exports = router;
