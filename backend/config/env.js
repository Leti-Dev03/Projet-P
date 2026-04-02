import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL,
  PORT: process.env.PORT || 5000,
};