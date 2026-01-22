import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { submitReport, getReports, getReport } from '../controllers/reportController';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    files: 5 // Max 5 files per report
  }
});

// Middleware to process uploaded images (strip EXIF data)
const processImages = async (req: any, res: any, next: any) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    for (const file of req.files) {
      if (file.mimetype.startsWith('image/')) {
        // Strip EXIF data and optimize image
        await sharp(file.path)
          .jpeg({ quality: 80 })
          .toFile(file.path + '.processed');
        
        // Replace original with processed
        fs.renameSync(file.path + '.processed', file.path);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/', upload.array('media', 5), processImages, submitReport);
router.get('/', getReports);
router.get('/:id', getReport);

export default router;