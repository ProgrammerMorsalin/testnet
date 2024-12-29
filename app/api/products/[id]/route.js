import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, context) {
  try {
    const { params } = await context;
    const client = await clientPromise;
    const db = client.db("ecommerce");
    const product = await request.json();
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...product, uploadTime: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Product not found or not modified' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    const { params } = await context;
    const client = await clientPromise;
    const db = client.db("ecommerce");
    const update = await request.json();
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...update, uploadTime: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Product not found or not modified' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function GET(request, context) {
  try {
    const { params } = await context;
    console.log('Fetching product with ID:', params.id);
    const client = await clientPromise;
    const db = client.db("ecommerce");
    const product = await db.collection("products").findOne({ _id: new ObjectId(params.id) });
    if (!product) {
      console.log('Product not found');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    console.log('Product found:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
