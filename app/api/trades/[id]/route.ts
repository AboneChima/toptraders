import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, profitLoss, currentPrice } = await request.json();
    const { id } = await params;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (profitLoss !== undefined) updateData.profitLoss = profitLoss;
    if (currentPrice !== undefined) updateData.currentPrice = currentPrice;
    if (status === 'closed') updateData.closedAt = new Date();

    const trade = await prisma.trade.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: true
      }
    });

    // If trade is closed with profit, update user balance
    if (status === 'closed' && profitLoss > 0) {
      await prisma.user.update({
        where: { id: trade.userId },
        data: {
          balance: {
            increment: profitLoss
          }
        }
      });
    }

    return NextResponse.json({ 
      trade: {
        id: trade.id.toString(),
        status: trade.status,
        profitLoss: Number(trade.profitLoss)
      }
    });
  } catch (error) {
    console.error('Update trade error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
