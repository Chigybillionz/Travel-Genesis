const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

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
  '/confirmation': '/pages/auth/confirmation/confirmation.html'
};

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      getFiles(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

const checkDirs = [
  path.join(rootDir, 'pages'),
  path.join(rootDir, 'shared'),
  path.join(rootDir, 'assets')
];

let allFiles = [path.join(rootDir, 'index.html')];
checkDirs.forEach(d => {
  allFiles = allFiles.concat(getFiles(d));
});

const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const jsFiles = allFiles.filter(f => f.endsWith('.js'));
const cssFiles = allFiles.filter(f => f.endsWith('.css'));

console.log('=== TravelGenesis Project Audit ===');
console.log(`Auditing: ${htmlFiles.length} HTML files, ${jsFiles.length} JS files, ${cssFiles.length} CSS files`);

let issuesFound = 0;

// 1. Check HTML references (src, href)
for (const h of htmlFiles) {
  const content = fs.readFileSync(h, 'utf8');
  const dir = path.dirname(h);
  const regex = /(?:src|href)=["']([^"'#:]+?)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('javascript:') || ref.startsWith('data:') || ref === '#') continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;
    
    let resolved;
    if (ROUTE_MAP[cleanRef]) {
      resolved = path.join(rootDir, ROUTE_MAP[cleanRef]);
    } else if (cleanRef.startsWith('/')) {
      resolved = path.join(rootDir, cleanRef.replace(/^\//, ''));
    } else {
      resolved = path.resolve(dir, cleanRef);
    }

    if (!fs.existsSync(resolved)) {
      issuesFound++;
      console.error(`[Missing in HTML] ${path.relative(rootDir, h)}: "${ref}" -> ${path.relative(rootDir, resolved)} not found`);
    }
  }
}

// 2. Check JS navigation references (location.href) and asset changes
for (const j of jsFiles) {
  const content = fs.readFileSync(j, 'utf8');
  const dir = path.dirname(j);
  const regex = /(?:window\.location(?:\.href)?|location\.href)\s*=\s*["']([^"'#:]+?)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('javascript:') || ref === '#') continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;
    
    let resolved;
    if (ROUTE_MAP[cleanRef]) {
      resolved = path.join(rootDir, ROUTE_MAP[cleanRef]);
    } else if (cleanRef.startsWith('/')) {
      resolved = path.join(rootDir, cleanRef.replace(/^\//, ''));
    } else if (j.includes('shared-nav.js')) {
      resolved = path.resolve(path.join(rootDir, 'pages/booking/home'), cleanRef);
    } else {
      resolved = path.resolve(dir, cleanRef);
    }

    if (!fs.existsSync(resolved)) {
      issuesFound++;
      console.error(`[Missing in JS Navigation] ${path.relative(rootDir, j)}: "${ref}" -> ${path.relative(rootDir, resolved)} not found`);
    }
  }

  // Check for dynamic image src in JS
  const imgRegex = /\.src\s*=\s*["']([^"'#:]+?)["']/g;
  while ((match = imgRegex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    if (!cleanRef) continue;

    let resolved = path.resolve(dir, cleanRef);
    if (!fs.existsSync(resolved)) {
      issuesFound++;
      console.error(`[Missing in JS Asset] ${path.relative(rootDir, j)}: "${ref}" -> ${path.relative(rootDir, resolved)} not found`);
    }
  }

  // Check JavaScript syntax
  try {
    new Function(content);
  } catch (err) {
    issuesFound++;
    console.error(`[JS Syntax Error] in ${path.relative(rootDir, j)}: ${err.message}`);
  }
}

if (issuesFound === 0) {
  console.log('✅ All asset references, scripts, stylesheets, and navigation links passed verification!');
  process.exit(0);
} else {
  console.error(`❌ Found ${issuesFound} issues to resolve.`);
  process.exit(1);
}
