require('dotenv').config();
const mongoose = require('mongoose');
const JobRequest = require('./models/JobRequest');

const sampleJobs = [
  {
    title: 'Leaking kitchen tap',
    description: 'Kitchen tap has been dripping for a week. Need a plumber to fix or replace.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah.mitchell@example.com',
    status: 'Open',
  },
  {
    title: 'Rewire living room sockets',
    description: 'Two double sockets not working after a power surge. Safety check needed.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'James Reid',
    contactEmail: 'james.reid@example.com',
    status: 'In Progress',
  },
  {
    title: 'Exterior wall repainting',
    description: 'Front and side of semi-detached house need repainting. Approx 3 storeys.',
    category: 'Painting',
    location: 'Aberdeen',
    contactName: 'Fiona Campbell',
    contactEmail: 'fiona.campbell@example.com',
    status: 'Open',
  },
  {
    title: 'Custom bookshelf installation',
    description: 'Built-in alcove bookshelf required in home office. Oak finish preferred.',
    category: 'Joinery',
    location: 'Dundee',
    contactName: 'Alan Fraser',
    contactEmail: 'alan.fraser@example.com',
    status: 'Closed',
  },
  {
    title: 'Blocked bathroom drain',
    description: 'Shower drain backing up slowly. Suspect hair blockage in pipe.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Emma Watson',
    contactEmail: 'emma.watson@example.com',
    status: 'Open',
  },
  {
    title: 'Install outdoor security lights',
    description: 'Four motion-sensor lights needed along driveway and back garden.',
    category: 'Electrical',
    location: 'Stirling',
    contactName: 'David Hughes',
    contactEmail: 'david.hughes@example.com',
    status: 'Open',
  },
  {
    title: 'Kitchen cabinet door repair',
    description: 'Two hinge doors misaligned after renovation. Adjustment or replacement needed.',
    category: 'Joinery',
    location: 'Inverness',
    contactName: 'Moira Grant',
    contactEmail: 'moira.grant@example.com',
    status: 'In Progress',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  await JobRequest.deleteMany({});
  await JobRequest.insertMany(sampleJobs);
  console.log(`Seeded ${sampleJobs.length} job requests`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
