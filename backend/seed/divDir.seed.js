const mongoose = require('mongoose');
const Direktorat = require('../models/direktorat.model');
const Divisi = require('../models/divisi.model');
require('dotenv').config();

const DIREKTORAT = [
    { _id: 'DU', name: 'Direktorat Utama', order: 1 },
    { _id: 'DK', name: 'Direktorat Keuangan dan Manajemen Risiko', order: 2 },
    { _id: 'DO', name: 'Direktorat Operasi', order: 3 },
    { _id: 'DT', name: 'Direktorat Teknik', order: 4 },
    { _id: 'DS', name: 'Direktorat Keselamatan Keamanan dan Standardisasi', order: 5 },
    { _id: 'DP', name: 'Direktorat SDM dan Umum', order: 6 },
];

const DIVISI = [
    { _id: 'UI', name: 'Internal Audit', direktoratId: 'DU', order: 1 },
    { _id: 'CS', name: 'Corporate Secretary', direktoratId: 'DU', order: 1 },
    { _id: 'LS', name: 'Legal Compliance and Sustainability', direktoratId: 'DU', order: 1 },
    { _id: 'CE', name: 'Community of Expertise', direktoratId: 'DU', order: 1 },
    { _id: 'CG', name: 'Corporate Strategy', direktoratId: 'DK', order: 2 },
    { _id: 'AM', name: 'Accounting and Asset Management', direktoratId: 'DK', order: 2 },
    { _id: 'TR', name: 'Transaction', direktoratId: 'DK', order: 2 },
    { _id: 'RM', name: 'Risk Management', direktoratId: 'DK', order: 2 },
    { _id: 'PMO', name: 'Project Management Office', direktoratId: 'DK', order: 2 },
    { _id: 'AN', name: 'Air Navigation Services Planning', direktoratId: 'DO', order: 3 },
    { _id: 'ANC', name: 'Air Navigation Control', direktoratId: 'DO', order: 3 },
    { _id: 'ANI', name: 'Air Navigation Information Management', direktoratId: 'DO', order: 3 },
    { _id: 'TS', name: 'Technology Solution', direktoratId: 'DT', order: 4 },
    { _id: 'IR', name: 'Infrastructure Readiness', direktoratId: 'DT', order: 4 },
    { _id: 'IT', name: 'Information Technology', direktoratId: 'DT', order: 4 },
    { _id: 'SS', name: 'Standard Security', direktoratId: 'DS', order: 5 },
    { _id: 'SO', name: 'Safety Operation', direktoratId: 'DS', order: 5 },
    { _id: 'HC', name: 'Human Capital Planning', direktoratId: 'DP', order: 6 },
    { _id: 'HCS', name: 'Human Capital Services', direktoratId: 'DP', order: 6 },
    { _id: 'CSE', name: 'Corporate Services', direktoratId: 'DP', order: 6 },
    { _id: 'LKM', name: 'Learning and Knowledge Management', direktoratId: 'DP', order: 6 },
];

async function main() {
    const uri = process.env.DB_CONNECTION;
    if (!uri) throw new Error('MONGO_URI undefined');

    await mongoose.connect(uri);
    console.log('connected:', mongoose.connection.name);

    // Di seed script
    await Divisi.deleteMany({});
    await Direktorat.deleteMany({});


    await Direktorat.insertMany(DIREKTORAT);
    await Divisi.insertMany(DIVISI);

    console.log('seed done (upsert)');
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('ERROR NAME:', err.name);
    console.error('ERROR CODE:', err.code);
    console.error('KEY VALUE:', err.keyValue);
    console.error('MESSAGE:', err.message);
    process.exit(1);
});

