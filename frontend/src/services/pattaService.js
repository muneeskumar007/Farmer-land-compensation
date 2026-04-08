import api from './api';

// Tamil Nadu Patta/Chitta district → lat/lng mapping for mock lookup
// In production, integrate with: https://eservices.tn.gov.in/eservicesnew/index.html
// or Tamil Nadu TNREGINET API / TNEGA API

const TN_DISTRICT_CENTERS = {
  'Ariyalur':     [11.14, 79.07],
  'Chengalpattu': [12.69, 79.97],
  'Chennai':      [13.08, 80.27],
  'Coimbatore':   [11.02, 76.96],
  'Cuddalore':    [11.75, 79.77],
  'Dharmapuri':   [12.13, 78.16],
  'Dindigul':     [10.36, 77.98],
  'Erode':        [11.34, 77.73],
  'Kallakurichi': [11.74, 78.96],
  'Kanchipuram':  [12.84, 79.70],
  'Kanyakumari':  [8.09, 77.55],
  'Karur':        [10.96, 78.08],
  'Krishnagiri':  [12.52, 78.22],
  'Madurai':      [9.93, 78.12],
  'Mayiladuthurai':[11.10, 79.65],
  'Nagapattinam': [10.77, 79.84],
  'Namakkal':     [11.22, 78.17],
  'Nilgiris':     [11.41, 76.74],
  'Perambalur':   [11.23, 78.88],
  'Pudukkottai':  [10.38, 78.82],
  'Ramanathapuram':[9.37, 78.83],
  'Ranipet':      [12.93, 79.33],
  'Salem':        [11.66, 78.15],
  'Sivaganga':    [9.84, 78.48],
  'Tenkasi':      [8.96, 77.32],
  'Thanjavur':    [10.79, 79.14],
  'Theni':        [10.01, 77.48],
  'Thoothukudi':  [8.76, 78.14],
  'Tiruchirappalli':[10.80, 78.69],
  'Tirunelveli':  [8.73, 77.69],
  'Tirupathur':   [12.50, 78.57],
  'Tiruppur':     [11.11, 77.34],
  'Tiruvallur':   [13.14, 79.91],
  'Tiruvannamalai':[12.23, 79.07],
  'Tiruvarur':    [10.77, 79.64],
  'Vellore':      [12.92, 79.13],
  'Viluppuram':   [11.94, 79.49],
  'Virudhunagar': [9.58, 77.96],
};

// Mock patta database (real: integrate TNREGINET)
const MOCK_PATTA_DB = {
  '1234': { district: 'Thanjavur', taluk: 'Thanjavur', village: 'Papanasam', lat: 10.9254, lng: 79.2675, surveyNo: '45/2A', area: '2.50 acres', owner: 'Rajesh Kumar', landType: 'Wet Land' },
  '5678': { district: 'Madurai', taluk: 'Melur', village: 'Keelakuilkudi', lat: 10.0282, lng: 78.3419, surveyNo: '12/1B', area: '3.75 acres', owner: 'Muthu Selvam', landType: 'Dry Land' },
  '9012': { district: 'Coimbatore', taluk: 'Pollachi', village: 'Kinathukadavu', lat: 10.7225, lng: 77.0487, surveyNo: '78/3', area: '5.10 acres', owner: 'Lakshmi Devi', landType: 'Wet Land' },
  '3456': { district: 'Salem', taluk: 'Attur', village: 'Mecheri', lat: 11.5984, lng: 78.2543, surveyNo: '22/4A', area: '1.80 acres', owner: 'Suresh Babu', landType: 'Garden Land' },
  '7890': { district: 'Tirunelveli', taluk: 'Nanguneri', village: 'Valliyoor', lat: 8.3964, lng: 77.6315, surveyNo: '33/2', area: '4.25 acres', owner: 'Arumugam P', landType: 'Wet Land' },
  '2345': { district: 'Tiruchirappalli', taluk: 'Musiri', village: 'Kollidam', lat: 10.9357, lng: 78.5847, surveyNo: '67/1C', area: '6.00 acres', owner: 'Kamal Farmer', landType: 'Wet Land' },
  '6789': { district: 'Erode', taluk: 'Bhavani', village: 'Kavundampalayam', lat: 11.4573, lng: 77.6897, surveyNo: '91/2B', area: '3.20 acres', owner: 'Selvam R', landType: 'Dry Land' },
};

export const pattaService = {
  /**
   * Look up land details by Patta number
   * In production: POST /api/patta/lookup → hits TNREGINET
   */
  async lookup(pattaNumber, district = '') {
    // Try real backend first
    try {
      const res = await api.post('/patta/lookup', { pattaNumber, district });
      return res.data;
    } catch {
      // Fallback to mock
      await new Promise(r => setTimeout(r, 1400));

      const clean = String(pattaNumber).trim();
      const data = MOCK_PATTA_DB[clean];

      if (data) {
        return {
          found: true,
          pattaNumber: clean,
          ...data,
          coordinates: { lat: data.lat.toFixed(6), lng: data.lng.toFixed(6) },
          address: `${data.village}, ${data.taluk} Taluk, ${data.district} District, Tamil Nadu`,
          source: 'TNREGINET (Mock)',
        };
      }

      // Try partial match or district-based fallback
      if (district && TN_DISTRICT_CENTERS[district]) {
        const [lat, lng] = TN_DISTRICT_CENTERS[district];
        const jitter = (Math.random() - 0.5) * 0.08;
        return {
          found: true,
          pattaNumber: clean,
          district,
          taluk: district,
          village: 'Unknown Village',
          lat: (lat + jitter).toFixed(6),
          lng: (lng + jitter).toFixed(6),
          coordinates: { lat: (lat + jitter).toFixed(6), lng: (lng + jitter).toFixed(6) },
          address: `${district} District, Tamil Nadu`,
          surveyNo: `${Math.floor(Math.random() * 200) + 1}/${Math.floor(Math.random() * 5) + 1}`,
          area: 'Unknown',
          landType: 'Agricultural Land',
          source: 'District Approximate',
          approximate: true,
        };
      }

      return { found: false, message: 'Patta not found. Please enter location manually.' };
    }
  },

  /**
   * Reverse geocode lat/lng to address using Nominatim
   */
  async reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ta,en`,
        { headers: { 'User-Agent': 'AgriComp/1.0' } }
      );
      const data = await res.json();
      return {
        address: data.display_name,
        village: data.address?.village || data.address?.town || data.address?.suburb || '',
        district: data.address?.county || data.address?.state_district || '',
        state: data.address?.state || '',
      };
    } catch {
      return { address: `${lat}, ${lng}`, village: '', district: '', state: 'Tamil Nadu' };
    }
  },

  /**
   * Calculate area of a polygon (drawn on map) in acres
   * Uses Shoelace formula with lat/lng → meters conversion
   */
  calculatePolygonArea(coords) {
    if (coords.length < 3) return 0;
    // Haversine-based area calculation
    const R = 6371000; // Earth radius in meters
    let area = 0;
    const n = coords.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const lat1 = coords[i][0] * Math.PI / 180;
      const lat2 = coords[j][0] * Math.PI / 180;
      const lng1 = coords[i][1] * Math.PI / 180;
      const lng2 = coords[j][1] * Math.PI / 180;
      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs(area * R * R / 2);
    // Convert m² → acres (1 acre = 4046.86 m²)
    return (area / 4046.86).toFixed(2);
  },

  /**
   * Get centroid of polygon
   */
  getPolygonCentroid(coords) {
    const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const lng = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    return { lat: lat.toFixed(6), lng: lng.toFixed(6) };
  },
};
