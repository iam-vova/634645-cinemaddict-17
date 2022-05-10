import {getRandomInteger, getRandomArrItems, generateRandomDate} from '../utils';
import {commentsCount} from '../constants';

const RUN_TIME_MIN = 50;
const RUN_TIME_MAX = 220;
const FILM_RATE_MIN = 0.1;
const FILM_RATE_MAX = 10;
const FILM_AGE_RATE_MIN = 0;
const FILM_AGE_RATE_MAX = 21;
const FILMS_COUNT = 14;

const posterNames = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg'
];
const filmNames = [
  'The Shawshank Redemption',
  'The Green Mile',
  'Forrest Gump',
  'Schindlers List',
  'Intouchables',
  'Inception',
  'Léon',
  'The Lion King',
  'Fight Club',
  'Иван Васильевич меняет профессию',
  'La vita è bella',
  'Knockin on Heavens Door',
  'The Godfather',
  'Pulp Fiction',
  'Операция «Ы» и другие приключения Шурика'
];
const filmDirectors = [
  'Frank Darabont',
  'Robert Zemeckis',
  'Steven Spielberg',
  'Olivier Nakache',
  'Christopher Nolan',
  'Roger Allers'
];
const filmsGenres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery'
];
const filmWriters = [
  'Philippe Pozzo di Borgo',
  'Éric Toledano',
  'Christopher Nolan',
  'Irene Mecchi',
  'Jonathan Roberts',
  'Linda Woolverton',
  'Burny Mattinson'
];
const actors = [
  'Leonardo DiCaprio',
  'Joseph Gordon-Levitt',
  'Ellen Page',
  'Tom Hardy',
  'Ken Watanabe',
  'Dileep Rao',
  'Cillian Murphy',
  'Tom Berenger',
  'Marion Cotillard',
  'Pete Postlethwaite'
];
const countries = [
  'USA',
  'France',
  'Italy',
  'Germany',
  'Russia',
  'USSR',
  'Poland',
  'Canada',
  'Japan',
  'China'
];
const filmDescritptionGeneral = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const generateFilm = (filmId) => {
  const filmTitle = getRandomArrItems(filmNames);
  const commentsIds = Array.from({length: commentsCount}, (value, index) => index);

  return {
    id: filmId,
    comments: getRandomArrItems(commentsIds, getRandomInteger(0, commentsIds.length - 1)),
    filmInfo: {
      title: filmTitle,
      alternativeTitle: filmTitle,
      totalRating: getRandomInteger(FILM_RATE_MIN * 10, FILM_RATE_MAX * 10)/10,
      poster: `images/posters/${getRandomArrItems(posterNames)}`,
      ageRating: `${getRandomInteger(FILM_AGE_RATE_MIN, FILM_AGE_RATE_MAX)}+`,
      director: getRandomArrItems(filmDirectors),
      writers: getRandomArrItems(filmWriters, getRandomInteger(1, filmWriters.length - 1)),
      actors: getRandomArrItems(actors, getRandomInteger(1, filmWriters.length - 1)),
      release: {
        date: generateRandomDate(),
        releaseCountry:  getRandomArrItems(countries)
      },
      runtime: getRandomInteger(RUN_TIME_MIN, RUN_TIME_MAX),
      genre: getRandomArrItems(filmsGenres, getRandomInteger(1, filmsGenres.length - 1)),
      description: filmDescritptionGeneral.slice(0, getRandomInteger(50, filmDescritptionGeneral.length - 1))
    },
    userDetails: {
      watchlist: Math.random() >= 0.5,
      isWatched: Math.random() >= 0.5,
      watchingDate:  generateRandomDate(),
      isFavorite: Math.random() >= 0.5
    }
  };
};

export const generateFilms = () =>
  Array.from({length: FILMS_COUNT}, (value, index) => generateFilm(index));

