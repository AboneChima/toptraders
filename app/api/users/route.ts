import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`
      SELECT id, name, email, balance, status, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
