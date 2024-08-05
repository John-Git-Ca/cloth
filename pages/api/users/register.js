import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connectDB();
  // console.log('register');
  const existedUser = await User.findOne({ email: req.body.email });
  console.log(existedUser);
  if (existedUser) {
    res.status(401).send({ message: 'User already exists' });
    // throw new Error('user already exists');
  }
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  console.log('here')
  const user = await newUser.save();
  console.log(user);
  //   await db.disconnectDB();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
