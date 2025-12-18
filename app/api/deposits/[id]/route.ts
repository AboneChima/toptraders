import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    const deposit = await prisma.deposit.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: true
      }
    });

    // If confirmed, add to user balance
    if (status === 'confirmed') {
      await prisma.user.update({
        where: { id: deposit.userId },
        data: {
          balance: {
            increment: deposit.amount
          }
        }
      });
    }

    return NextResponse.json({ 
      deposit: {
        id: deposit.id.toString(),
        status: deposit.status
      }
    });
  } catch (error) {
    console.error('Update deposit error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
