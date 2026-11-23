const mongoose = require('mongoose');

/**
 * Safely sanitizes MongoDB URIs by percent-encoding credentials
 * if special characters (like '@', ':', '#') were left unencoded in the password.
 */
function sanitizeMongoUri(uri) {
  if (!uri || typeof uri !== 'string') return '';
  const trimmed = uri.trim();
  try {
    if (trimmed.includes('://') && trimmed.includes('@')) {
      const schemeEnd = trimmed.indexOf('://') + 3;
      const atLast = trimmed.lastIndexOf('@');
      const authPart = trimmed.substring(schemeEnd, atLast);
      const colonIdx = authPart.indexOf(':');
      if (colonIdx !== -1) {
        const user = decodeURIComponent(authPart.substring(0, colonIdx));
        const pass = decodeURIComponent(authPart.substring(colonIdx + 1));
        const hostPart = trimmed.substring(atLast + 1);
        return `${trimmed.substring(0, schemeEnd)}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostPart}`;
      }
    }
  } catch {
    // Return original if parsing encounters an issue
  }
  return trimmed;
}

/**
 * Determines the appropriate MongoDB URI based on environment:
 * - Production (Render / Live): Uses MONGODB_URI or MONGO_URI_ATLAS or MONGO_URI.
 * - Development (Local): Uses MONGO_URI_LOCAL or MONGO_URI, defaulting to local MongoDB.
 */
function getTargetUri() {
  // Detect production: Render sets RENDER=true, Vercel sets VERCEL=1 or VERCEL_ENV=production
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true' ||
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview';

  if (isProduction) {
    const prodUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI_ATLAS ||
      process.env.MONGO_URI ||
      'mongodb+srv://Attiq:Attiq123456.@a2cravings.fcvtigi.mongodb.net/attiq';

    return {
      uri: sanitizeMongoUri(prodUri),
      environment: 'production',
      isCloud: true,
    };
  }

  // Development / Local environment
  const localUri =
    process.env.MONGO_URI_LOCAL ||
    (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb+srv')
      ? process.env.MONGO_URI
      : 'mongodb://127.0.0.1:27017/A2Cravings');

  return {
    uri: sanitizeMongoUri(localUri),
    environment: 'development',
    isCloud: false,
  };
}

/**
 * Connects to MongoDB with production-grade configuration and event handling.
 */
async function connectDB(customUri) {
  let target;
  if (customUri) {
    target = { uri: sanitizeMongoUri(customUri), environment: 'custom', isCloud: customUri.startsWith('mongodb+srv') };
  } else {
    target = getTargetUri();
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  };

  try {
    const conn = await mongoose.connect(target.uri, options);

    // Mask credentials for safe logging
    const maskedHost = target.uri.includes('@')
      ? target.uri.substring(target.uri.lastIndexOf('@') + 1)
      : target.uri;

    console.log(`✅ MongoDB connected successfully: [${target.environment.toUpperCase()}] -> ${maskedHost}`);
    console.log(`📂 Active Database: "${conn.connection.name}"`);

    // Attach runtime error listeners
    mongoose.connection.on('error', (err) => {
      console.error('⚠️  MongoDB runtime connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting automatic reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully.');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed (${target.environment}):`, error.message);
    throw error;
  }
}

/**
 * Returns current database connection status details.
 */
function getDatabaseInfo() {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true' ||
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview';

  return {
    status: stateMap[mongoose.connection.readyState] || 'unknown',
    databaseName: mongoose.connection.name || 'none',
    environment: isProduction ? 'production' : 'development',
    host: mongoose.connection.host || 'none',
    readyState: mongoose.connection.readyState,
  };
}

module.exports = {
  connectDB,
  sanitizeMongoUri,
  getTargetUri,
  getDatabaseInfo,
};
