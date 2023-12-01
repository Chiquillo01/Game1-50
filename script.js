document.addEventListener("DOMContentLoaded", function () {
  // Variables
  const gameInfo = document.getElementById("game-info");

  const clickCounter = document.getElementById("click-counter");
  const restartButton = document.getElementById("restart-button");
  const timerCounter = document.getElementById("timer-counter");
  const gridContainer = document.getElementById("grid-container");
  const congratulationMessage = document.getElementById(
    "congratulation-message"
  );
  const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

  //Variables
  let clicks = 0;
  let timerRunning = false;
  let startTime;

  let shuffledNumbers1 = shuffleArray(numbers.slice(0, 25));
  let shuffledNumbers2 = shuffleArray(numbers.slice(25));
  let currentIndex = 0;

  let gameFinished = false;

  // Recargar la página
  restartButton.addEventListener("click", function () {
    location.reload();
  });

  // Crea el grid con el primer array
  initializeGrid(shuffledNumbers1);

  function initializeGrid(numbers) {
    for (let i = 0; i < 5; i++) {
      const row = document.createElement("div");
      row.className = "grid-row";
      gridContainer.appendChild(row);

      for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = numbers[i * 5 + j];
        cell.dataset.value = numbers[i * 5 + j];
        cell.addEventListener("click", handleClick);
        row.appendChild(cell);
      }
    }
  }

  // Baraja el array
  function shuffleArray(array) {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  // Juego
  function handleClick() {
    if (!gameFinished) {
      const clickedNumber = parseInt(this.dataset.value);

      // Cuenta los clics
      clicks++;
      clickCounter.innerHTML = `<b>Clics: ${clicks}</b>`;

      // Inicia el cronómetro al hacer clic en el número 1
      if (clickedNumber === 1 && !timerRunning) {
        startTimer();
      }

      // Marcar el juego como finalizado
      if (currentIndex === 49) {
        showCongratulationMessage();
        gameFinished = true;
      } else if (currentIndex === 24) {
        if (shuffledNumbers2.length > 0) {
          updateGrid(shuffledNumbers2);
        } else {
          resetGame();
        }
      }

      if (clickedNumber === currentIndex + 1) {
        this.classList.add("clicked");
        this.textContent = "X";
        currentIndex++;

        // Actualiza el grid después de hacer clic en el número 24
        if (currentIndex === 25 && shuffledNumbers2.length > 0) {
          updateGrid(shuffledNumbers2);
        }
      }
    }
  }

  // Enseña el final del juego
  function showCongratulationMessage() {
    congratulationMessage.style.display = "block";
  }

  // Reset del juego
  function resetGame() {
    currentIndex = 0;
    clicks = 0;
    clickCounter.textContent = "Clics: 0";
    shuffledNumbers1 = shuffleArray(numbers.slice(0, 25));
    shuffledNumbers2 = shuffleArray(numbers.slice(25));
    congratulationMessage.style.display = "none";
    initializeGrid(shuffledNumbers1);
  }

  function updateGrid(numbers) {
    const rows = document.querySelectorAll(".grid-row");
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll(".cell");
      cells.forEach((cell, colIndex) => {
        cell.dataset.value = numbers[rowIndex * 5 + colIndex];
        cell.textContent = numbers[rowIndex * 5 + colIndex];
        cell.classList.remove("clicked");
      });
    });
  }

  // Temporizador
  function startTimer() {
    timerRunning = true;
    startTime = new Date().getTime();

    setInterval(updateTimer, 1000);
  }

  // Tiempo
  function updateTimer() {
    if (!gameFinished) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      const totalSeconds = Math.floor(elapsedTime / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const milliseconds = elapsedTime % 1000;

      timerCounter.innerHTML = `<b>Tiempo: ${formatTime(minutes)}:${formatTime(
        seconds
      )}.${milliseconds}</b>`;
    }
  }

  function formatTime(value) {
    return value < 10 ? `0${value}` : value;
  }
});
