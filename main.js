(function () {
  //создаем контейнер управления
  function createControl() {
    const form = document.createElement('div');
    const input = document.createElement('input');
    const timer = document.createElement('div');
    const btnStart = document.createElement('button');
    const btnAgain = document.createElement('button');

    form.classList.add('control');
    timer.classList.add('timer');
    timer.textContent = '60';
    input.classList.add('input');
    input.placeholder = 'Количество карточек 2, 4, ... 10';
    btnStart.classList.add('btn', 'start');
    btnStart.textContent = 'Старт';
    btnAgain.classList.add('btn', 'again');
    btnAgain.textContent = 'Снова';

    form.append(input);
    form.append(timer);
    form.append(btnStart);
    form.append(btnAgain);

    return {
      form,
      timer,
      input,
      btnStart,
      btnAgain
    }
  }

  //создаем массив
  function createArray(lot) {
    const array = [];
    for (let item = 0; item < (lot * lot) / 2; item++) {
      array.push(item + 1, item + 1);
    }
    return array;
  }

  //перемешиваем массив
  function shuffle(arr) {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  //заполняем игровое поле
  function throwStones(array, lot) {
    const gameField = document.createElement('div');
    gameField.classList.add('game-field');
    for (let item = 0; item < array.length; item++) {
      const stone = document.createElement('div');
      stone.classList.add('stone', 'number', `stone${array.length}`);
      stone.setAttribute('id', item);
      stone.setAttribute('data', array[item]);
      stone.textContent = array[item];
      gameField.append(stone);
    }
    return gameField;
  }

  //игра
  function game(scene, timerId) {
    const controlArray = {};
    let stone1Id;
    let stone2Id;
    for (let item = 0; item < scene.length; item++) {
      scene[item].addEventListener('click', function () {
        this.classList.add('active');
        let stoneId = +this.getAttribute('id');
        let stoneData = +this.getAttribute('data');
        controlArray[stoneId] = stoneData;
        let controlArrayKey = Object.keys(controlArray);
        if (stone1Id === undefined) {
          stone1Id = stoneId;
          // console.log(`Сработало условие присвоения значения первому камню. stone1Id = ${stone1Id}. stone2Id = ${stone2Id}`); //!
        } else if (stone1Id !== undefined && stone1Id !== stoneId && stone2Id === undefined) {
          stone2Id = stoneId;
          if (controlArrayKey.length === scene.length) {
            this.classList.add('active');
            alert(`ИГРА ОКОНЧЕНА!!!`);
            clearInterval(timerId);
            stone1Id = undefined;
            stone2Id = undefined;
            document.querySelector('.game-field').remove();
            document.querySelector('.start').removeAttribute('disabled');
          }
          // console.log(`Сработало условие присвоения значения второму камню. stone1Id = ${stone1Id}. stone2Id = ${stone2Id}`); //!
        } else if (stone1Id !== undefined && stone2Id !== undefined) {
          // console.log(`Работает условие, когда значения обоих камней заполнены`); //!
          if (controlArray[stone1Id] !== controlArray[stone2Id]) {
            document.getElementById(`${stone1Id}`).classList.remove('active');
            document.getElementById(`${stone2Id}`).classList.remove('active');
            delete controlArray[stone1Id];
            delete controlArray[stone2Id];
            // console.log(`Сработало условие неравных камней. stone1Id = ${stone1Id}. stone2Id = ${stone2Id}`); //!
          }
          stone1Id = stoneId;
          stone2Id = undefined;
        }
      });

    }
  }

  // помещение элементов в ДОМ
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('stones');
    const controlFunс = createControl();

    container.append(controlFunс.form);
    let timerId;


    controlFunс.btnStart.addEventListener('click', startGame);
    function startGame() {
      let time = 60;
      clearInterval(timerId);
      timerId = setInterval(timerGame, 1000);
      function timerGame() {
        if (time === 0) {
          clearInterval(timerId);
          againGame()
        }
        else {
          time--;
          document.querySelector('.timer').textContent = time;
        }
      }
      let length = 0;
      if (controlFunс.input.value > 0 && controlFunс.input.value < 11 && controlFunс.input.value % 2 === 0) {
        length = +controlFunс.input.value;
      }
      else {
        length = 4;
      }
      const createArrayFunc = createArray(length);
      const shuffleArray = shuffle(createArrayFunc);
      const throwStonesFunc = throwStones(shuffleArray);
      container.append(throwStonesFunc);
      controlFunс.input.value = '';
      controlFunс.btnStart.setAttribute('disabled', true);
      const gameItem = document.querySelectorAll('.stone');
      const gameFunc = game(gameItem, timerId);

      controlFunс.btnAgain.addEventListener('click', againGame);
      function againGame() {
        clearInterval(timerId);
        controlFunс.btnStart.removeAttribute('disabled');
        if (document.querySelector('.game-field') !== null) {
          document.querySelector('.game-field').remove();
        }
      }

    };

  });
})();
