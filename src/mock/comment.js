import {generateRandomDate, getRandomInteger, getRandomArrItems} from '../utils';

const commentGeneral = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
const emojiNames = [
  'angry',
  'puke',
  'sleeping',
  'smile'
];
const userNames = [
  'Tim Macoveev',
  'John Doe',
  'John Poole',
  'William Cook',
  'George Baker',
  'Arleen Paul',
  'Scarlett Summers'
];

export const generateComment = (commentId) => ({
  id: commentId,
  author: getRandomArrItems(userNames),
  comment: commentGeneral.slice(0, getRandomInteger(0, commentGeneral.length - 1)),
  date: generateRandomDate(),
  emotion: getRandomArrItems(emojiNames)
});
