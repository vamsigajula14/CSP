import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: import.meta.env.VITE_SUPABASE_URL,
});

export default pool;
