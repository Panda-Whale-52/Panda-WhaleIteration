import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';

// import MONGO_URI from '.env';

// PORT defined in .env or defaults to 3000
const PORT = process.env.PORT || 3000;

const app = express();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/api/user', userRoutes); // normal user signup/login
app.use('/api/oauth', oauthRoutes); // GitHub OAuth
app.use('/api/exercise', exerciseRoutes);

// 404 or “Not Found” Handler
app.use((_req, _res, next) => {
  const error = new Error('Route Not Found');
  error.status = 404;
  next(error);
});

// Error handler (Note: the signature is usually (err, req, res, next))
app.use((err, _req, res) => {
  // Default error object
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  // Log the error object
  console.log('Error object:', errorObj);

  return res.status(errorObj.status).json(errorObj.message);
});

// // MongoDB connection string from .env
const MONGO_URI =
  'mongodb+srv://oliverafajardoucb1:AFrHIEwxaya01phE@cluster0.boihq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error(MONGO_URI);
  process.exit(1);
}

// MongoClientOptions object to set the Stable API version
// const clientOptions = {
//   serverApi: { version: '1', strict: true, deprecationErrors: true },
// };

// Start the server after connecting to MongoDB
async function startServer() {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB!');

    // If DB connection is successful, start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // If DB connection fails, log the error and exit
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Gracefully shut down server when you CTRL-C
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown start');
  await mongoose.disconnect();
  process.exit(0);
});

// Initiate the startup sequence
// startServer();
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
