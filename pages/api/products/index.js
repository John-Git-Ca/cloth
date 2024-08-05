import nc from 'next-connect';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  console.log(req.headers);
  console.log('requesting all products...');
  await db.connectDB();
  const products = await Product.find({}).sort({ createdAt: 'desc', test: -1 });
  //   await db.disconnectDB();
  res.send(products);
});

export default handler;
