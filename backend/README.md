# SeeIt Backend API

Backend API for the SeeIt civic reporting application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev --name init

# Seed with demo data
npx ts-node src/scripts/seedDatabase.ts

# Start development server
npm run dev
```

Server runs on `http://localhost:3001`

## 🔑 Demo Credentials

**Police Dashboard Login:**
- Badge ID: `TPD-001`, Password: `demo123`
- Badge ID: `TPD-002`, Password: `demo123`
- Badge ID: `TPD-003`, Password: `demo123`

## 📡 API Endpoints

### Public Endpoints
- `POST /api/reports` - Submit new report (with file upload)
- `GET /api/reports` - Get reports (with filters)
- `GET /api/reports/:anonymousId` - Get single report
- `GET /health` - Health check

### Police Endpoints (Require JWT)
- `POST /api/police/login` - Police login
- `GET /api/police/profile` - Get police profile
- `GET /api/reports/police/all` - Get all reports for police
- `PUT /api/reports/:id/status` - Update report status
- `GET /api/stats/dashboard` - Dashboard statistics

## 🔒 Security Features

- **Anonymous reporting** - No personal data stored
- **Rate limiting** - 5 reports per hour per IP
- **File validation** - Images only, 10MB max
- **EXIF stripping** - Removes metadata from images
- **JWT authentication** - For police access
- **CORS protection** - Configured for frontend

## 🌐 Real-time Features

WebSocket events:
- `report:new` - New report submitted (to police room)
- `report:updated` - Report status changed (to police room)
- `report:resolved` - Report resolved (to public room)

## 📊 Database Schema

- **Report** - Anonymous reports with location, media, status
- **PoliceUser** - Police officers with badge authentication

## 🛠️ Environment Variables

See `.env.example` for required configuration.

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # API routes
├── middleware/     # Auth, error handling, rate limiting
├── utils/          # Anonymization, media processing
├── scripts/        # Database seeding
└── app.ts          # Main application
```