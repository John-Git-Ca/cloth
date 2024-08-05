import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nc({
  onError,
});
handler.use(isAuth);
handler.use(isAdmin);

handler.post(async (req, res) => {
  console.log(req.body);
  await db.connectDB();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.purchased = !order.purchased;
    const newOrder = await order.save();
    // await db.disconnectDB();
    res.send(newOrder);
  } else {
    // await db.disconnectDB();
    res.status(404).send({ message: 'order not found' });
  }
});

export default handler;
