export type TestDate = {
  iso: string;
  display: string;
};

const displayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

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
  };
};
