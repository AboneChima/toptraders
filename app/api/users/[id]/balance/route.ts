import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { balance } = await request.json();
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { balance },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        status: true
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Update balance error:', error);
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
}
