import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const deposits = await prisma.deposit.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serializedDeposits = deposits.map(deposit => ({
      id: deposit.id.toString(),
      userId: deposit.userId.toString(),
      userName: deposit.user.name,
      amount: Number(deposit.amount),
      method: deposit.method,
      status: deposit.status,
      createdAt: deposit.createdAt.toISOString(),
    }));

    return NextResponse.json({ deposits: serializedDeposits });
  } catch (error) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, amount, method } = await request.json();

    console.log('Creating deposit:', { userId, amount, method });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: parseInt(userId),
        amount,
        method,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    const serializedDeposit = {
      id: deposit.id.toString(),
      userId: deposit.userId.toString(),
      userName: deposit.user.name,
      amount: Number(deposit.amount),
      method: deposit.method,
      status: deposit.status,
      createdAt: deposit.createdAt.toISOString(),
    };

    return NextResponse.json({ deposit: serializedDeposit }, { status: 201 });
  } catch (error) {
    console.error('Create deposit error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
