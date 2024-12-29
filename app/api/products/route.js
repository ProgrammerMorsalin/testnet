// products/route.js
import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  const { searchParams } = new URL(request.url, `https://${request.headers.host}`)
  const published = searchParams.get('published') === 'true'
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')

  try {
    const client = await clientPromise
    const db = client.db("ecommerce")
    const collection = db.collection("products")

    let query = { published }
    if (category) {
      query.category = category
    }

    let sortOrder = { uploadTime: 1 } // Default to ascending order
    if (sort === 'desc') {
      sortOrder = { uploadTime: -1 }
    }

    const products = await collection.find(query).sort(sortOrder).toArray()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request) {
  const client = await clientPromise
  const db = client.db("ecommerce")
  const product = await request.json()
  const result = await db.collection("products").insertOne({
    ...product,
    uploadTime: new Date(),
  })
  return NextResponse.json({ message: 'Product added successfully', id: result.insertedId })
}

export async function PUT(request, { params }) {
  const client = await clientPromise
  const db = client.db("ecommerce")
  const product = await request.json()
  await db.collection("products").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...product, uploadTime: new Date() } }
  )
  return NextResponse.json({ message: 'Product updated successfully' })
}

export async function PATCH(request, { params }) {
  const client = await clientPromise
  const db = client.db("ecommerce")
  const update = await request.json()
  await db.collection("products").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...update, uploadTime: new Date() } }
  )
  return NextResponse.json({ message: 'Product updated successfully' })
}
