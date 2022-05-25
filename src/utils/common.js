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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {
  getRandomInteger,
  getRandomArrItems,
  generateRandomDate,
  updateItem,
};
