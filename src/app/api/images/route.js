// src/app/api/images/route.js
import db from '../../../database/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const images = db.prepare('SELECT * FROM images').all();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}