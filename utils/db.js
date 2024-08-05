import mongoose from 'mongoose';

const connection = {
  isConnected: false,
};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log('Already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    console.log(connection.isConnected);
    if (connection.isConnected === 1) {
      console.log('Use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  mongoose.set('strictQuery', false);
  const db = await mongoose.connect('mongodb://localhost:27017/cloth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('New connection');
  connection.isConnected = db.connections[0].readyState;
};

const disconnectDB = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV !== 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
      console.log('db disconnected');
    } else {
      console.log('not disconnected');
    }
  }
};

const convertDocToObj = (doc) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};

const db = { connectDB, disconnectDB, convertDocToObj };
export default db;
