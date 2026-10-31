const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const sql = neon('postgresql://neondb_owner:npg_ptHCF01vONWM@ep-cold-firefly-a1uovazs-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function seed() {
  const email = 'harsh30dbg@gmail.com';
  const password = 'Harsh@2005';
  const hash = await bcrypt.hash(password, 12);
  
  const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    await sql`UPDATE users SET password_hash = ${hash} WHERE email = ${email}`;
    console.log('✅ Updated existing user password');
  } else {
    await sql`INSERT INTO users (email, name, password_hash, role) VALUES (${email}, 'Admin', ${hash}, 'admin')`;
    console.log('✅ Created new admin user');
  }
  console.log('Email:', email);
  console.log('Password:', password);
}
seed().catch(console.error);