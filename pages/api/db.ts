import mongoose from 'mongoose';

const MONGO_URL = `mongodb+srv://${process.env.NEXT_PUBLIC_MONGO_DB_USER}:${process.env.NEXT_PUBLIC_MONGO_DB_PASSWORD}@scheduo-cluster.mamff6c.mongodb.net/`;

mongoose.connect(MONGO_URL);

const db = mongoose.connection;

db.on('error', (error) => console.error('MongoDB Error', error));
db.once('open', () => console.log('MongoDB connect success!'));

export default db;
