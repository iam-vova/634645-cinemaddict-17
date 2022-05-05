import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrItems = (items, count = 1) => {
  const shuffled = [...items].slice().sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
};

const generateRandomDate = (date) => {
  const minDate = date ? date : new Date(1895, 3, 22).getTime();

  const maxDate = new Date().getTime();
  return new Date(minDate + Math.random() * (maxDate - minDate));
};

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return hours === 0 ? `${minutes} m` : `${hours}h ${minutes}m`;
};

const humanizeFilmDate = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeCommentDate = (commentDate) => dayjs(commentDate).format('YYYY/MM/DD HH:mm');

export {
  getRandomInteger,
  getRandomArrItems,
  generateRandomDate,
  getTimeFromMins,
  humanizeFilmDate,
  humanizeCommentDate
};
