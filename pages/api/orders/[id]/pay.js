import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({ onError });

handler.use(isAuth);

handler.put(async (req, res) => {
  console.log('req');
  await db.connectDB();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = !order.isPaid;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    // await db.disconnectDB();
    res.send({ message: 'Order Paid', order: paidOrder });
  } else {
    // db.disconnectDB();
    res.status(404).send({ message: 'Order Not Found' });
  }
});

export default handler;
