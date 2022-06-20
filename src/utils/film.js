import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const MINUTES_IN_HOUR = 60;

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / MINUTES_IN_HOUR);
  const minutes = mins % MINUTES_IN_HOUR;
  return hours === 0 ? `${minutes} m` : `${hours}h ${minutes}m`;
};

const humanizeFilmDate = (date) => dayjs(date).format('DD MMMM YYYY');

const humanizeCommentDate = (commentDate) => dayjs(commentDate).fromNow();

const sortFilmsByDate = (filmA, filmB) => filmB.filmInfo.release.date - filmA.filmInfo.release.date;

const sortFilmsByRate = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

const sortFilmsByComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;

export {
  getTimeFromMins,
  humanizeFilmDate,
  humanizeCommentDate,
  sortFilmsByDate,
  sortFilmsByRate,
  sortFilmsByComments,
};
