require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Record = require('../models/Record');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zorvyn_finance';

const categories = ['Salary', 'Rent', 'Groceries', 'Utilities', 'Investment', 'Sales', 'Other'];
const roles = ['VIEWER', 'ANALYST', 'ADMIN'];
const recordTypes = ['INCOME', 'EXPENSE'];

async function seedData() {
  try {
    console.log('--- Connecting to MongoDB ---');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('🗑️  Cleared existing Users and Records');

    // Generate 100 Users
    console.log('--- Seeding 100 Users ---');
    const users = [];
    const password = await bcrypt.hash('password123', 10);

    for (let i = 1; i <= 100; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        users.push({
            name: `User ${i}`,
            email: `user${i}@zorvyn.com`,
            password: password,
            role: role,
            status: 'ACTIVE'
        });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Successfully seeded ${createdUsers.length} users.`);

    // Generate 300 Financial Records
    console.log('--- Seeding 300 Financial Records ---');
    const records = [];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (let i = 0; i < 300; i++) {
        const type = recordTypes[Math.floor(Math.random() * recordTypes.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = Math.floor(Math.random() * 50000) + 500;
        const createdBy = createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
        
        // Random date within the last year
        const date = new Date(oneYearAgo.getTime() + Math.random() * (new Date().getTime() - oneYearAgo.getTime()));

        records.push({
            amount,
            type,
            category,
            date,
            notes: `Seed record ${i + 1}`,
            createdBy
        });
    }

    const createdRecords = await Record.insertMany(records);
    console.log(`✅ Successfully seeded ${createdRecords.length} financial records.`);

    console.log('--- Seeding Complete! ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seedData();
