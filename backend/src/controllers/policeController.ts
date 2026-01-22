import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Police login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { badgeId, password } = req.body;
    
    if (!badgeId || !password) {
      throw createError('Badge ID and password are required', 400);
    }

    // Find police user
    const policeUser = await prisma.policeUser.findUnique({
      where: { badgeId }
    });

    if (!policeUser || !policeUser.isActive) {
      throw createError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, policeUser.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError('JWT secret not configured', 500);
    }

    const token = jwt.sign(
      {
        id: policeUser.id,
        badgeId: policeUser.badgeId,
        name: policeUser.name,
        station: policeUser.station
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: policeUser.id,
        badgeId: policeUser.badgeId,
        name: policeUser.name,
        station: policeUser.station
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get police profile
export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const policeUser = await prisma.policeUser.findUnique({
      where: { id: req.police.id },
      select: {
        id: true,
        badgeId: true,
        name: true,
        station: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!policeUser) {
      throw createError('Police user not found', 404);
    }

    res.json(policeUser);

  } catch (error) {
    next(error);
  }
};