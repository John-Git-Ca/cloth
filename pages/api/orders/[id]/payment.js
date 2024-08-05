import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import multer from 'multer';
import path from 'path';
const nodemailer = require('nodemailer');

import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({ onError });

handler.use(isAuth);

const storage = multer.diskStorage({
  destination: './public/payments/',
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-orderid-${req.query.id}-${Date.now()}${path.extname(
        file.originalname
      )}`
      //   `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Upload images only!');
  }
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

handler.use(upload.single('images'));

handler.post(async (req, res) => {
  console.log('posting');
  // const imagePath = req.files.map((file) => {
  //   return `${file.path}`.replace(/\\/g, '/').substring(6);
  // });
  console.log(req.file.path);

  await db.connectDB();
  const order = await Order.findById(req.query.id);
  if (order) {
    //   order.payRecord =
    //     'https://allhkd500.s3.ap-southeast-1.amazonaws.com/' +
    //     req.query.id +
    //     '.jpg';
    order.payRecord = 'payment record uploaded';
  }
  const updatedOrder = await order.save();

  let orderItemString = '';
  for (let t = 0; t < updatedOrder.orderItems.length; t++) {
    orderItemString += `<p> ${JSON.stringify(updatedOrder.orderItems[t])}</p>`;
  }

  const html = `<h1>Order Id: ${req.query.id}</h1>
                    <h2>Order Items:</h2>
                    ${orderItemString}
                    <h2>Shipping Address:</h2>
                    <p>${JSON.stringify(order.shippingAddress)} </p>`;

  let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
  //   send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_TO, // list of receivers
    subject: 'Payment record', // Subject line
    text: 'Payment text', // plain text body
    html: html, // html body
    attachments: [{ path: req.file.path }],
  });

  console.log('Message sent: %s', info.messageId);

  //   console.log(updatedOrder);

  //   await db.disconnectDB();
  res.send(updatedOrder);
});

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};

// handler.put(async (req, res) => {
//   console.log('req');
//   console.log(typeof req.body);
//   await db.connectDB();
//   res.send({ message: 'req here' });
//   const order = await Order.findById(req.query.id);
//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       email_address: req.body.email_address,
//     };
//     const paidOrder = await order.save();
//     res.send({ message: 'Order Paid', order: paidOrder });
//     await db.disconnectDB();
//   } else {
//     db.disconnectDB();
//     res.status(404).send({ message: 'Order Not Found' });
//   }
// });

// export default handler;
