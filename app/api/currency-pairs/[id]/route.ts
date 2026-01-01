import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const updates = await request.json();

    const pair = await prisma.currencyPair.update({
      where: { id: parsedId },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.category !== undefined && { category: updates.category }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.change !== undefined && { change: updates.change }),
        ...(updates.icon !== undefined && { icon: updates.icon }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.status !== undefined && { status: updates.status }),
        updatedAt: new Date()
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

    return NextResponse.json({ pair: serializedPair });
  } catch (error) {
    console.error('Update currency pair error:', error);
    return NextResponse.json(
      { error: 'Failed to update currency pair' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    await prisma.currencyPair.delete({
      where: { id: parsedId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete currency pair error:', error);
    return NextResponse.json(
      { error: 'Failed to delete currency pair' },
      { status: 500 }
    );
  }
}
