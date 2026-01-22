import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessedMedia {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
}

/**
 * Process uploaded image: strip EXIF data, resize, optimize
 */
export const processImage = async (
  buffer: Buffer,
  originalName: string
): Promise<ProcessedMedia> => {
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${uuidv4()}${ext}`;
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  const filepath = path.join(uploadDir, filename);

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Process image: strip EXIF, resize if too large, optimize
  const processedBuffer = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF (then strip EXIF)
    .resize(1920, 1080, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ 
      quality: 85,
      progressive: true 
    })
    .toBuffer();

  // Save processed image
  await fs.writeFile(filepath, processedBuffer);

  return {
    filename,
    url: `/uploads/${filename}`,
    size: processedBuffer.length,
    mimetype: 'image/jpeg'
  };
};

/**
 * Validate file type and size
 */
export const validateFile = (file: Express.Multer.File): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
  }
};