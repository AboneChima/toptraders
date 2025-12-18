import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
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

    const serializedWithdrawals = withdrawals.map(withdrawal => ({
      id: withdrawal.id.toString(),
      userId: withdrawal.userId.toString(),
      userName: withdrawal.user.name,
      amount: Number(withdrawal.amount),
      walletAddress: withdrawal.walletAddress,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt.toISOString(),
    }));

    return NextResponse.json({ withdrawals: serializedWithdrawals });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, amount, walletAddress } = await request.json();

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: parseInt(userId),
        amount,
        walletAddress,
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

    const serializedWithdrawal = {
      id: withdrawal.id.toString(),
      userId: withdrawal.userId.toString(),
      userName: withdrawal.user.name,
      amount: Number(withdrawal.amount),
      walletAddress: withdrawal.walletAddress,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt.toISOString(),
    };

    return NextResponse.json({ withdrawal: serializedWithdrawal }, { status: 201 });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
