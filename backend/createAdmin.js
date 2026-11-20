/**
 * A2 CRAVINGS — Secure Admin Seed Script
 * Reads credentials securely from environment variables.
 * Hashes passwords via bcrypt before saving to MongoDB.
 * Never creates duplicate admin accounts.
 *
 * Usage:
 *   node createAdmin.js
 *   or npm run seed:admin
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const createFirstAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;

    if (!MONGO_URI) {
      console.error('❌ Error: MONGO_URI is missing in .env file');
      process.exit(1);
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file');
      console.error('   Please add them to backend/.env before running this script.');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const cleanEmail = ADMIN_EMAIL.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: cleanEmail });

    if (existingAdmin) {
      console.log(`ℹ️  Admin with email "${cleanEmail}" already exists. No duplicate created.`);
      process.exit(0);
    }

    const newAdmin = await Admin.create({
      name: (ADMIN_NAME || 'Admin').trim(),
      email: cleanEmail,
      password: ADMIN_PASSWORD, // Pre-save hook will hash with bcryptjs
      role: 'superadmin',
      isActive: true,
    });

    console.log('\n🎉 Admin account created successfully!');
    console.log(`   Name:  ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role:  ${newAdmin.role}`);
    console.log('   Password has been securely hashed with bcrypt.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  }
};

createFirstAdmin();
