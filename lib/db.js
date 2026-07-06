import mysql2 from "mysql2/promise";



export const db = await mysql2.createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:"hanifa"
});