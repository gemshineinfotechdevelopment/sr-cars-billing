import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP DNS resolvers failing on MongoDB SRV records (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // If custom DNS setting is restricted, fallback to system DNS
}

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI is not defined in server/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.error('Troubleshooting Tip: Verify that your current IP address is whitelisted in MongoDB Atlas under Network Access (allow 0.0.0.0/0 or your current IP).');
  }
};

export default connectDB;
