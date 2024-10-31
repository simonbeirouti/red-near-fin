// @ts-nocheck

import { NextResponse } from 'next/server';
import { prisma } from '@repo/database/src/client';
import { saveFile } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const order = parseInt(formData.get('order') as string);
    const files = formData.getAll('images') as File[];

    // Create the layer
    const layer = await prisma.Layer.create({
      data: {
        name,
        order,
      },
    });

    // Save images and create records
    const savedImages = [];
    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const path = await saveFile(buffer, file.name);
        
        const savedImage = await prisma.Image.create({
          data: {
            filename: file.name,
            path,
            layerId: layer.id,
          },
        });
        savedImages.push(savedImage);
      } catch (error) {
        console.error(`Failed to save image ${file.name}:`, error);
      }
    }

    // Fetch the complete layer with images
    const completeLayer = await prisma.Layer.findUnique({
      where: { id: layer.id },
      include: { images: true },
    });

    return NextResponse.json(completeLayer);
  } catch (error) {
    console.error('Failed to create layer:', error);
    return NextResponse.json({ error: 'Failed to create layer' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const layers = await prisma.Layer.findMany({
      select: {
        id: true,
        name: true,
        order: true,
        locked: true,
        images: {
          select: {
            filename: true,
            path: true,
          }
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(layers);
  } catch (error) {
    console.error('Failed to fetch layers:', error);
    return NextResponse.json({ error: 'Failed to fetch layers' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Layer ID is required' },
        { status: 400 }
      );
    }

    // Delete the layer and its associated images
    await prisma.Layer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete layer:', error);
    return NextResponse.json(
      { error: 'Failed to delete layer' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Layer ID is required' },
        { status: 400 }
      );
    }

    // Update the layer with new order or locked status
    const updatedLayer = await prisma.layer.update({
      where: { id },
      data: {
        ...(data.order !== undefined && { order: data.order }),
        ...(data.locked !== undefined && { locked: data.locked }),
      },
      include: {
        images: true,
      },
    });

    // If order changed, update other layers' orders
    if (data.order !== undefined) {
      const allLayers = await prisma.layer.findMany({
        where: {
          NOT: { id: id },
        },
        orderBy: {
          order: 'asc',
        },
      });

      // Update orders of other layers
      for (const layer of allLayers) {
        if (layer.order >= data.order) {
          await prisma.layer.update({
            where: { id: layer.id },
            data: { order: layer.order + 1 },
          });
        }
      }
    }

    return NextResponse.json(updatedLayer);
  } catch (error) {
    console.error('Failed to update layer:', error);
    return NextResponse.json(
      { error: 'Failed to update layer' },
      { status: 500 }
    );
  }
}