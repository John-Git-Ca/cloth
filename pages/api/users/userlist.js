import nc from 'next-connect';
import db from '../../../utils/db';
import User from '../../../models/User';
import { isAdmin, isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);
handler.use(isAdmin);

handler.get(async (req, res) => {
  await db.connectDB();
  const users = await User.find({});
  //   await db.disconnectDB();
  res.send(users);
});

export default handler;
