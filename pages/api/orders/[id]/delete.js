import nc from 'next-connect';
import db from '../../../../utils/db';

import Order from '../../../../models/Order';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth);
handler.use(isAdmin);

handler.post(async (req, res) => {
  console.log('deleting a order');
  await db.connectDB();
  const order = await Order.findById(req.query.id);
  //   await db.disconnectDB();
  if (order) {
    await order.remove();
    res.send(order);
  } else {
    res.status(401).send({ message: 'Order not found' });
  }
});

export default handler;
