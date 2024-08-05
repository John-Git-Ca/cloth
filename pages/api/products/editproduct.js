import nc from 'next-connect';
import Product from '../../../models/Product';
import { isAuth, isAdmin } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();
handler.use(isAuth);
handler.use(isAdmin);

handler.post(async (req, res) => {
  await db.connectDB();
  if (req.body.search) {
    const product = await Product.findOne({ slug: req.body.search });
    res.send(product);
  } else {
    let existProduct = await Product.findOne({ slug: req.body.slug });
    if (existProduct) {
      existProduct = req.body;
      await Product.updateOne({ slug: req.body.slug }, { ...req.body });
      let newProduct = await Product.findOne({ slug: req.body.slug });
      res.send(newProduct);
    } else {
      console.log('creating new product')
      const newProduct = new Product({
        name: req.body.name,
        slug: req.body.slug,
        // brand: req.body.brand,
        // category: req.body.category,
        // countInStock: req.body.countInStock,
        price: req.body.price,
        images: req.body.images,
        description: req.body.description,
      });
      const product = await newProduct.save();
      console.log(product)
      //   await db.disconnectDB();

      res.send(product);
    }
  }
});

export default handler;
