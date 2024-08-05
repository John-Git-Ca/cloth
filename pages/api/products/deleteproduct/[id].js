import nc from 'next-connect';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth);
handler.use(isAdmin);

handler.post(async (req, res) => {
  console.log('deleting a product');
  await db.connectDB();
  const product = await Product.findById(req.query.id);
  //   await db.disconnectDB();
  if (product) {
    await product.remove();
    res.send(product);
  } else {
    res.status(401).send({ message: 'Product not found' });
  }
});

export default handler;
