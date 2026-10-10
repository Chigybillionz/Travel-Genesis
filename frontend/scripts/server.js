const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const root = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Canonical clean routes mapping: Route -> Underlying HTML file relative to root
const ROUTE_MAP = {
  '/': '/index.html',
  '/splash': '/pages/onboarding/splash/splash.html',
  '/onboarding': '/pages/onboarding/step-1/onboarding.html',
  '/onboarding-1': '/pages/onboarding/step-1/onboarding.html',
  '/onboarding-2': '/pages/onboarding/step-2/onboarding2.html',
  '/onboarding2': '/pages/onboarding/step-2/onboarding2.html',
  '/home': '/pages/booking/home/home.html',
  '/search': '/pages/booking/search/search.html',
  '/flight': '/pages/booking/flight-details/flight.html',
  '/flight-details': '/pages/booking/flight-details/flight.html',
  '/seat': '/pages/booking/seat-selection/seat.html',
  '/seat-selection': '/pages/booking/seat-selection/seat.html',
  '/bookings': '/pages/booking/booking-details/bookings.html',
  '/booking-details': '/pages/booking/booking-details/bookings.html',
  '/datepicker': '/pages/booking/date-picker/datepicker.html',
  '/date-picker': '/pages/booking/date-picker/datepicker.html',
  '/trips': '/pages/trips/trip-list/trip.html',
  '/trip': '/pages/trips/trip-list/trip.html',
  '/e-ticket': '/pages/trips/e-ticket/e-ticket.html',
  '/cancel-booking': '/pages/trips/cancel-booking/cancelbooking.html',
  '/cancel-confirmation': '/pages/trips/cancel-confirmation/cancelconfirmation.html',
  '/payment': '/pages/payment/checkout/payment.html',
  '/checkout': '/pages/payment/checkout/payment.html',
  '/explore': '/pages/user/explore/explore.html',
  '/profile': '/pages/user/profile/profile.html',
  '/notifications': '/pages/user/notifications/notification.html',
  '/notification': '/pages/user/notifications/notification.html',
  '/settings': '/pages/user/settings/settings.html',
  '/logout': '/pages/user/logout/logout.html',
  '/delete-account': '/pages/user/delete-account/delete.html',
  '/login': '/pages/auth/login/login.html',
  '/signup': '/pages/auth/signup/signup.html',
  '/confirmation': '/pages/auth/confirmation/confirmation.html',
  '/forgot-password': '/pages/auth/forgot-password/forgot-password.html'
};

// Map any HTML file name to its canonical clean route for automatic redirection
const HTML_FILE_TO_ROUTE = {
  'index.html': '/',
  'splash.html': '/splash',
  'onboarding.html': '/onboarding',
  'onboarding2.html': '/onboarding-2',
  'home.html': '/home',
  'search.html': '/search',
  'flight.html': '/flight-details',
  'seat.html': '/seat-selection',
  'bookings.html': '/booking-details',
  'datepicker.html': '/date-picker',
  'trip.html': '/trips',
  'e-ticket.html': '/e-ticket',
  'cancelbooking.html': '/cancel-booking',
  'cancelconfirmation.html': '/cancel-confirmation',
  'payment.html': '/payment',
  'explore.html': '/explore',
  'profile.html': '/profile',
  'notification.html': '/notifications',
  'settings.html': '/settings',
  'logout.html': '/logout',
  'delete.html': '/delete-account',
  'login.html': '/login',
  'signup.html': '/signup',
  'confirmation.html': '/confirmation',
  'forgot-password.html': '/forgot-password'
};


// Build recursive asset index for pages, shared & assets to guarantee zero 404s for relative assets
const assetIndex = new Map();
function indexDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      indexDirectory(fullPath);
    } else {
      assetIndex.set(entry.name.toLowerCase(), fullPath);
    }
  }
}
indexDirectory(path.join(root, 'pages'));
indexDirectory(path.join(root, 'shared'));
indexDirectory(path.join(root, 'assets'));

function serveFile(filePath, res) {
  // Security check to prevent directory traversal
  if (!filePath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      return res.end(`
        <div style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2>404 - Not Found</h2>
          <p>Cannot find file: <code>${path.relative(root, filePath)}</code></p>
          <a href="/home">Go to Home</a>
        </div>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const [rawUrlPath, queryString] = req.url.split('?');
  const reqPath = decodeURI(rawUrlPath).replace(/\/+$/, '') || '/';
  const reqPathLower = reqPath.toLowerCase();

  // 1. Check Canonical Clean Route mapping first (serves clean route immediately)
  if (ROUTE_MAP[reqPathLower]) {
    const targetHtml = path.join(root, ROUTE_MAP[reqPathLower]);
    return serveFile(targetHtml, res);
  }

  // 2. Redirect ANY path ending in an HTML file (e.g. /login/login.html, /user/profile/profile.html, /booking/home/home.html)
  const baseName = path.basename(reqPathLower);
  if (baseName.endsWith('.html') && HTML_FILE_TO_ROUTE[baseName]) {
    const cleanRoute = HTML_FILE_TO_ROUTE[baseName];
    const redirectUrl = queryString ? `${cleanRoute}?${queryString}` : cleanRoute;
    res.writeHead(302, { 'Location': redirectUrl });
    return res.end();
  }

  // 3. Redirect nested subpaths without .html (e.g. /booking/home -> /home, /user/profile -> /profile, /auth/login -> /login)
  const segments = reqPathLower.split('/').filter(Boolean);
  if (segments.length > 1) {
    const lastSegment = '/' + segments[segments.length - 1];
    if (ROUTE_MAP[lastSegment]) {
      const redirectUrl = queryString ? `${lastSegment}?${queryString}` : lastSegment;
      res.writeHead(302, { 'Location': redirectUrl });
      return res.end();
    }
  }

  // 4. Check direct file existence (for static assets like /shared/css/..., /assets/...)
  const directPath = path.join(root, reqPath);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return serveFile(directPath, res);
  }

  // 5. Check if appending .html works
  const htmlPath = directPath + '.html';
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return serveFile(htmlPath, res);
  }

  // 6. Smart asset resolution fallback (e.g., /home.css -> /pages/booking/home/home.css)
  if (assetIndex.has(baseName)) {
    const resolvedPath = assetIndex.get(baseName);
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      return serveFile(resolvedPath, res);
    }
  }

  // 7. Not found
  res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end(`
    <div style="font-family:sans-serif;padding:40px;text-align:center;">
      <h2>404 - Not Found</h2>
      <p>Cannot find: <code>${reqPath}</code></p>
      <a href="/home" style="color:#007A8C;text-decoration:none;font-weight:600;">Go to TravelGenesis Home</a>
    </div>
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
    console.log(`💡 If a dev server is already running in another window, you can use that one, or close it, or run with: $env:PORT=3002; npm run dev\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 TravelGenesis Clean-Route Server running!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`   /           -> Gateway Screen`);
  console.log(`   /splash     -> Splash Screen`);
  console.log(`   /home       -> Flight Booking Home`);
  console.log(`   /trips      -> My Trips`);
  console.log(`   /explore    -> Explore Destinations`);
  console.log(`   /profile    -> User Profile`);
  console.log(`   /login      -> Login`);
  console.log(`   /signup     -> Sign Up`);
  console.log(`Press Ctrl+C to stop.`);
  console.log('====================================================');
});
