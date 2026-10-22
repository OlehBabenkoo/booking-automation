import { daysFromToday } from '@utils/dates';

export type Occupancy = {
  adults: number;
  children: number;
  rooms: number;
};

type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

const pluralRules = new Intl.PluralRules('en-GB');

const pluralize = (count: number, forms: PluralForms): string =>
  `${count} ${forms[pluralRules.select(count)] ?? forms.other}`;

export const formatOccupancy = ({ adults, children, rooms }: Occupancy): string =>
  [
    pluralize(adults, { one: 'adult', other: 'adults' }),
    pluralize(children, { one: 'child', other: 'children' }),
    pluralize(rooms, { one: 'room', other: 'rooms' }),
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
