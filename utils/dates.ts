export type TestDate = {
  iso: string;
  display: string;
  // Booking picks the date format by region: "Tue 3 Nov" (en-GB) or "Tue, Nov 3" (en-US, e.g. CI runners)
  displayPattern: RegExp;
};

const displayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const toDisplayPattern = (date: Date): RegExp => {
  const parts = Object.fromEntries(displayFormat.formatToParts(date).map(({ type, value }) => [type, value]));
  const { weekday, day, month } = parts;

  return new RegExp(`^${weekday},? (${day} ${month}|${month} ${day})$`);
};

const toIso = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const daysFromToday = (days: number): TestDate => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return {
    iso: toIso(date),
    display: displayFormat.format(date).replace(',', ''),
    displayPattern: toDisplayPattern(date),
  };
};
