// Country data with names and codes
export interface Country {
  code: string; // ISO 3166-1 alpha-2 code
  name: string;
  callingCode: string;
  flag?: string;
}

export const COUNTRIES: Country[] = [
  // Africa
  { code: 'NG', name: 'Nigeria', callingCode: '234' },
  { code: 'GH', name: 'Ghana', callingCode: '233' },
  { code: 'KE', name: 'Kenya', callingCode: '254' },
  { code: 'ZA', name: 'South Africa', callingCode: '27' },
  { code: 'EG', name: 'Egypt', callingCode: '20' },
  { code: 'ET', name: 'Ethiopia', callingCode: '251' },
  { code: 'TZ', name: 'Tanzania', callingCode: '255' },
  { code: 'UG', name: 'Uganda', callingCode: '256' },
  { code: 'DZ', name: 'Algeria', callingCode: '213' },
  { code: 'MA', name: 'Morocco', callingCode: '212' },
  
  // North America
  { code: 'US', name: 'United States', callingCode: '1' },
  { code: 'CA', name: 'Canada', callingCode: '1' },
  { code: 'MX', name: 'Mexico', callingCode: '52' },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', callingCode: '44' },
  { code: 'DE', name: 'Germany', callingCode: '49' },
  { code: 'FR', name: 'France', callingCode: '33' },
  { code: 'IT', name: 'Italy', callingCode: '39' },
  { code: 'ES', name: 'Spain', callingCode: '34' },
  { code: 'NL', name: 'Netherlands', callingCode: '31' },
  { code: 'BE', name: 'Belgium', callingCode: '32' },
  { code: 'SE', name: 'Sweden', callingCode: '46' },
  { code: 'NO', name: 'Norway', callingCode: '47' },
  { code: 'DK', name: 'Denmark', callingCode: '45' },
  { code: 'FI', name: 'Finland', callingCode: '358' },
  { code: 'PL', name: 'Poland', callingCode: '48' },
  { code: 'UA', name: 'Ukraine', callingCode: '380' },
  { code: 'RU', name: 'Russia', callingCode: '7' },
  { code: 'TR', name: 'Turkey', callingCode: '90' },
  
  // Asia
  { code: 'CN', name: 'China', callingCode: '86' },
  { code: 'IN', name: 'India', callingCode: '91' },
  { code: 'JP', name: 'Japan', callingCode: '81' },
  { code: 'KR', name: 'South Korea', callingCode: '82' },
  { code: 'PK', name: 'Pakistan', callingCode: '92' },
  { code: 'BD', name: 'Bangladesh', callingCode: '880' },
  { code: 'ID', name: 'Indonesia', callingCode: '62' },
  { code: 'MY', name: 'Malaysia', callingCode: '60' },
  { code: 'SG', name: 'Singapore', callingCode: '65' },
  { code: 'TH', name: 'Thailand', callingCode: '66' },
  { code: 'VN', name: 'Vietnam', callingCode: '84' },
  { code: 'PH', name: 'Philippines', callingCode: '63' },
  
  // Middle East
  { code: 'AE', name: 'United Arab Emirates', callingCode: '971' },
  { code: 'SA', name: 'Saudi Arabia', callingCode: '966' },
  { code: 'IL', name: 'Israel', callingCode: '972' },
  { code: 'IQ', name: 'Iraq', callingCode: '964' },
  { code: 'IR', name: 'Iran', callingCode: '98' },
  
  // Oceania
  { code: 'AU', name: 'Australia', callingCode: '61' },
  { code: 'NZ', name: 'New Zealand', callingCode: '64' },
  
  // South America
  { code: 'BR', name: 'Brazil', callingCode: '55' },
  { code: 'AR', name: 'Argentina', callingCode: '54' },
  { code: 'CL', name: 'Chile', callingCode: '56' },
  { code: 'CO', name: 'Colombia', callingCode: '57' },
  { code: 'PE', name: 'Peru', callingCode: '51' },
  { code: 'VE', name: 'Venezuela', callingCode: '58' },
];

// Sort countries alphabetically by name
export const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// Create a map for quick lookup of calling codes by country code
export const COUNTRY_CODES: Record<string, string> = COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country.callingCode;
  return acc;
}, {} as Record<string, string>);

// Get country by code
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code.toUpperCase());
}

// Get calling code by country code
export function getCallingCode(countryCode: string): string | null {
  const code = countryCode.toUpperCase();
  return COUNTRY_CODES[code] || null;
}