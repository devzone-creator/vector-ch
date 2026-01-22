import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Define types as string literals
type ReportType = 'RUBBISH' | 'UNSAFE_AREA' | 'SUSPICIOUS_ACTIVITY' | 'VANDALISM';
type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Status = 'SUBMITTED' | 'REVIEWING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

// Valid status values
const VALID_STATUSES: Status[] = ['SUBMITTED', 'REVIEWING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

// Map frontend categories to database enums
const mapCategoryToType = (category: string): ReportType => {
  const mapping: Record<string, ReportType> = {
    'Rubbish': 'RUBBISH',
    'Unsafe Area': 'UNSAFE_AREA',
    'Suspicious Activity': 'SUSPICIOUS_ACTIVITY',
    'Vandalism': 'VANDALISM'
  };
  return mapping[category] || 'RUBBISH';
};

// Generate anonymous ID
const generateAnonymousId = (): string => {
  return `anon_${uuidv4().substring(0, 8)}`;
};

// Submit new report (PUBLIC)
export const submitReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, latitude, longitude, location, description, severity = 'MEDIUM' } = req.body;
    
    // Validation
    if (!category || !latitude || !longitude || !location) {
      throw createError('Missing required fields: category, latitude, longitude, location', 400);
    }

    // Handle uploaded files
    const mediaUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        mediaUrls.push(`/uploads/${file.filename}`);
      });
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        anonymousId: generateAnonymousId(),
        type: mapCategoryToType(category),
        severity: severity as Severity,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location,
        description: description || null,
        mediaUrls: JSON.stringify(mediaUrls)
      }
    });

    // Emit real-time update to police
    const io = req.app.get('io');
    io.to('police').emit('report:new', {
      id: report.id,
      type: report.type,
      severity: report.severity,
      location: report.location,
      createdAt: report.createdAt
    });

    res.status(201).json({
      success: true,
      reportId: report.anonymousId,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Get reports with filters (PUBLIC + POLICE)
export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      status, 
      type, 
      severity,
      limit = '50', 
      offset = '0',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (severity) where.severity = severity;

    const reports = await prisma.report.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      select: {
        id: true,
        anonymousId: true,
        type: true,
        severity: true,
        latitude: true,
        longitude: true,
        location: true,
        description: true,
        mediaUrls: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        responseTime: true,
        // Only include police fields if authenticated
        ...(req.path.includes('/police/') && {
          assignedTo: true,
          internalNotes: true,
          resolvedAt: true
        })
      }
    });

    // Parse mediaUrls JSON
    const reportsWithMedia = reports.map(report => ({
      ...report,
      mediaUrls: JSON.parse(report.mediaUrls || '[]')
    }));

    res.json({
      reports: reportsWithMedia,
      total: reports.length,
      hasMore: reports.length === parseInt(limit as string)
    });

  } catch (error) {
    next(error);
  }
};

// Get single report (PUBLIC + POLICE)
export const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const report = await prisma.report.findFirst({
      where: {
        OR: [
          { id },
          { anonymousId: id }
        ]
      }
    });

    if (!report) {
      throw createError('Report not found', 404);
    }

    const reportWithMedia = {
      ...report,
      mediaUrls: JSON.parse(report.mediaUrls || '[]')
    };

    res.json(reportWithMedia);

  } catch (error) {
    next(error);
  }
};

// Update report status (POLICE ONLY)
export const updateReportStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;
    
    if (!VALID_STATUSES.includes(status as Status)) {
      throw createError('Invalid status', 400);
    }

    const existingReport = await prisma.report.findUnique({
      where: { id }
    });

    if (!existingReport) {
      throw createError('Report not found', 404);
    }

    // Calculate response time if resolving
    const updateData: any = {
      status,
      updatedAt: new Date(),
      assignedTo: req.police?.badgeId
    };

    if (internalNotes) {
      updateData.internalNotes = internalNotes;
    }

    if (status === 'RESOLVED' && !existingReport.resolvedAt) {
      updateData.resolvedAt = new Date();
      updateData.responseTime = Math.floor(
        (Date.now() - existingReport.createdAt.getTime()) / (1000 * 60)
      );
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: updateData
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to('police').emit('report:updated', {
      id: updatedReport.id,
      status: updatedReport.status,
      assignedTo: updatedReport.assignedTo,
      updatedAt: updatedReport.updatedAt
    });

    // Notify public if resolved
    if (status === 'RESOLVED') {
      io.to('public').emit('report:resolved', {
        id: updatedReport.anonymousId,
        location: updatedReport.location
      });
    }

    res.json({
      success: true,
      message: 'Report status updated successfully'
    });

  } catch (error) {
    next(error);
  }
};