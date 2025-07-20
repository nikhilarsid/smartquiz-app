import app from './app.js';
import connectDB from './config/db.js';


connectDB();


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  
  server.close(() => process.exit(1));
});