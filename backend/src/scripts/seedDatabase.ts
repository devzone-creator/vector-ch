import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAnonymousId } from '../utils/anonymizer';

const prisma = new PrismaClient();

// Type definitions
type ReportType = 'RUBBISH' | 'UNSAFE_AREA' | 'SUSPICIOUS_ACTIVITY' | 'VANDALISM';
type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Status = 'SUBMITTED' | 'REVIEWING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo police users
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    await prisma.policeUser.createMany({
      data: [
        {
          badgeId: 'TPD-001',
          password: hashedPassword,
          name: 'Officer John Smith',
          station: 'Tamale Central Station',
          isActive: true
        },
        {
          badgeId: 'TPD-002', 
          password: hashedPassword,
          name: 'Sergeant Mary Johnson',
          station: 'Tamale North Station',
          isActive: true
        },
        {
          badgeId: 'TPD-003',
          password: hashedPassword,
          name: 'Inspector David Wilson',
          station: 'Tamale Central Station',
          isActive: true
        }
      ]
    });

    // Create sample reports for Tamale, Ghana
    const tamaleReports = [
      {
        type: 'RUBBISH' as ReportType,
        severity: 'MEDIUM' as Severity,
        latitude: 9.4034,
        longitude: -0.8424,
        location: 'Central Market, Tamale',
        description: 'Garbage piling up near the main entrance of Central Market',
        status: 'SUBMITTED' as Status
      },
      {
        type: 'UNSAFE_AREA' as ReportType,
        severity: 'HIGH' as Severity,
        latitude: 9.4167,
        longitude: -0.8667,
        location: 'Aboabo Junction',
        description: 'Broken streetlight creating dangerous conditions at night',
        status: 'IN_PROGRESS' as Status,
        assignedTo: 'TPD-001'
      },
      {
        type: 'VANDALISM' as ReportType,
        severity: 'LOW' as Severity,
        latitude: 9.3876,
        longitude: -0.8513,
        location: 'University for Development Studies',
        description: 'Graffiti on university building walls',
        status: 'RESOLVED' as Status,
        assignedTo: 'TPD-002',
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        responseTime: 1440 // 24 hours
      },
      {
        type: 'SUSPICIOUS_ACTIVITY' as ReportType,
        severity: 'CRITICAL' as Severity,
        latitude: 9.4089,
        longitude: -0.8456,
        location: 'Tamale Teaching Hospital Area',
        description: 'Unusual activity reported near hospital premises',
        status: 'REVIEWING' as Status,
        assignedTo: 'TPD-003'
      },
      {
        type: 'RUBBISH' as ReportType,
        severity: 'HIGH' as Severity,
        latitude: 9.3945,
        longitude: -0.8234,
        location: 'Kalpohin Market',
        description: 'Overflowing waste bins causing health hazard',
        status: 'SUBMITTED' as Status
      }
    ];

    for (const reportData of tamaleReports) {
      await prisma.report.create({
        data: {
          ...reportData,
          anonymousId: generateAnonymousId(),
          mediaUrls: JSON.stringify([]),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
        }
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log('👮 Demo police credentials:');
    console.log('   Badge ID: TPD-001, Password: demo123');
    console.log('   Badge ID: TPD-002, Password: demo123');
    console.log('   Badge ID: TPD-003, Password: demo123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;