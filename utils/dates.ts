export type TestDate = {
  iso: string;
  display: string;
  // Booking picks the date format by region: "Tue 3 Nov" (en-GB) or "Tue, Nov 3" (en-US, e.g. CI runners)
  displayPattern: RegExp;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const displayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const toParts = (date: Date) =>
  Object.fromEntries(displayFormat.formatToParts(date).map(({ type, value }) => [type, value]));

const toDayMonthSource = (date: Date): string => {
  const { day, month } = toParts(date);

  return `(${day} ${month}|${month} ${day})`;
};

const toPatternSource = (date: Date, withYear = false): string => {
  const year = withYear ? `,? ${date.getFullYear()}` : '';

  return `${toParts(date).weekday},? ${toDayMonthSource(date)}${year}`;
};

const toIso = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const fromIso = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);

  return new Date(year, month - 1, day);
};

export const daysFromToday = (days: number): TestDate => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return {
    iso: toIso(date),
    display: displayFormat.format(date).replace(',', ''),
    displayPattern: new RegExp(`^${toPatternSource(date)}$`),
  };
};

/** Mobile search form shows the dates as one range with years: "Wed 25 Nov 2026 - Thu 26 Nov 2026". */
export const toDateRangePattern = (checkIn: TestDate, checkOut: TestDate): RegExp =>
  new RegExp(
    `^${toPatternSource(fromIso(checkIn.iso), true)} - ${toPatternSource(fromIso(checkOut.iso), true)}$`,
  );

/** Regex source for a date range without weekdays, as in the mobile search summary: "30 Nov - 2 Dec". */
export const toDayMonthRangeSource = (checkIn: TestDate, checkOut: TestDate): string =>
  `${toDayMonthSource(fromIso(checkIn.iso))} - ${toDayMonthSource(fromIso(checkOut.iso))}`;

export const nightsBetween = (checkIn: TestDate, checkOut: TestDate): number =>
  Math.round((fromIso(checkOut.iso).getTime() - fromIso(checkIn.iso).getTime()) / MS_PER_DAY);
