export const LANGUAGES = {
  englishUS: {
    code: 'en-us',
    heroBannerTitle: 'Find your next stay',
  },
  ukrainian: {
    code: 'uk',
    heroBannerTitle: 'Знайдіть помешкання для наступної подорожі',
  },
  englishGB: {
    code: 'en-gb',
    heroBannerTitle: 'Find your next stay',
  },
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES]['code'];

export const HEADER_TRANSLATIONS = {
  'en-us': {
    headerLabel: 'Language: English (US)',
    listProperty: 'List your property',
    signUp: '',
    signIn: '',
  },
  uk: {
    headerLabel: 'Мова: Українська',
    listProperty: 'Зареєструвати своє помешкання',
    signUp: 'Зареєструватися',
    signIn: 'Увійти',
  },
  'en-gb': {
    headerLabel: 'Language: English (UK)',
    listProperty: 'List your property',
    signUp: '',
    signIn: '',
  },
} satisfies Record<
  Language,
  {
    headerLabel: string;
    listProperty: string;
    signUp: string;
    signIn: string;
  }
>;

export const MENUBAR_TRANSLATION = {
  'en-us': {
    accommodation: 'Stays',
    flights: 'Flights',
    packages: 'Flight + Hotel',
    cars: 'Car rental',
    attractions: 'Attranctions',
    airportTaxis: 'Airport transfers',
  },
  uk: {
    accommodation: 'Помешкання',
    flights: 'Переліт',
    packages: 'Переліт + готель',
    cars: 'Оренда авто',
    attractions: /^(Дозвілля|Чим зайнятися)$/,
    airportTaxis: /^(Трансфери з\/до аеропорту|Таксі з\/до аеропорту|Трансфери)$/,
  },
  'en-gb': {
    accommodation: 'Stays',
    flights: 'Flights',
    packages: 'Flight + Hotel',
    cars: 'Car rental',
    attractions: 'Attranctions',
    airportTaxis: 'Airport transfers',
  },
} satisfies Record<
  Language,
  {
    accommodation: string;
    flights: string;
    packages: string;
    cars: string;
    attractions: string | RegExp;
    airportTaxis: string | RegExp;
  }
>;

export const SEARCHBOX_TRANSLATIONS = {
  'en-us': {
    searchBoxDestinationTitle: /^(Enter destination|Search in your own words)$/,
    searchBoxDestinationPlaceholderText: 'Where are you going?',
    searchBoxDates: 'Select datesCheck-in date — Check-out date',
    searchBoxOccupancyTitle: 'Select occupancy2 adults · 0 children · 1 room',
    searchButtonText: 'Search',
  },
  uk: {
    searchBoxDestinationTitle: 'Введіть напрямок',
    searchBoxDestinationPlaceholderText: 'Куди ви вирушаєте?',
    searchBoxDates: 'Виберіть датиДата заїзду — Дата виїзду',
    searchBoxOccupancyTitle: 'Виберіть місткість2 дорослих · 0 дітей · 1 номер',
    searchButtonText: 'Шукати',
  },
  'en-gb': {
    searchBoxDestinationTitle: /^(Enter destination|Search in your own words)$/,
    searchBoxDestinationPlaceholderText: 'Where are you going?',
    searchBoxDates: 'Select datesCheck-in date — Check-out date',
    searchBoxOccupancyTitle: 'Select occupancy2 adults · 0 children · 1 room',
    searchButtonText: 'Search',
  },
} satisfies Record<
  Language,
  {
    searchBoxDestinationTitle: string | RegExp;
    searchBoxDestinationPlaceholderText: string;
    searchBoxDates: string;
    searchBoxOccupancyTitle: string;
    searchButtonText: string;
  }
>;
