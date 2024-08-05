import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connectDB();

  if (req.user.isAdmin) {
    const orders = await Order.find({}).sort({
      createdAt: -1,
    });
    res.send(orders);
  } else {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.send(orders);
  }
  //   await db.disconnectDB();
});

export default handler;
