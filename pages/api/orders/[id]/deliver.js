import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';

const handler = nc({
  onError,
});
handler.use(isAuth);
handler.put(async (req, res) => {
  await db.connectDB();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = !order.isDelivered;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    // await db.disconnectDB();
    res.send({ message: 'order delivered', order: deliveredOrder });
  } else {
    // await db.disconnectDB();
    res.status(404).send({ message: 'order not found' });
  }
});

export default handler;
