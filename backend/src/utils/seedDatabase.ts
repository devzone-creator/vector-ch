import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create demo police user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const policeUser = await prisma.policeUser.upsert({
      where: { badgeId: 'TPD-001' },
      update: {},
      create: {
        badgeId: 'TPD-001',
        password: hashedPassword,
        name: 'Officer John Smith',
        station: 'Tamale Police Station',
        isActive: true
      }
    });

    console.log('✅ Created demo police user:', policeUser.badgeId);

    // Create sample reports for Tamale, Ghana
    const sampleReports = [
      {
        anonymousId: 'anon_demo001',
        type: 'RUBBISH',
        severity: 'MEDIUM',
        latitude: 9.4034,
        longitude: -0.8424,
        location: 'Central Market, Tamale',
        description: 'Garbage piling up near the main entrance of Central Market',
        status: 'SUBMITTED'
      },
      {
        anonymousId: 'anon_demo002',
        type: 'UNSAFE_AREA',
        severity: 'HIGH',
        latitude: 9.4076,
        longitude: -0.8391,
        location: 'Tamale Teaching Hospital Road',
        description: 'Large pothole causing accidents near the hospital',
        status: 'REVIEWING'
      },
      {
        anonymousId: 'anon_demo003',
        type: 'VANDALISM',
        severity: 'LOW',
        latitude: 9.4001,
        longitude: -0.8456,
        location: 'Tamale Sports Stadium',
        description: 'Graffiti on the stadium walls',
        status: 'RESOLVED',
        assignedTo: 'TPD-001',
        responseTime: 120
      },
      {
        anonymousId: 'anon_demo004',
        type: 'SUSPICIOUS_ACTIVITY',
        severity: 'CRITICAL',
        latitude: 9.4089,
        longitude: -0.8367,
        location: 'University for Development Studies',
        description: 'Unusual activity reported near campus at night',
        status: 'IN_PROGRESS',
        assignedTo: 'TPD-001'
      },
      {
        anonymousId: 'anon_demo005',
        type: 'RUBBISH',
        severity: 'MEDIUM',
        latitude: 9.4012,
        longitude: -0.8445,
        location: 'Aboabo Market',
        description: 'Overflowing waste bins attracting flies',
        status: 'SUBMITTED'
      }
    ];

    for (const reportData of sampleReports) {
      await prisma.report.upsert({
        where: { anonymousId: reportData.anonymousId },
        update: {},
        create: {
          ...reportData,
          mediaUrls: '[]',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
          ...(reportData.status === 'RESOLVED' && { resolvedAt: new Date() })
        }
      });
    }

    console.log('✅ Created sample reports for Tamale');
    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Badge ID: TPD-001');
    console.log('Password: demo123');

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