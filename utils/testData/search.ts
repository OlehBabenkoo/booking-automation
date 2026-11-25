import { daysFromToday, nightsBetween, toDayMonthRangeSource } from '@utils/dates';

export type Occupancy = {
  adults: number;
  children: number;
  rooms: number;
};

type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

const pluralRules = new Intl.PluralRules('en-GB');

const OCCUPANCY_FORMS = {
  adults: { one: 'adult', other: 'adults' },
  children: { one: 'child', other: 'children' },
  rooms: { one: 'room', other: 'rooms' },
} satisfies Record<keyof Occupancy, PluralForms>;

const NIGHT_FORMS = { one: 'night', other: 'nights' } satisfies PluralForms;

const pluralize = (count: number, forms: PluralForms): string =>
  `${count} ${forms[pluralRules.select(count)] ?? forms.other}`;

export const formatOccupancy = ({ adults, children, rooms }: Occupancy): string =>
  [
    pluralize(adults, OCCUPANCY_FORMS.adults),
    pluralize(children, OCCUPANCY_FORMS.children),
    pluralize(rooms, OCCUPANCY_FORMS.rooms),
  ].join(' · ');

export const getLvivSearch = () => ({
  destinationText: 'Lviv',
  destination: {
    name: 'Lviv',
    region: 'Lviv Region, Ukraine',
    fullName: 'Lviv, Lviv Region, Ukraine',
  },
  checkIn: daysFromToday(5),
  checkOut: daysFromToday(7),
  occupancy: { adults: 2, children: 0, rooms: 1 } satisfies Occupancy,
});

export type SearchData = ReturnType<typeof getLvivSearch>;

/** The mobile search summary shows only adults; children and rooms are checked in the URL (see toSearchParams). */
export const toSearchSummaryPattern = ({ destination, checkIn, checkOut, occupancy }: SearchData): RegExp => {
  const stay = `${toDayMonthRangeSource(checkIn, checkOut)} \\(${pluralize(nightsBetween(checkIn, checkOut), NIGHT_FORMS)}\\)`;
  const adults = pluralize(occupancy.adults, OCCUPANCY_FORMS.adults);

  return new RegExp(`^${destination.name}\\s*${stay}\\s*·\\s*${adults}$`);
};

export const toSearchParams = ({ checkIn, checkOut, occupancy }: SearchData): Record<string, string> => ({
  checkin: checkIn.iso,
  checkout: checkOut.iso,
  group_adults: String(occupancy.adults),
  group_children: String(occupancy.children),
  no_rooms: String(occupancy.rooms),
});
