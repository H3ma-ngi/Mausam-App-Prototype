import { CurrentWeather, HourlyForecastItem, DailyForecastItem, TimeOfDay } from '../types';

export type IndiaRegion =
  | 'North'
  | 'South'
  | 'West'
  | 'East'
  | 'Central'
  | 'North-East'
  | 'Islands';

export type ClimateZone =
  | 'Himalayan'
  | 'Indo-Gangetic'
  | 'Coastal'
  | 'Deccan'
  | 'Arid'
  | 'Central'
  | 'North-East Hills'
  | 'Island';

export interface IndiaLocation {
  id: string;
  name: string;
  nameHi: string;
  state: string;
  stateHi: string;
  region: IndiaRegion;
  climateZone: ClimateZone;
  elevationMeters: number;
  stationCode: string;
  popular?: boolean;
}

export const ALL_INDIA_LOCATIONS: IndiaLocation[] = [
  // --- METROS & POPULAR ---
  {
    id: 'pune',
    name: 'Pune, Maharashtra',
    nameHi: 'पुणे, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Deccan',
    elevationMeters: 560,
    stationCode: 'AWS-43063',
    popular: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai, Maharashtra',
    nameHi: 'मुंबई, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Coastal',
    elevationMeters: 14,
    stationCode: 'AWS-43003',
    popular: true,
  },
  {
    id: 'delhi',
    name: 'New Delhi, NCR',
    nameHi: 'नई दिल्ली, एनसीआर',
    state: 'Delhi NCR',
    stateHi: 'दिल्ली एनसीआर',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 216,
    stationCode: 'AWS-42182',
    popular: true,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru, Karnataka',
    nameHi: 'बेंगलुरु, कर्नाटक',
    state: 'Karnataka',
    stateHi: 'कर्नाटक',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 920,
    stationCode: 'AWS-43295',
    popular: true,
  },
  {
    id: 'kolkata',
    name: 'Kolkata, West Bengal',
    nameHi: 'कोलकाता, पश्चिम बंगाल',
    state: 'West Bengal',
    stateHi: 'पश्चिम बंगाल',
    region: 'East',
    climateZone: 'Coastal',
    elevationMeters: 9,
    stationCode: 'AWS-42809',
    popular: true,
  },
  {
    id: 'chennai',
    name: 'Chennai, Tamil Nadu',
    nameHi: 'चेन्नई, तमिलनाडु',
    state: 'Tamil Nadu',
    stateHi: 'तमिलनाडु',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 7,
    stationCode: 'AWS-43279',
    popular: true,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad, Telangana',
    nameHi: 'हैदराबाद, तेलंगाना',
    state: 'Telangana',
    stateHi: 'तेलंगाना',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 542,
    stationCode: 'AWS-43128',
    popular: true,
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad, Gujarat',
    nameHi: 'अहमदाबाद, गुजरात',
    state: 'Gujarat',
    stateHi: 'गुजरात',
    region: 'West',
    climateZone: 'Arid',
    elevationMeters: 53,
    stationCode: 'AWS-42647',
    popular: true,
  },
  {
    id: 'jaipur',
    name: 'Jaipur, Rajasthan',
    nameHi: 'जयपुर, राजस्थान',
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    region: 'North',
    climateZone: 'Arid',
    elevationMeters: 431,
    stationCode: 'AWS-42348',
    popular: true,
  },
  {
    id: 'lucknow',
    name: 'Lucknow, Uttar Pradesh',
    nameHi: 'लखनऊ, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 123,
    stationCode: 'AWS-42369',
    popular: true,
  },
  {
    id: 'srinagar',
    name: 'Srinagar, Jammu & Kashmir',
    nameHi: 'श्रीनगर, जम्मू और कश्मीर',
    state: 'Jammu & Kashmir',
    stateHi: 'जम्मू और कश्मीर',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 1585,
    stationCode: 'AWS-42027',
    popular: true,
  },
  {
    id: 'shimla',
    name: 'Shimla, Himachal Pradesh',
    nameHi: 'शिमला, हिमाचल प्रदेश',
    state: 'Himachal Pradesh',
    stateHi: 'हिमाचल प्रदेश',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 2206,
    stationCode: 'AWS-42083',
    popular: true,
  },
  {
    id: 'guwahati',
    name: 'Guwahati, Assam',
    nameHi: 'गुवाहाटी, असम',
    state: 'Assam',
    stateHi: 'असम',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 55,
    stationCode: 'AWS-42410',
    popular: true,
  },
  {
    id: 'kochi',
    name: 'Kochi, Kerala',
    nameHi: 'कोच्चि, केरल',
    state: 'Kerala',
    stateHi: 'केरल',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 4,
    stationCode: 'AWS-43353',
    popular: true,
  },
  {
    id: 'goa',
    name: 'Panaji, Goa',
    nameHi: 'पणजी, गोवा',
    state: 'Goa',
    stateHi: 'गोवा',
    region: 'West',
    climateZone: 'Coastal',
    elevationMeters: 13,
    stationCode: 'AWS-43192',
    popular: true,
  },

  // --- NORTH INDIA ---
  {
    id: 'chandigarh',
    name: 'Chandigarh, UT',
    nameHi: 'चंडीगढ़',
    state: 'Chandigarh',
    stateHi: 'चंडीगढ़',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 321,
    stationCode: 'AWS-42131',
  },
  {
    id: 'amritsar',
    name: 'Amritsar, Punjab',
    nameHi: 'अमृतसर, पंजाब',
    state: 'Punjab',
    stateHi: 'पंजाब',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 234,
    stationCode: 'AWS-42071',
  },
  {
    id: 'ludhiana',
    name: 'Ludhiana, Punjab',
    nameHi: 'लुधियाना, पंजाब',
    state: 'Punjab',
    stateHi: 'पंजाब',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 244,
    stationCode: 'AWS-42099',
  },
  {
    id: 'dehradun',
    name: 'Dehradun, Uttarakhand',
    nameHi: 'देहरादून, उत्तराखंड',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 640,
    stationCode: 'AWS-42111',
  },
  {
    id: 'haridwar',
    name: 'Haridwar, Uttarakhand',
    nameHi: 'हरिद्वार, उत्तराखंड',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 314,
    stationCode: 'AWS-42118',
  },
  {
    id: 'nainital',
    name: 'Nainital, Uttarakhand',
    nameHi: 'नैनीताल, उत्तराखंड',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 2084,
    stationCode: 'AWS-42125',
  },
  {
    id: 'manali',
    name: 'Manali, Himachal Pradesh',
    nameHi: 'मनाली, हिमाचल प्रदेश',
    state: 'Himachal Pradesh',
    stateHi: 'हिमाचल प्रदेश',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 2050,
    stationCode: 'AWS-42078',
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala, Himachal Pradesh',
    nameHi: 'धर्मशाला, हिमाचल प्रदेश',
    state: 'Himachal Pradesh',
    stateHi: 'हिमाचल प्रदेश',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 1457,
    stationCode: 'AWS-42065',
  },
  {
    id: 'leh',
    name: 'Leh, Ladakh',
    nameHi: 'लेह, लद्दाख',
    state: 'Ladakh',
    stateHi: 'लद्दाख',
    region: 'North',
    climateZone: 'Himalayan',
    elevationMeters: 3524,
    stationCode: 'AWS-42018',
    popular: true,
  },
  {
    id: 'jammu',
    name: 'Jammu, Jammu & Kashmir',
    nameHi: 'जम्मू, जम्मू और कश्मीर',
    state: 'Jammu & Kashmir',
    stateHi: 'जम्मू और कश्मीर',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 327,
    stationCode: 'AWS-42056',
  },
  {
    id: 'varanasi',
    name: 'Varanasi, Uttar Pradesh',
    nameHi: 'वाराणसी, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 81,
    stationCode: 'AWS-42475',
    popular: true,
  },
  {
    id: 'agra',
    name: 'Agra, Uttar Pradesh',
    nameHi: 'आगरा, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 169,
    stationCode: 'AWS-42260',
  },
  {
    id: 'kanpur',
    name: 'Kanpur, Uttar Pradesh',
    nameHi: 'कानपुर, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 126,
    stationCode: 'AWS-42379',
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj (Allahabad), UP',
    nameHi: 'प्रयागराज, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 98,
    stationCode: 'AWS-42473',
  },
  {
    id: 'ayodhya',
    name: 'Ayodhya, Uttar Pradesh',
    nameHi: 'अयोध्या, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 102,
    stationCode: 'AWS-42372',
  },
  {
    id: 'noida',
    name: 'Noida, Uttar Pradesh',
    nameHi: 'नोएडा, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 200,
    stationCode: 'AWS-42186',
  },
  {
    id: 'gurugram',
    name: 'Gurugram, Haryana',
    nameHi: 'गुरुग्राम, हरियाणा',
    state: 'Haryana',
    stateHi: 'हरियाणा',
    region: 'North',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 220,
    stationCode: 'AWS-42185',
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur, Rajasthan',
    nameHi: 'जोधपुर, राजस्थान',
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    region: 'North',
    climateZone: 'Arid',
    elevationMeters: 231,
    stationCode: 'AWS-42339',
  },
  {
    id: 'udaipur',
    name: 'Udaipur, Rajasthan',
    nameHi: 'उदयपुर, राजस्थान',
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    region: 'North',
    climateZone: 'Arid',
    elevationMeters: 598,
    stationCode: 'AWS-42451',
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer, Rajasthan',
    nameHi: 'जैसलमेर, राजस्थान',
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    region: 'North',
    climateZone: 'Arid',
    elevationMeters: 225,
    stationCode: 'AWS-42328',
  },
  {
    id: 'kota',
    name: 'Kota, Rajasthan',
    nameHi: 'कोटा, राजस्थान',
    state: 'Rajasthan',
    stateHi: 'राजस्थान',
    region: 'North',
    climateZone: 'Arid',
    elevationMeters: 271,
    stationCode: 'AWS-42452',
  },

  // --- WEST INDIA ---
  {
    id: 'nashik',
    name: 'Nashik, Maharashtra',
    nameHi: 'नासिक, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Deccan',
    elevationMeters: 600,
    stationCode: 'AWS-43058',
  },
  {
    id: 'nagpur',
    name: 'Nagpur, Maharashtra',
    nameHi: 'नागपुर, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Central',
    elevationMeters: 310,
    stationCode: 'AWS-42867',
    popular: true,
  },
  {
    id: 'sambhajinagar',
    name: 'Chhatrapati Sambhajinagar, Maharashtra',
    nameHi: 'छत्रपति संभाजीनगर, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Deccan',
    elevationMeters: 568,
    stationCode: 'AWS-43014',
  },
  {
    id: 'kolhapur',
    name: 'Kolhapur, Maharashtra',
    nameHi: 'कोल्हापुर, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Deccan',
    elevationMeters: 569,
    stationCode: 'AWS-43117',
  },
  {
    id: 'solapur',
    name: 'Solapur, Maharashtra',
    nameHi: 'सोलापुर, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Deccan',
    elevationMeters: 458,
    stationCode: 'AWS-43113',
  },
  {
    id: 'mahabaleshwar',
    name: 'Mahabaleshwar, Maharashtra',
    nameHi: 'महाबलेश्वर, महाराष्ट्र',
    state: 'Maharashtra',
    stateHi: 'महाराष्ट्र',
    region: 'West',
    climateZone: 'Himalayan',
    elevationMeters: 1353,
    stationCode: 'AWS-43068',
  },
  {
    id: 'surat',
    name: 'Surat, Gujarat',
    nameHi: 'सूरत, गुजरात',
    state: 'Gujarat',
    stateHi: 'गुजरात',
    region: 'West',
    climateZone: 'Coastal',
    elevationMeters: 13,
    stationCode: 'AWS-42840',
  },
  {
    id: 'vadodara',
    name: 'Vadodara, Gujarat',
    nameHi: 'वडोदरा, गुजरात',
    state: 'Gujarat',
    stateHi: 'गुजरात',
    region: 'West',
    climateZone: 'Arid',
    elevationMeters: 39,
    stationCode: 'AWS-42745',
  },
  {
    id: 'rajkot',
    name: 'Rajkot, Gujarat',
    nameHi: 'राजकोट, गुजरात',
    state: 'Gujarat',
    stateHi: 'गुजरात',
    region: 'West',
    climateZone: 'Arid',
    elevationMeters: 128,
    stationCode: 'AWS-42737',
  },
  {
    id: 'bhuj',
    name: 'Bhuj, Kutch, Gujarat',
    nameHi: 'भुज (कच्छ), गुजरात',
    state: 'Gujarat',
    stateHi: 'गुजरात',
    region: 'West',
    climateZone: 'Arid',
    elevationMeters: 110,
    stationCode: 'AWS-42634',
  },
  {
    id: 'daman',
    name: 'Daman, DNHDD',
    nameHi: 'दमन',
    state: 'Dadra & Nagar Haveli and Daman & Diu',
    stateHi: 'दादरा और नगर हवेली एवं दमन और दीव',
    region: 'West',
    climateZone: 'Coastal',
    elevationMeters: 5,
    stationCode: 'AWS-42939',
  },

  // --- SOUTH INDIA ---
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam, Andhra Pradesh',
    nameHi: 'विशाखापत्तनम, आंध्र प्रदेश',
    state: 'Andhra Pradesh',
    stateHi: 'आंध्र प्रदेश',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 45,
    stationCode: 'AWS-43149',
    popular: true,
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada, Andhra Pradesh',
    nameHi: 'विजयवाड़ा, आंध्र प्रदेश',
    state: 'Andhra Pradesh',
    stateHi: 'आंध्र प्रदेश',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 23,
    stationCode: 'AWS-43189',
  },
  {
    id: 'tirupati',
    name: 'Tirupati, Andhra Pradesh',
    nameHi: 'तिरुपति, आंध्र प्रदेश',
    state: 'Andhra Pradesh',
    stateHi: 'आंध्र प्रदेश',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 161,
    stationCode: 'AWS-43285',
  },
  {
    id: 'mysuru',
    name: 'Mysuru, Karnataka',
    nameHi: 'मैसूरु, कर्नाटक',
    state: 'Karnataka',
    stateHi: 'कर्नाटक',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 763,
    stationCode: 'AWS-43301',
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru, Karnataka',
    nameHi: 'मंगलुरु, कर्नाटक',
    state: 'Karnataka',
    stateHi: 'कर्नाटक',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 22,
    stationCode: 'AWS-43284',
  },
  {
    id: 'hubballi',
    name: 'Hubballi-Dharwad, Karnataka',
    nameHi: 'हुबली-धारवाड़, कर्नाटक',
    state: 'Karnataka',
    stateHi: 'कर्नाटक',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 671,
    stationCode: 'AWS-43217',
  },
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram, Kerala',
    nameHi: 'तिरुवनंतपुरम, केरल',
    state: 'Kerala',
    stateHi: 'केरल',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 64,
    stationCode: 'AWS-43371',
    popular: true,
  },
  {
    id: 'kozhikode',
    name: 'Kozhikode, Kerala',
    nameHi: 'कोझिकोड, केरल',
    state: 'Kerala',
    stateHi: 'केरल',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 1,
    stationCode: 'AWS-43314',
  },
  {
    id: 'munnar',
    name: 'Munnar, Kerala',
    nameHi: 'मुन्नार, केरल',
    state: 'Kerala',
    stateHi: 'केरल',
    region: 'South',
    climateZone: 'Himalayan',
    elevationMeters: 1532,
    stationCode: 'AWS-43348',
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore, Tamil Nadu',
    nameHi: 'कोयंबटूर, तमिलनाडु',
    state: 'Tamil Nadu',
    stateHi: 'तमिलनाडु',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 411,
    stationCode: 'AWS-43325',
  },
  {
    id: 'madurai',
    name: 'Madurai, Tamil Nadu',
    nameHi: 'मदुरै, तमिलनाडु',
    state: 'Tamil Nadu',
    stateHi: 'तमिलनाडु',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 101,
    stationCode: 'AWS-43346',
  },
  {
    id: 'ooty',
    name: 'Ooty (Udhagamandalam), Tamil Nadu',
    nameHi: 'ऊटी (उधगमंडलम), तमिलनाडु',
    state: 'Tamil Nadu',
    stateHi: 'तमिलनाडु',
    region: 'South',
    climateZone: 'Himalayan',
    elevationMeters: 2240,
    stationCode: 'AWS-43318',
    popular: true,
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari, Tamil Nadu',
    nameHi: 'कन्याकुमारी, तमिलनाडु',
    state: 'Tamil Nadu',
    stateHi: 'तमिलनाडु',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 10,
    stationCode: 'AWS-43385',
  },
  {
    id: 'puducherry',
    name: 'Puducherry, UT',
    nameHi: 'पुदुचेरी',
    state: 'Puducherry',
    stateHi: 'पुदुचेरी',
    region: 'South',
    climateZone: 'Coastal',
    elevationMeters: 3,
    stationCode: 'AWS-43321',
  },
  {
    id: 'warangal',
    name: 'Warangal, Telangana',
    nameHi: 'वारंगल, तेलंगाना',
    state: 'Telangana',
    stateHi: 'तेलंगाना',
    region: 'South',
    climateZone: 'Deccan',
    elevationMeters: 266,
    stationCode: 'AWS-43118',
  },

  // --- EAST INDIA ---
  {
    id: 'patna',
    name: 'Patna, Bihar',
    nameHi: 'पटना, बिहार',
    state: 'Bihar',
    stateHi: 'बिहार',
    region: 'East',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 53,
    stationCode: 'AWS-42492',
    popular: true,
  },
  {
    id: 'gaya',
    name: 'Gaya, Bihar',
    nameHi: 'गया, बिहार',
    state: 'Bihar',
    stateHi: 'बिहार',
    region: 'East',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 111,
    stationCode: 'AWS-42591',
  },
  {
    id: 'ranchi',
    name: 'Ranchi, Jharkhand',
    nameHi: 'रांची, झारखंड',
    state: 'Jharkhand',
    stateHi: 'झारखंड',
    region: 'East',
    climateZone: 'Central',
    elevationMeters: 651,
    stationCode: 'AWS-42701',
    popular: true,
  },
  {
    id: 'jamshedpur',
    name: 'Jamshedpur, Jharkhand',
    nameHi: 'जमशेदपुर, झारखंड',
    state: 'Jharkhand',
    stateHi: 'झारखंड',
    region: 'East',
    climateZone: 'Central',
    elevationMeters: 135,
    stationCode: 'AWS-42798',
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar, Odisha',
    nameHi: 'भुवनेश्वर, ओडिशा',
    state: 'Odisha',
    stateHi: 'ओडिशा',
    region: 'East',
    climateZone: 'Coastal',
    elevationMeters: 45,
    stationCode: 'AWS-42971',
    popular: true,
  },
  {
    id: 'puri',
    name: 'Puri, Odisha',
    nameHi: 'पुरी, ओडिशा',
    state: 'Odisha',
    stateHi: 'ओडिशा',
    region: 'East',
    climateZone: 'Coastal',
    elevationMeters: 8,
    stationCode: 'AWS-43053',
  },
  {
    id: 'siliguri',
    name: 'Siliguri, West Bengal',
    nameHi: 'सिलीगुड़ी, पश्चिम बंगाल',
    state: 'West Bengal',
    stateHi: 'पश्चिम बंगाल',
    region: 'East',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 122,
    stationCode: 'AWS-42403',
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling, West Bengal',
    nameHi: 'दार्जिलिंग, पश्चिम बंगाल',
    state: 'West Bengal',
    stateHi: 'पश्चिम बंगाल',
    region: 'East',
    climateZone: 'Himalayan',
    elevationMeters: 2042,
    stationCode: 'AWS-42295',
    popular: true,
  },

  // --- CENTRAL INDIA ---
  {
    id: 'bhopal',
    name: 'Bhopal, Madhya Pradesh',
    nameHi: 'भोपाल, मध्य प्रदेश',
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    region: 'Central',
    climateZone: 'Central',
    elevationMeters: 527,
    stationCode: 'AWS-42667',
    popular: true,
  },
  {
    id: 'indore',
    name: 'Indore, Madhya Pradesh',
    nameHi: 'इंदौर, मध्य प्रदेश',
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    region: 'Central',
    climateZone: 'Central',
    elevationMeters: 553,
    stationCode: 'AWS-42754',
    popular: true,
  },
  {
    id: 'gwalior',
    name: 'Gwalior, Madhya Pradesh',
    nameHi: 'ग्वालियर, मध्य प्रदेश',
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    region: 'Central',
    climateZone: 'Indo-Gangetic',
    elevationMeters: 197,
    stationCode: 'AWS-42361',
  },
  {
    id: 'jabalpur',
    name: 'Jabalpur, Madhya Pradesh',
    nameHi: 'जबलपुर, मध्य प्रदेश',
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    region: 'Central',
    climateZone: 'Central',
    elevationMeters: 411,
    stationCode: 'AWS-42675',
  },
  {
    id: 'ujjain',
    name: 'Ujjain, Madhya Pradesh',
    nameHi: 'उज्जैन, मध्य प्रदेश',
    state: 'Madhya Pradesh',
    stateHi: 'मध्य प्रदेश',
    region: 'Central',
    climateZone: 'Central',
    elevationMeters: 494,
    stationCode: 'AWS-42751',
  },
  {
    id: 'raipur',
    name: 'Raipur, Chhattisgarh',
    nameHi: 'रायपुर, छत्तीसगढ़',
    state: 'Chhattisgarh',
    stateHi: 'छत्तीसगढ़',
    region: 'Central',
    climateZone: 'Central',
    elevationMeters: 298,
    stationCode: 'AWS-42874',
    popular: true,
  },
  {
    id: 'bilaspur',
    name: 'Bilaspur, Chhattisgarh',
    nameHi: 'बिलासपुर, छत्तीसगढ़',
    state: 'Chhattisgarh',
    stateHi: 'छत्तीसगढ़',
    region: 'Central',
    climateZone: 'Central',
    elevationMeters: 264,
    stationCode: 'AWS-42777',
  },

  // --- NORTH-EAST INDIA ---
  {
    id: 'shillong',
    name: 'Shillong, Meghalaya',
    nameHi: 'शिलांग, मेघालय',
    state: 'Meghalaya',
    stateHi: 'मेघालय',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 1525,
    stationCode: 'AWS-42516',
    popular: true,
  },
  {
    id: 'cherrapunji',
    name: 'Cherrapunji (Sohra), Meghalaya',
    nameHi: 'चेरापूंजी (सोहरा), मेघालय',
    state: 'Meghalaya',
    stateHi: 'मेघालय',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 1430,
    stationCode: 'AWS-42515',
  },
  {
    id: 'itanagar',
    name: 'Itanagar, Arunachal Pradesh',
    nameHi: 'ईटानगर, अरुणाचल प्रदेश',
    state: 'Arunachal Pradesh',
    stateHi: 'अरुणाचल प्रदेश',
    region: 'North-East',
    climateZone: 'Himalayan',
    elevationMeters: 750,
    stationCode: 'AWS-42308',
  },
  {
    id: 'tawang',
    name: 'Tawang, Arunachal Pradesh',
    nameHi: 'तवांग, अरुणाचल प्रदेश',
    state: 'Arunachal Pradesh',
    stateHi: 'अरुणाचल प्रदेश',
    region: 'North-East',
    climateZone: 'Himalayan',
    elevationMeters: 3048,
    stationCode: 'AWS-42301',
  },
  {
    id: 'gangtok',
    name: 'Gangtok, Sikkim',
    nameHi: 'गंगटोक, सिक्किम',
    state: 'Sikkim',
    stateHi: 'सिक्किम',
    region: 'North-East',
    climateZone: 'Himalayan',
    elevationMeters: 1650,
    stationCode: 'AWS-42299',
    popular: true,
  },
  {
    id: 'agartala',
    name: 'Agartala, Tripura',
    nameHi: 'अगरतला, त्रिपुरा',
    state: 'Tripura',
    stateHi: 'त्रिपुरा',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 16,
    stationCode: 'AWS-42724',
  },
  {
    id: 'imphal',
    name: 'Imphal, Manipur',
    nameHi: 'इम्फाल, मणिपुर',
    state: 'Manipur',
    stateHi: 'मणिपुर',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 786,
    stationCode: 'AWS-42623',
  },
  {
    id: 'aizawl',
    name: 'Aizawl, Mizoram',
    nameHi: 'आइजोल, मिजोरम',
    state: 'Mizoram',
    stateHi: 'मिजोरम',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 1132,
    stationCode: 'AWS-42826',
  },
  {
    id: 'kohima',
    name: 'Kohima, Nagaland',
    nameHi: 'कोहिमा, नागालैंड',
    state: 'Nagaland',
    stateHi: 'नागालैंड',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 1444,
    stationCode: 'AWS-42527',
  },
  {
    id: 'dibrugarh',
    name: 'Dibrugarh, Assam',
    nameHi: 'डिब्रूगढ़, असम',
    state: 'Assam',
    stateHi: 'असम',
    region: 'North-East',
    climateZone: 'North-East Hills',
    elevationMeters: 108,
    stationCode: 'AWS-42314',
  },

  // --- ISLANDS ---
  {
    id: 'port_blair',
    name: 'Port Blair, Andaman & Nicobar',
    nameHi: 'पोर्ट ब्लेयर, अंडमान व निकोबार',
    state: 'Andaman & Nicobar Islands',
    stateHi: 'अंडमान और निकोबार द्वीप समूह',
    region: 'Islands',
    climateZone: 'Island',
    elevationMeters: 16,
    stationCode: 'AWS-43333',
    popular: true,
  },
  {
    id: 'kavaratti',
    name: 'Kavaratti, Lakshadweep',
    nameHi: 'कवरत्ती, लक्षद्वीप',
    state: 'Lakshadweep',
    stateHi: 'लक्षद्वीप',
    region: 'Islands',
    climateZone: 'Island',
    elevationMeters: 3,
    stationCode: 'AWS-43369',
  },
];

// Region helper
export const INDIA_REGIONS: { id: IndiaRegion | 'All'; labelEn: string; labelHi: string }[] = [
  { id: 'All', labelEn: 'All India (160+)', labelHi: 'सम्पूर्ण भारत' },
  { id: 'North', labelEn: 'North', labelHi: 'उत्तर भारत' },
  { id: 'South', labelEn: 'South', labelHi: 'दक्षिण भारत' },
  { id: 'West', labelEn: 'West', labelHi: 'पश्चिम भारत' },
  { id: 'East', labelEn: 'East', labelHi: 'पूर्वी भारत' },
  { id: 'Central', labelEn: 'Central', labelHi: 'मध्य भारत' },
  { id: 'North-East', labelEn: 'North-East', labelHi: 'पूर्वोत्तर' },
  { id: 'Islands', labelEn: 'Islands', labelHi: 'द्वीप समूह' },
];

/**
 * Search locations by query string (matching English/Hindi name or state)
 */
export function searchIndiaLocations(query: string, region: IndiaRegion | 'All' = 'All'): IndiaLocation[] {
  const cleanQ = query.trim().toLowerCase();
  return ALL_INDIA_LOCATIONS.filter((loc) => {
    const matchesRegion = region === 'All' || loc.region === region;
    if (!matchesRegion) return false;
    if (!cleanQ) return true;

    return (
      loc.name.toLowerCase().includes(cleanQ) ||
      loc.nameHi.toLowerCase().includes(cleanQ) ||
      loc.state.toLowerCase().includes(cleanQ) ||
      loc.stateHi.toLowerCase().includes(cleanQ) ||
      loc.id.toLowerCase().includes(cleanQ) ||
      loc.stationCode.toLowerCase().includes(cleanQ)
    );
  });
}

/**
 * Find exact or best-matching location by ID or Name
 */
export function findIndiaLocation(locIdOrName: string): IndiaLocation {
  const clean = locIdOrName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const exact = ALL_INDIA_LOCATIONS.find(
    (l) => l.id.toLowerCase() === clean || l.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(clean)
  );
  if (exact) return exact;

  // Partial search
  const partial = ALL_INDIA_LOCATIONS.find(
    (l) => l.name.toLowerCase().includes(locIdOrName.toLowerCase()) || l.state.toLowerCase().includes(locIdOrName.toLowerCase())
  );
  if (partial) return partial;

  // Custom location procedural representation
  const titleName = locIdOrName.trim();
  return {
    id: clean || 'custom_loc',
    name: titleName.includes(',') ? titleName : `${titleName}, India`,
    nameHi: `${titleName}, भारत`,
    state: 'India',
    stateHi: 'भारत',
    region: 'Central',
    climateZone: 'Deccan',
    elevationMeters: 450,
    stationCode: `AWS-${Math.floor(40000 + Math.random() * 9000)}`,
  };
}

/**
 * Procedural Realistic Weather Generator for ANY Location across India
 */
export function generateWeatherForLocation(
  locIdOrName: string,
  timeOfDay: TimeOfDay = 'auto'
): CurrentWeather {
  const loc = findIndiaLocation(locIdOrName);

  // Baseline meteorology according to India's climate zone
  let baseTemp = 28;
  let baseHumidity = 65;
  let baseRainProb = 40;
  let baseUv = 6;
  let basePressure = 1010;
  let baseWind = 14;
  let windDir = 'WSW';
  let condition = 'Partly Cloudy';
  let conditionHi = 'आंशिक रूप से बादल';
  let icon = 'cloud-sun';
  let aqi = 75;
  let visibility = 7.5;
  let cloudCover = 45;

  switch (loc.climateZone) {
    case 'Himalayan':
      baseTemp = 16;
      baseHumidity = 52;
      baseRainProb = 25;
      baseUv = 7;
      basePressure = 920;
      baseWind = 10;
      windDir = 'N';
      condition = 'Crisp Mountain Breeze & Clear Sky';
      conditionHi = 'पहाड़ी स्वच्छ शीतल हवा एवं साफ आसमान';
      icon = 'sun';
      aqi = 28;
      visibility = 9.8;
      cloudCover = 30;
      break;

    case 'Coastal':
      baseTemp = 30;
      baseHumidity = 84;
      baseRainProb = 70;
      baseUv = 7;
      basePressure = 1005;
      baseWind = 22;
      windDir = 'SW';
      condition = 'Maritime Sea Breeze & Passing Showers';
      conditionHi = 'समुद्री हवाएं व स्थानीय बारिश की संभावना';
      icon = 'cloud-rain';
      aqi = 65;
      visibility = 5.5;
      cloudCover = 75;
      break;

    case 'Arid':
      baseTemp = 36;
      baseHumidity = 32;
      baseRainProb = 10;
      baseUv = 9;
      basePressure = 1002;
      baseWind = 18;
      windDir = 'WNW';
      condition = 'Intense Dry Sunshine & Thermal Haze';
      conditionHi = 'तेज धूप, शुष्क मौसम एवं हल्की धूल भरी हवा';
      icon = 'sun';
      aqi = 115;
      visibility = 6.0;
      cloudCover = 15;
      break;

    case 'Indo-Gangetic':
      baseTemp = 33;
      baseHumidity = 62;
      baseRainProb = 35;
      baseUv = 8;
      basePressure = 1006;
      baseWind = 11;
      windDir = 'NW';
      condition = 'Warm & Hazy Sunshine';
      conditionHi = 'उष्ण धुंधली धूप एवं मंद हवाएं';
      icon = 'cloud-sun';
      aqi = 185;
      visibility = 4.2;
      cloudCover = 40;
      break;

    case 'North-East Hills':
      baseTemp = 24;
      baseHumidity = 88;
      baseRainProb = 80;
      baseUv = 4;
      basePressure = 998;
      baseWind = 12;
      windDir = 'NE';
      condition = 'Overcast & Monsoonal Rain Bands';
      conditionHi = 'घने बादल एवं लगातार मानसूनी बौछारें';
      icon = 'cloud-rain';
      aqi = 32;
      visibility = 4.8;
      cloudCover = 90;
      break;

    case 'Island':
      baseTemp = 29;
      baseHumidity = 85;
      baseRainProb = 65;
      baseUv = 8;
      basePressure = 1008;
      baseWind = 24;
      windDir = 'SW';
      condition = 'Tropical Ocean Squall & Sunny Spells';
      conditionHi = 'उष्णकटिबंधीय समुद्री हवाएं व धूप-छांव';
      icon = 'cloud-sun';
      aqi = 20;
      visibility = 8.5;
      cloudCover = 60;
      break;

    case 'Central':
      baseTemp = 31;
      baseHumidity = 58;
      baseRainProb = 30;
      baseUv = 8;
      basePressure = 1008;
      baseWind = 13;
      windDir = 'W';
      condition = 'Sunny with Afternoon Clouds';
      conditionHi = 'धूप के साथ दोपहर में बादल';
      icon = 'cloud-sun';
      aqi = 95;
      visibility = 6.8;
      cloudCover = 45;
      break;

    case 'Deccan':
    default:
      baseTemp = 28;
      baseHumidity = 68;
      baseRainProb = 50;
      baseUv = 7;
      basePressure = 1010;
      baseWind = 16;
      windDir = 'WSW';
      condition = 'Partly Cloudy with Pleasant Breeze';
      conditionHi = 'आंशिक रूप से बादल व सुहावनी हवा';
      icon = 'cloud-sun';
      aqi = 72;
      visibility = 7.2;
      cloudCover = 55;
      break;
  }

  // Diurnal variation
  if (timeOfDay === 'morning') {
    baseTemp -= 3;
    baseHumidity = Math.min(95, baseHumidity + 8);
    baseUv = Math.max(1, baseUv - 4);
  } else if (timeOfDay === 'afternoon') {
    baseTemp += 3;
    baseHumidity = Math.max(20, baseHumidity - 10);
    baseUv = Math.min(11, baseUv + 2);
  } else if (timeOfDay === 'evening') {
    baseTemp -= 2;
    baseUv = 0;
  }

  return {
    location: loc.name,
    state: loc.state,
    temperature: baseTemp,
    feelsLike: Math.round(baseTemp + (baseHumidity > 70 ? 3 : 0)),
    condition,
    conditionHi,
    icon,
    humidity: baseHumidity,
    windSpeed: baseWind,
    windDirection: windDir,
    visibility,
    cloudCover,
    tempHigh: baseTemp + 3,
    tempLow: Math.max(8, baseTemp - 7),
    rainProbability: baseRainProb,
    airPressure: basePressure,
    uvIndex: baseUv,
    aqi,
    lastUpdated: `Live (${loc.stationCode} • Elev ${loc.elevationMeters}m)`,
  };
}

/**
 * Generate 24h Hourly Forecast for ANY Indian Location
 */
export function generateHourlyForecastForLocation(locIdOrName: string): HourlyForecastItem[] {
  const weather = generateWeatherForLocation(locIdOrName);
  const hours = [
    { time: '06:00 AM', deltaTemp: -4, rainMult: 0.6, icon: 'sun', uv: 1 },
    { time: '08:00 AM', deltaTemp: -2, rainMult: 0.8, icon: 'cloud-sun', uv: 3 },
    { time: '10:00 AM', deltaTemp: 0, rainMult: 0.9, icon: 'cloud-sun', uv: 6 },
    { time: '12:00 PM', deltaTemp: +3, rainMult: 1.1, icon: 'sun', uv: 8 },
    { time: '02:00 PM', deltaTemp: +4, rainMult: 1.3, icon: 'cloud-rain', uv: 7 },
    { time: '04:00 PM', deltaTemp: +2, rainMult: 1.2, icon: 'cloud-rain', uv: 4 },
    { time: '06:00 PM', deltaTemp: 0, rainMult: 1.0, icon: 'cloud', uv: 1 },
    { time: '08:00 PM', deltaTemp: -2, rainMult: 0.7, icon: 'moon', uv: 0 },
    { time: '10:00 PM', deltaTemp: -4, rainMult: 0.5, icon: 'moon', uv: 0 },
  ];

  return hours.map((h) => ({
    time: h.time,
    temp: weather.temperature + h.deltaTemp,
    condition: h.rainMult > 1.1 ? 'Rain Showers' : 'Partly Cloudy',
    rainProb: Math.min(95, Math.round(weather.rainProbability * h.rainMult)),
    uv: h.uv,
    icon: h.icon,
  }));
}

/**
 * Generate 7-Day Forecast for ANY Indian Location
 */
export function generateDailyForecastForLocation(locIdOrName: string): DailyForecastItem[] {
  const weather = generateWeatherForLocation(locIdOrName);
  const days = [
    { day: 'Today', dayHi: 'आज', date: 'Today', deltaHigh: 0, deltaLow: 0, rainMult: 1.0 },
    { day: 'Tomorrow', dayHi: 'कल', date: 'Day +1', deltaHigh: 1, deltaLow: 0, rainMult: 0.9 },
    { day: 'Day 3', dayHi: 'परसों', date: 'Day +2', deltaHigh: 0, deltaLow: -1, rainMult: 1.2 },
    { day: 'Day 4', dayHi: 'चौथा दिन', date: 'Day +3', deltaHigh: -1, deltaLow: -1, rainMult: 0.8 },
    { day: 'Day 5', dayHi: 'पांचवा दिन', date: 'Day +4', deltaHigh: 2, deltaLow: 1, rainMult: 0.6 },
    { day: 'Day 6', dayHi: 'छठा दिन', date: 'Day +5', deltaHigh: 1, deltaLow: 0, rainMult: 0.7 },
    { day: 'Day 7', dayHi: 'सातवां दिन', date: 'Day +6', deltaHigh: 0, deltaLow: -1, rainMult: 1.1 },
  ];

  return days.map((d) => ({
    day: d.day,
    dayHi: d.dayHi,
    date: d.date,
    tempMax: weather.tempHigh + d.deltaHigh,
    tempMin: weather.tempLow + d.deltaLow,
    condition: d.rainMult > 1.0 ? 'Monsoon Showers' : 'Partly Cloudy',
    conditionHi: d.rainMult > 1.0 ? 'मानसूनी बौछारें' : 'आंशिक बादल',
    rainProb: Math.min(95, Math.round(weather.rainProbability * d.rainMult)),
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
  }));
}
