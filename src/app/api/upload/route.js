// src/app/api/upload/route.js
import db from '../../../database/db';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import sanitizeFilename from 'sanitize-filename';

// Configure rate limiter
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_POINTS, 10) || 5, // Default: 5 requests
  duration: parseInt(process.env.RATE_LIMIT_DURATION, 10) || 60, // Default: 60 seconds
});

// Allowed file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

// Maximum file size (5MB)
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip; // Get client IP

  try {
    // Apply rate limiting
    await rateLimiter.consume(ip);

    const formData = await request.formData();
    const name = formData.get('name');
    const file = formData.get('file');

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a valid string' },
        { status: 400 }
      );
    }

    // Validate file
    if (!file || !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and GIF images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Sanitize file name
    const sanitizedFileName = sanitizeFilename(file.name);
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);

    // Ensure the file path is secure
    if (!filePath.startsWith(path.join(process.cwd(), 'public/uploads'))) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Save the file to the uploads directory
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Insert the image metadata into the database
    const stmt = db.prepare('INSERT INTO images (name, file_path) VALUES (?, ?)');
    const result = stmt.run(name, `/uploads/${fileName}`);

    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', // Allow all origins
      'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow specific methods
      'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
    };

    return NextResponse.json(
      { success: true, id: result.lastInsertRowid },
      { headers }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Rate limiter exceeded') {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow specific methods
    'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
  };

  return NextResponse.json({}, { headers });
}