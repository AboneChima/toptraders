import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { balance } = await request.json();
    const { id } = await params;

    const result = await sql`
      UPDATE users 
      SET balance = ${balance} 
      WHERE id = ${id}
      RETURNING id, name, email, balance, status
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update balance error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
