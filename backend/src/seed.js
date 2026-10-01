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
    price: 680,
    currency: 'USD',
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
    price: 520,
    currency: 'USD',
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
    price: 740,
    currency: 'USD',
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
    price: 980,
    currency: 'USD',
    flightClass: 'Economy',
    availableSeats: 55,
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
    priceStarting: 599,
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
    priceStarting: 720,
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
    priceStarting: 450,
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
    priceStarting: 380,
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

    await Flight.insertMany(sampleFlights);
    console.log(` Seeded ${sampleFlights.length} flights`);

    await Destination.insertMany(sampleDestinations);
    console.log(` Seeded ${sampleDestinations.length} destinations`);

    console.log(' Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
