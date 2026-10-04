const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Flight = require('./models/Flight');
const Destination = require('./models/Destination');

const sampleFlights = [
  {
    flightNumber: 'TG-101',
    airline: 'British Airways',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'LHR',
      city: 'London',
      airport: 'London Heathrow Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
    arrivalTime: new Date(Date.now() + 86400000 * 2 + 23400000), // +6.5 hours
    duration: '6h 30m',
    price: 1050000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 48,
    stops: 0,
  },
  {
    flightNumber: 'TG-204',
    airline: 'Qatar Airways',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'DXB',
      city: 'Dubai',
      airport: 'Dubai International Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
    arrivalTime: new Date(Date.now() + 86400000 * 3 + 28800000), // +8 hours
    duration: '7h 45m',
    price: 820000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 32,
    stops: 1,
  },
  {
    flightNumber: 'TG-309',
    airline: 'Air France',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'CDG',
      city: 'Paris',
      airport: 'Charles de Gaulle Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 4),
    arrivalTime: new Date(Date.now() + 86400000 * 4 + 22500000),
    duration: '6h 15m',
    price: 1150000,
    currency: 'NGN',
    flightClass: 'Business',
    availableSeats: 16,
    stops: 0,
  },
  {
    flightNumber: 'TG-412',
    airline: 'Emirates',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'JFK',
      city: 'New York',
      airport: 'John F. Kennedy International Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 5),
    arrivalTime: new Date(Date.now() + 86400000 * 5 + 46800000),
    duration: '12h 45m',
    price: 1480000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 55,
    stops: 1,
  },
  {
    flightNumber: 'TG-501',
    airline: 'Qantas Airways',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'SYD',
      city: 'Sydney',
      airport: 'Sydney Kingsford Smith Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 3),
    arrivalTime: new Date(Date.now() + 86400000 * 3 + 78300000),
    duration: '21h 45m',
    price: 1920000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 40,
    stops: 1,
  },
  {
    flightNumber: 'TG-602',
    airline: 'Air Canada',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'YYZ',
      city: 'Toronto',
      airport: 'Toronto Pearson International Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 2),
    arrivalTime: new Date(Date.now() + 86400000 * 2 + 54900000),
    duration: '15h 15m',
    price: 1380000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 45,
    stops: 1,
  },
  {
    flightNumber: 'TG-701',
    airline: 'Japan Airlines',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'NRT',
      city: 'Tokyo',
      airport: 'Narita International Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 3),
    arrivalTime: new Date(Date.now() + 86400000 * 3 + 66600000),
    duration: '18h 30m',
    price: 2150000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 30,
    stops: 1,
  },
  {
    flightNumber: 'TG-802',
    airline: 'ITA Airways',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'FCO',
      city: 'Rome',
      airport: 'Leonardo da Vinci–Fiumicino Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 2),
    arrivalTime: new Date(Date.now() + 86400000 * 2 + 25800000),
    duration: '7h 10m',
    price: 950000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 38,
    stops: 0,
  },
  {
    flightNumber: 'TG-903',
    airline: 'Iberia',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'BCN',
      city: 'Barcelona',
      airport: 'Josep Tarradellas Barcelona–El Prat Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 2),
    arrivalTime: new Date(Date.now() + 86400000 * 2 + 24600000),
    duration: '6h 50m',
    price: 890000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 42,
    stops: 0,
  },
  {
    flightNumber: 'TG-994',
    airline: 'Aegean Airlines',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    origin: {
      code: 'LOS',
      city: 'Lagos',
      airport: 'Murtala Muhammed International Airport',
    },
    destination: {
      code: 'JTR',
      city: 'Santorini',
      airport: 'Santorini Thira Airport',
    },
    departureTime: new Date(Date.now() + 86400000 * 3),
    arrivalTime: new Date(Date.now() + 86400000 * 3 + 30000000),
    duration: '8h 20m',
    price: 980000,
    currency: 'NGN',
    flightClass: 'Economy',
    availableSeats: 25,
    stops: 1,
  },
];

const sampleDestinations = [
  {
    name: 'Santorini Island',
    city: 'Santorini',
    country: 'Greece',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 340,
    description: 'Breathtaking sunsets, whitewashed cliffside villas, and deep blue Aegean waters.',
    priceStarting: 980000,
    isPopular: true,
    tags: ['Island', 'Romance', 'Beach', 'Luxury'],
  },
  {
    name: 'Kyoto Historic Temples',
    city: 'Kyoto',
    country: 'Japan',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    reviewsCount: 280,
    description: 'Serene bamboo forests, traditional wooden tea houses, and ancient shrines.',
    priceStarting: 2150000,
    isPopular: true,
    tags: ['Culture', 'History', 'Nature'],
  },
  {
    name: 'Paris & The Seine',
    city: 'Paris',
    country: 'France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 520,
    description: 'The city of lights, world-class art at the Louvre, and timeless Parisian cafes.',
    priceStarting: 1150000,
    isPopular: true,
    tags: ['City', 'Art', 'Romance', 'Food'],
  },
  {
    name: 'Bali Tropical Haven',
    city: 'Bali',
    country: 'Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.92,
    reviewsCount: 460,
    description: 'Emerald rice terraces, pristine surf beaches, and rejuvenating wellness retreats.',
    priceStarting: 1250000,
    isPopular: true,
    tags: ['Tropical', 'Wellness', 'Adventure'],
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel_genesis';
    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for seeding...');

    await Flight.deleteMany({});
    console.log(' Cleared existing flights');

    await Destination.deleteMany({});
    console.log(' Cleared existing destinations');

    const createdFlights = await Flight.insertMany(sampleFlights);
    console.log(` Created ${createdFlights.length} flights successfully (currency: NGN)`);

    const createdDestinations = await Destination.insertMany(sampleDestinations);
    console.log(` Created ${createdDestinations.length} destinations successfully`);

    console.log(' Seed process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
