import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for better performance
    const [
      totalReports,
      activeReports,
      resolvedToday,
      criticalReports,
      reportsByType,
      reportsByStatus,
      recentActivity,
      avgResponseTime
    ] = await Promise.all([
      // Total reports
      prisma.report.count(),
      
      // Active reports (not resolved/rejected)
      prisma.report.count({
        where: {
          status: {
            in: ['SUBMITTED', 'REVIEWING', 'IN_PROGRESS']
          }
        }
      }),
      
      // Resolved today
      prisma.report.count({
        where: {
          status: 'RESOLVED',
          resolvedAt: {
            gte: today
          }
        }
      }),
      
      // Critical reports
      prisma.report.count({
        where: {
          severity: 'CRITICAL',
          status: {
            in: ['SUBMITTED', 'REVIEWING', 'IN_PROGRESS']
          }
        }
      }),
      
      // Reports by type
      prisma.report.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      }),
      
      // Reports by status
      prisma.report.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),
      
      // Recent activity (last 10 reports)
      prisma.report.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          anonymousId: true,
          type: true,
          severity: true,
          location: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      
      // Average response time for resolved reports
      prisma.report.aggregate({
        where: {
          status: 'RESOLVED',
          responseTime: {
            not: null
          }
        },
        _avg: {
          responseTime: true
        }
      })
    ]);

    // Format response
    const stats = {
      overview: {
        totalReports,
        activeReports,
        resolvedToday,
        criticalReports,
        avgResponseTime: Math.round(avgResponseTime._avg.responseTime || 0)
      },
      charts: {
        reportsByType: reportsByType.map(item => ({
          type: item.type,
          count: item._count.id
        })),
        reportsByStatus: reportsByStatus.map(item => ({
          status: item.status,
          count: item._count.id
        }))
      },
      recentActivity: recentActivity.map(report => ({
        id: report.id,
        anonymousId: report.anonymousId,
        type: report.type,
        severity: report.severity,
        location: report.location,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        timeAgo: getTimeAgo(report.createdAt)
      }))
    };

    res.json(stats);

  } catch (error) {
    next(error);
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};