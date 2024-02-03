let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "cross";
let gameEnded = false;

function init() {
  render();
}

function render() {
  let container = document.getElementById("game");
  let table = "<table>";

  for (let i = 0; i < 3; i++) {
    table += "<tr>";
    for (let j = 0; j < 3; j++) {
      let index = i * 3 + j;
      table += `<td onclick='cellClicked(${index})' id='cell-${index}'>${
        fields[index] ? renderSymbol(fields[index], index) : ""
      }</td>`;
    }
    table += "</tr>";
  }

  table += "</table>";
  container.innerHTML = table;
}

function cellClicked(index) {
  if (!gameEnded && !fields[index]) {
    fields[index] = currentPlayer;
    renderCell(index);

    // Check for a winner
    const winner = checkWinner();
    if (winner) {
      console.log(`Player ${winner} wins!`);
      gameEnded = true;
      // Hier kannst du weitere Aktionen für das Ende des Spiels durchführen
    } else {
      if (fields.every((cell) => cell !== null)) {
        console.log("It's a draw!");
        gameEnded = true;
        // Hier kannst du weitere Aktionen für ein Unentschieden durchführen
      } else {
        currentPlayer = currentPlayer === "cross" ? "circle" : "cross";
      }
    }
  }
}

function renderCell(index) {
  let cell = document.getElementById(`cell-${index}`);
  if (cell) {
    cell.innerHTML = fields[index] ? renderSymbol(fields[index], index) : "";
  }
}

function renderSymbol(symbol, index) {
  if (symbol === "cross") {
    return generateCrossSVG(index);
  } else if (symbol === "circle") {
    return generateCircleSVG(index);
  }

  return "";
}

function generateCircleSVG(index) {
  const html = `
    <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="0" fill="none" stroke="#02aae7" stroke-width="8">
        <animate attributeName="r" from="0" to="31" dur="250ms" fill="freeze" />
      </circle>
    </svg>
  `;

  return html;
}

function generateCrossSVG(index) {
  const html = `
    <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="40" x2="70" y2="40" stroke="#ffd700" stroke-width="8" transform="rotate(45 40 40)">
            <animate attributeName="x1" values="10;25;10" dur="0.25s" keyTimes="0;0.5;1" fill="freeze" />
            <animate attributeName="x2" values="70;55;70" dur="0.25s" keyTimes="0;0.5;1" fill="freeze" />
        </line>
        <line x1="40" y1="10" x2="40" y2="70" stroke="#ffd700" stroke-width="8" transform="rotate(45 40 40)">
            <animate attributeName="y1" values="10;25;10" dur="0.25s" keyTimes="0;0.5;1" fill="freeze" />
            <animate attributeName="y2" values="70;55;70" dur="0.25s" keyTimes="0;0.5;1" fill="freeze" />
        </line>
    </svg>
  `;

  return html;
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Horizontale
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Vertikale
    [0, 4, 8],
    [2, 4, 6], // Diagonale
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      drawWinningLine(pattern);
      return fields[a]; // Gewinner gefunden
    }
  }

  // Kein Gewinner gefunden
  return null;
}

function drawWinningLine(pattern) {
  const lineColor = "#ffffff";
  const lineWidth = 4;

  const [a, b, c] = pattern;
  const cells = [
    document.getElementById(`cell-${a}`),
    document.getElementById(`cell-${b}`),
    document.getElementById(`cell-${c}`),
  ];

  const container = document.getElementById("game");

  const startRect = cells[0].getBoundingClientRect();
  const endRect = cells[2].getBoundingClientRect();

  const contentRect = container.getBoundingClientRect();

  const lineLength = Math.sqrt(Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2));
  const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

  const line = document.createElement("div");
  line.id = "winning-line";
  line.style.position = "absolute";
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
  line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
  line.style.transform = `rotate(${lineAngle}rad)`;
  line.style.transformOrigin = `top left`;

  container.appendChild(line);
}

function restartGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "cross";
  gameEnded = false;

  render();

  // Entfernen der Gewinnlinie, falls vorhanden
  const existingLine = document.querySelector("#winning-line");
  if (existingLine) {
    existingLine.parentNode.removeChild(existingLine);
  }
}
