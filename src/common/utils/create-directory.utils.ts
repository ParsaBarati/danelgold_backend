import { join } from 'path';

export const createSubdirectory = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const subdirectory = join(year.toString(), month);
  return subdirectory;
};
