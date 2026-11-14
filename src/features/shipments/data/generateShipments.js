const CITIES = [
  'New York',
  'Shanghai',
  'Rotterdam',
  'Hamburg',
  'Singapore',
  'Tokyo',
  'Los Angeles',
  'London',
  'Dubai',
  'Antwerp',
  'Hong Kong',
  'Busan',
  'Bremen',
  'Frankfurt',
  'Sydney',
  'Mumbai',
  'Sao Paulo',
  'Toronto',
  'Chicago',
  'Valencia',
];

const CARRIERS = [
  'DHL Express',
  'FedEx Logistics',
  'Maersk Line',
  'Hapag-Lloyd',
  'UPS Worldwide',
  'Kuehne+Nagel',
  'DB Schenker',
  'CMA CGM',
  'MSC Mediterranean',
  'Evergreen Marine',
];

const STATUSES = ['In Transit', 'Delivered', 'Delayed', 'Customs Hold', 'Exception'];
const VERIFICATION_STATUSES = ['Pending Review', 'In Review', 'Verified'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateShipments(count = 100000, seed = 123456) {
  const rand = mulberry32(seed);
  const shipments = new Array(count);
  const baseTime = Date.parse('2026-11-14T08:00:00Z');

  for (let i = 0; i < count; i++) {
    const idNumber = 10000 + i;
    const id = `SHP-${idNumber}`;
    const originIdx = Math.floor(rand() * CITIES.length);
    let destIdx = Math.floor(rand() * CITIES.length);
    if (destIdx === originIdx) {
      destIdx = (originIdx + 1) % CITIES.length;
    }

    const carrierIdx = Math.floor(rand() * CARRIERS.length);
    const statusIdx = Math.floor(rand() * STATUSES.length);
    const priorityIdx = Math.floor(rand() * PRIORITIES.length);
    const verifIdx = Math.floor(rand() * VERIFICATION_STATUSES.length);

    const etaDays = Math.floor(rand() * 30) + 1;
    const etaDate = new Date(baseTime + etaDays * 86400000);
    const eta = etaDate.toISOString().split('T')[0];

    const pastHours = Math.floor(rand() * 168);
    const lastUpdated = new Date(baseTime - pastHours * 3600000).toISOString().replace('T', ' ').slice(0, 19);

    shipments[i] = {
      id,
      origin: CITIES[originIdx],
      destination: CITIES[destIdx],
      carrier: CARRIERS[carrierIdx],
      status: STATUSES[statusIdx],
      eta,
      priority: PRIORITIES[priorityIdx],
      lastUpdated,
      verificationStatus: VERIFICATION_STATUSES[verifIdx],
    };
  }

  shipments[0] = {
    id: 'SHP-10482',
    origin: 'New York',
    destination: 'London',
    carrier: 'DHL Express',
    status: 'In Transit',
    eta: '2026-11-20',
    priority: 'High',
    lastUpdated: '2026-11-14 10:30:00',
    verificationStatus: 'Pending Review',
  };

  return shipments;
}
