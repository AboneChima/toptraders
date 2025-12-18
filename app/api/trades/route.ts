import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
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

    const serializedTrades = trades.map(trade => ({
      id: trade.id.toString(),
      userId: trade.userId.toString(),
      userName: trade.user.name,
      currencyPair: trade.currencyPair,
      type: trade.type,
      amount: Number(trade.amount),
      entryPrice: Number(trade.entryPrice),
      currentPrice: trade.currentPrice ? Number(trade.currentPrice) : null,
      profitLoss: Number(trade.profitLoss),
      status: trade.status,
      createdAt: trade.createdAt.toISOString(),
      closedAt: trade.closedAt?.toISOString() || null,
    }));

    return NextResponse.json({ trades: serializedTrades });
  } catch (error) {
    console.error('Get trades error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, currencyPair, type, amount, entryPrice } = await request.json();

    const trade = await prisma.trade.create({
      data: {
        userId: parseInt(userId),
        currencyPair,
        type,
        amount,
        entryPrice,
        status: 'open',
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    const serializedTrade = {
      id: trade.id.toString(),
      userId: trade.userId.toString(),
      userName: trade.user.name,
      currencyPair: trade.currencyPair,
      type: trade.type,
      amount: Number(trade.amount),
      entryPrice: Number(trade.entryPrice),
      profitLoss: Number(trade.profitLoss),
      status: trade.status,
      createdAt: trade.createdAt.toISOString(),
    };

    return NextResponse.json({ trade: serializedTrade }, { status: 201 });
  } catch (error) {
    console.error('Create trade error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
