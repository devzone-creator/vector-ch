export type CategoryType = 'Rubbish' | 'Unsafe Area' | 'Suspicious Activity' | 'Vandalism';

export interface Report {
  id: string;
  category: CategoryType;
  imageUrl: string;
  location: string;
  timestamp: Date;
  description?: string;
  lat?: number;
  lng?: number;
}

export const mockReports: Report[] = [
  {
    id: '1',
    category: 'Rubbish',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXR0ZXIlMjBzdHJlZXQlMjBnYXJiYWdlfGVufDF8fHx8MTc2ODgxNjI5NXww&ixlib=rb-4.1.0&q=80&w=400',
    location: 'Main Street & 5th Ave',
    timestamp: new Date('2026-01-19T10:30:00'),
    description: 'Garbage piling up near bus stop',
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: '2',
    category: 'Unsafe Area',
    imageUrl: 'https://images.unsplash.com/photo-1591188185682-41f5c74781f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzaWRld2FsayUyMGhhemFyZHxlbnwxfHx8fDE3Njg4MTYyOTV8MA&ixlib=rb-4.1.0&q=80&w=400',
    location: 'Park Avenue & 12th St',
    timestamp: new Date('2026-01-19T09:15:00'),
    description: 'Broken pavement causing trip hazard',
    lat: 37.7849,
    lng: -122.4094
  },
  {
    id: '3',
    category: 'Vandalism',
    imageUrl: 'https://images.unsplash.com/photo-1667884578193-75c66111b00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHZhbmRhbGlzbXxlbnwxfHx8fDE3Njg4MTYyOTZ8MA&ixlib=rb-4.1.0&q=80&w=400',
    location: 'Central Park West',
    timestamp: new Date('2026-01-18T16:45:00'),
    description: 'Graffiti on public property',
    lat: 37.7649,
    lng: -122.4294
  },
  {
    id: '4',
    category: 'Suspicious Activity',
    imageUrl: 'https://images.unsplash.com/photo-1760118382660-01c9d58c7b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwbWFya2VyfGVufDF8fHx8MTc2ODgxNjI5Nnww&ixlib=rb-4.1.0&q=80&w=400',
    location: 'Downtown Plaza',
    timestamp: new Date('2026-01-18T14:20:00'),
    description: 'Unusual activity reported',
    lat: 37.7549,
    lng: -122.4394
  },
  {
    id: '5',
    category: 'Rubbish',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXR0ZXIlMjBzdHJlZXQlMjBnYXJiYWdlfGVufDF8fHx8MTc2ODgxNjI5NXww&ixlib=rb-4.1.0&q=80&w=400',
    location: 'Market Street',
    timestamp: new Date('2026-01-17T11:00:00'),
    description: 'Overflowing trash bins',
    lat: 37.7949,
    lng: -122.3994
  }
];
