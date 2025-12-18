import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    const withdrawal = await prisma.withdrawal.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: true
      }
    });

    // If approved, deduct from user balance
    if (status === 'approved') {
      await prisma.user.update({
        where: { id: withdrawal.userId },
        data: {
          balance: {
            decrement: withdrawal.amount
          }
        }
      });
    }

    return NextResponse.json({ 
      withdrawal: {
        id: withdrawal.id.toString(),
        status: withdrawal.status
      }
    });
  } catch (error) {
    console.error('Update withdrawal error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
