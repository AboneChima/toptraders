import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password, balance, status)
      VALUES (${name}, ${email}, ${hashedPassword}, 0, 'active')
      RETURNING id, name, email, balance, status, created_at
    `;

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
