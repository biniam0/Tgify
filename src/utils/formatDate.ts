import { format } from 'date-fns';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};
