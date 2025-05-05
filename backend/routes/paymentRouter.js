const router = require('express').Router();
const stripe = require('stripe')("sk_test_51NhAO2SCZGn9oSG6aXjxx5IbYKG5U3xcciittQhkavoZuLVtAHZxFCWIBaUKynoWWHrzI8HjlexzYWHj4CF520Ou00GsEfOrSN");

router.post("/payment", async (req, res) => {
    const { products } = req.body;
    const lineItems = products.map((p) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: p.jewellery_name
            },
            unit_amount: p.price * 100
        },
        quantity: p.qty
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:3000/orders`,
        cancel_url: `http://localhost:3000/cart`,
    });
    res.json({ id: session.id });
});

module.exports = router;
