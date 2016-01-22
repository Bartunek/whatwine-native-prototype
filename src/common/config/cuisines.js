import { fromJS } from 'immutable';

/**
 * CUISINES:
 * ---------
 * Each cuisine is an array: [
 *  region,
 *  [country1, country2, ...],
 *  [restaurantType1, restaurantType2, ...]
 * ]
 * This associates cuisines with countries and (Foursquare)
 * groups of restaurants.
 */
export default fromJS([
  [
    'Europe',
    ['UK', 'Ireland', 'Holland', 'France', 'Germany', 'Italy',
      'Denmark', 'Norway', 'Switzerland', 'Austria', 'Hungary',
      'Cyprus', 'Greece', 'Greek',
      'Spain', 'Portugal',
      'Russia' // not sure if this should be multiple regions
    ],
    [
      'Austrian', 'Belgian', 'Czech', 'Fish & Chips', 'French',
      'Gastropub', 'German',
      'Greek', 'Bougatsa Shop', 'Cretan', 'Meze', 'Ouzeri',
      'Hungarian', 'Irish Pub', 'Italian', 'Mediterranean',
      'Pizza', 'Polish', 'Portuguese', 'Scandinavian',
      'Spanish', 'Paella', 'Tapas',
      'Swiss', 'Ukrainian', 'Varenyky',
      'Modern European', 'Eastern European', 'Sandwiches'
    ]
  ],
  [
    'North America',
    ['USA', 'Mexico'],
    [
      'American', 'New American', 'Bagel Shop', 'Burger Joint', 'Cajun',
      'Caribbean', 'Fast Food', 'Fried Chicken Joint', 'Hawaiian', 'Hot Dog',
      'Latin American', 'Cuban', 'Empanada', 'Mac & Cheese', 'Burgers',
      'Mexican', 'Burrito', 'Burritos', 'Taco'
    ]
  ],
  [
    'South America',
    ['Peru'],
    [
      'Brazilian', 'Acai', 'Baiano', 'Churrascaria', 'Empada', 'Goiano',
      'Mineiro', 'Pastelaria', 'Tapiocaria',
      'South American', 'Peruvian', 'Argentinian'
    ]
  ],
  [
    'Far East',
    ['Japan', 'Korea', 'China', 'Vietnam', 'Thailand', 'Indonesia'],
    [
      'Chinese', 'Anui', 'Beijing', 'Cantonese', 'Dim Sum', 'Dongbei', 'Fujian',
      'Guizhou', 'Hainan', 'Hakka', 'Henan', 'Hong Kong', 'Huaiyang', 'Hubei',
      'Hunan', 'Jiangsu', 'Jiangxi', 'Macanese', 'Manchu', 'Peking', 'Shanghai',
      'Shanxi', 'Szechuan', 'Taiwanese', 'Tianjin', 'Xinjiang', 'Yunnan',
      'Zhejiang',
      'Filipino',
      'Hotpot',
      'Japanese', 'Donburi', 'Kaiseki', 'Kushikatsu', 'Monjayaki', 'Nabe',
      'Okonomiyaki', 'Ramen', 'Shabu-Shabu', 'Soba', 'Sukiyaki', 'Sushi',
      'Takoyaki', 'Tempura', 'Tonkatsu', 'Udon', 'Unagi', 'Wagashi',
      'Yakitori', 'Yoshoku',
      'Korean', 'Malaysian', 'Mongolian', 'Noodle House', 'Thai', 'Vietnamese',
      'Indonesian'
    ]
  ],
  [
    'Middle East',
    ['Lebanon', 'Turkey'],
    [
      'Middle Eastern', 'Persian',
      'Turkish', 'Borek', 'Cigkofte', 'Doner', 'Gozleme', 'Kebab', 'Manti', 'Meyhane'
    ]
  ],
  [
    'Africa',
    ['Morocco'],
    ['African', 'Ethiopian', 'Moroccan']
  ],
  [
    'Jewish',
    [],
    ['Kosher']
  ],
  [
    'India', // bit flexible with this
    ['India'],
    [
      'Afghan', 'Himalayan', 'Tibetan',
      'Indian', 'Andhra', 'Awadhi', 'Bengali', 'Chaat', 'Chettinad',
      'Dhaba', 'Dosa', 'Goan', 'Gujarati', 'Hyderabadi', 'Jain',
      'Karnataka', 'Kerala', 'Maharashtrian', 'Mughlai', 'Parsi',
      'Punjabi', 'Rajasthani', 'Udupi',
      'Pakistani',
      'Sri Lankan'
    ]
  ]
]);

