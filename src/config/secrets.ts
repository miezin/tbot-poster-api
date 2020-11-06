
import { logger }  from '../util/logger';
import dotenv from 'dotenv';
import fs from 'fs';

// eslint-disable-next-line no-sync
if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.error('No .env file in root directory');
}

const dbUsername = process.env.MONGO_USERNAME;
const dbPassword = process.env.MONGO_PASSWORD;
const dbHostName = process.env.MONGO_HOSTNAME;
const dbPort = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DB;


export const ENVIRONMENT = process.env.NODE_ENV;
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const WEBHOOK_PORT = process.env.WEBHOOK_PORT;
export const WEBHOOK_DOMAIN = process.env.NODE_HOST;
export const ADMIN_ID = process.env.ADMIN_ID;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const POSTER_TOKEN = process.env.POSTER_TOKEN;
export const MONGODB_URI = `mongodb://${dbUsername}:${dbPassword}@${dbHostName}:${dbPort}/${dbName}?authSource=admin`;
