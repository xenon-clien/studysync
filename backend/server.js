require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { seedDemoAccount } = require('./utils/seedDemo');
const { seedExamPrepPacks } = require('./utils/seedExamPrep');

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDB();
  await seedDemoAccount();
  await seedExamPrepPacks();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

startServer();
