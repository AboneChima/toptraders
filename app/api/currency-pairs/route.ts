import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pairs = await prisma.currencyPair.findMany({
      orderBy: { id: 'asc' }
    });

    const serializedPairs = pairs.map(pair => ({
      id: pair.id,
      name: pair.name,
      category: pair.category || 'USDT',
      price: Number(pair.price),
      change: Number(pair.change),
      icon: pair.icon || '',
      description: pair.description || '',
      status: pair.status,
      updatedAt: pair.updatedAt.toISOString()
    }));

    return NextResponse.json({ pairs: serializedPairs });
  } catch (error) {
    console.error('Get currency pairs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currency pairs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, category, icon, description, price, change } = await request.json();

    const pair = await prisma.currencyPair.create({
      data: {
        name,
        category: category || 'USDT',
        price: price || 0,
        change: change || 0,
        icon: icon || '',
        description: description || '',
        status: true
      }
    });

    const serializedPair = {
      id: pair.id,
      name: pair.name,
      category: pair.category || 'USDT',
      price: Number(pair.price),
      change: Number(pair.change),
      icon: pair.icon || '',
      description: pair.description || '',
      status: pair.status,
      updatedAt: pair.updatedAt.toISOString()
    };

    return NextResponse.json({ pair: serializedPair }, { status: 201 });
  } catch (error) {
    console.error('Create currency pair error:', error);
    return NextResponse.json(
      { error: 'Failed to create currency pair' },
      { status: 500 }
    );
  }
}
