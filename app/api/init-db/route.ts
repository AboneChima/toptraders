import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    return NextResponse.json({ 
      message: 'Database connected successfully. Run "npx prisma db push" to create tables.' 
    });
  } catch (error) {
    console.error('Init DB error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
