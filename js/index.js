// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    const fruit = fruits[i];
    const li = document.createElement('li');
    li.textContent = `${fruit.kind} - ${fruit.color} - ${fruit.weight}`;
    fruitsList.appendChild(li);
  }
};

display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let currentIndex = fruits.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = fruits[currentIndex];
    fruits[currentIndex] = fruits[randomIndex];
    fruits[randomIndex] = temporaryValue;
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});


/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const weight = parseInt(weightInput.value);

  if (isNaN(weight)) {
    alert('Введите корректное значение веса');
    return;
  }

  fruits = fruits.filter(fruit => fruit.weight >= weight);
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});


/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  if (a.color < b.color) return -1;
  if (a.color > b.color) return 1;
  return 0;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
      swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
        }
      }

      if (!swapped) break;
    }
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const middle = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
      const result = comparation(arr[i], pivot);

      if (result < 0) left.push(arr[i]);
      else if (result > 0) right.push(arr[i]);
      else middle.push(arr[i]);
    }

    return [...sortAPI.quickSort(left, comparation), ...middle, ...sortAPI.quickSort(right, comparation)];
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kind = kindInput.value;
  const color = colorInput.value;
  const weight = parseInt(weightInput.value);

  if (kind === '' || color === '' || isNaN(weight)) {
    alert('Заполните все поля корректно');
    return;
  }

  fruits.push({ kind, color, weight });
  display();
});
