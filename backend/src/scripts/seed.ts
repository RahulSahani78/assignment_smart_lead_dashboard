import { connectDB, disconnectDB } from '../config/db';
import { LeadModel } from '../models/lead.model';
import { UserModel } from '../models/user.model';
import { LEAD_SOURCES, LEAD_STATUSES } from '../types';

const sampleNames = [
  'Aarav Sharma',
  'Vivaan Patel',
  'Aditya Singh',
  'Vihaan Gupta',
  'Arjun Mehta',
  'Sai Reddy',
  'Reyansh Iyer',
  'Krishna Verma',
  'Ishaan Kapoor',
  'Rohan Joshi',
  'Ananya Bose',
  'Diya Nair',
  'Aadhya Roy',
  'Saanvi Khan',
  'Aanya Das',
];

const companies = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Stark', 'Wayne'];

const seed = async (): Promise<void> => {
  await connectDB();

  await UserModel.deleteMany({});
  await LeadModel.deleteMany({});

  const admin = await UserModel.create({
    name: 'Admin User',
    email: 'admin@smartleads.io',
    password: 'admin123',
    role: 'admin',
  });

  const sales = await UserModel.create({
    name: 'Sales Rep',
    email: 'sales@smartleads.io',
    password: 'sales123',
    role: 'sales',
  });

  const leads = sampleNames.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: `98${(10000000 + i * 7).toString().slice(0, 8)}`,
    company: companies[i % companies.length],
    notes: `Auto-generated lead #${i + 1}`,
    status: LEAD_STATUSES[i % LEAD_STATUSES.length],
    source: LEAD_SOURCES[i % LEAD_SOURCES.length],
    owner: i % 2 === 0 ? admin._id : sales._id,
  }));

  await LeadModel.insertMany(leads);

  // eslint-disable-next-line no-console
  console.log(`Seeded ${leads.length} leads.`);
  // eslint-disable-next-line no-console
  console.log('Login as admin -> admin@smartleads.io / admin123');
  // eslint-disable-next-line no-console
  console.log('Login as sales -> sales@smartleads.io / sales123');

  await disconnectDB();
};

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
