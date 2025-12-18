import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS currency_pairs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        category VARCHAR(50),
        price DECIMAL(20, 8) NOT NULL,
        change DECIMAL(10, 5) DEFAULT 0,
        icon VARCHAR(255),
        description TEXT,
        status BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        currency_pair VARCHAR(50) NOT NULL,
        type VARCHAR(10) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        entry_price DECIMAL(20, 8) NOT NULL,
        current_price DECIMAL(20, 8),
        profit_loss DECIMAL(10, 2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS deposits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10, 2) NOT NULL,
        method VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10, 2) NOT NULL,
        wallet_address VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);`;

    return NextResponse.json({ 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Init DB error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error },
      { status: 500 }
    );
  }
}
