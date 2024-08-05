import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connectDB();
  const order = await Order.findById(req.query.id);
  //   await db.disconnectDB();
  res.status(201).send(order);
});

export default handler;
