import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const adminEmail = 'admin@gmail.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log('Admin user already exists:', adminEmail);
  } else {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seed().catch(console.error);
