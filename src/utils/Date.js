import {format, isValid} from 'date-fns';

export const formatDate = dateString => {
  const date = new Date(dateString);

  if (!isValid(date)) {
    return 'Invalid Date';
  }

  // format
  const formattedDate = format(date, 'eeee, d MMMM yyyy HH:mm');

  return formattedDate;
};
