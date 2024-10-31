import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveFile(buffer: Buffer, filename: string): Promise<string> {
  // Ensure upload directory exists
  await ensureUploadDir();
  
  // Create a unique filename
  const uniqueFilename = `${Date.now()}-${filename}`;
  const filepath = path.join(UPLOAD_DIR, uniqueFilename);
  
  // Save the file
  await writeFile(filepath, buffer);
  
  // Return the public path
  return `/uploads/${uniqueFilename}`;
}