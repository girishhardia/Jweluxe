const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config');
const utils = require('./utils/utils');
const adminRouter = require('./routes/adminRouter');
const categoryRouter = require('./routes/categoryRouter');
const cartRouter = require('./routes/cartRouter');
const categoryJewellweyRouter = require('./routes/cateJewellery');
const offerRouter = require('./routes/offerRouter');
const jewelleryRouter = require('./routes/jewelleryRouter');
const customerRouter = require('./routes/customerRouter');
const paymentRouter = require('./routes/paymentRouter');
const orderRouter = require('./routes/orderRouter');
const port = process.env.PORT || 8085;
app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));
// app.use((request, response, next) => {
//     if (request.url == '/api/v1/customer/login' || request.url == '/api/v1/customer/register') {
//         // token is not required
//         next();
//     } else {
//         // get the token from request header
//         const token = request.headers['token'];
//         if (token == null) {
//             response.send(utils.createResult('missing token'));
//             return;
//         }
//         try {
//             // decode the token and get the payload
//             const payload = jwt.decode(token, config.secret);
//             // add the info to the request so that every api can use the payload
//             request.payload = payload;
//             next();
//         } catch (ex) {
//             response.send(utils.createResult('wrong token'));
//         }
//     }
// });

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/catejewellery', categoryJewellweyRouter);
app.use('/api/v1/offer', offerRouter);
app.use('/api/v1/jewellery', jewelleryRouter);
app.use('/api/v1/checkout', paymentRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
