/**
 * Bingo Card Tools
 * Lightweight utilities for generating, shuffling, and checking bingo cards.
 * https://github.com/forrestmill-cmd/bingo-card-tools
 *
 * For a full-featured bingo experience with multiplayer and AI card generation,
 * visit https://bingwow.com
 */

// Deterministic PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a hash for string-to-int conversion
function hashToInt(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Fisher-Yates shuffle with optional PRNG
function shuffle(array, rng) {
  const rand = rng || Math.random;
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Calculate grid math
function gridMath(gridSize) {
  const boardSize = gridSize * gridSize;
  const hasFreeSpace = true;
  let freeSpaceIndex;

  if (gridSize % 2 === 1) {
    freeSpaceIndex = Math.floor(boardSize / 2);
  } else {
    freeSpaceIndex = gridSize + Math.floor(gridSize / 2) - 1;
  }

  return {
    boardSize,
    hasFreeSpace,
    freeSpaceIndex,
    cluesPerBoard: boardSize - 1,
  };
}

/**
 * Generate a single bingo card.
 *
 * @param {string[]} items - Pool of items to place on the card
 * @param {Object} [options]
 * @param {number} [options.gridSize=5] - Grid size (3, 4, or 5)
 * @param {number} [options.seed] - Optional seed for deterministic shuffling
 * @param {boolean} [options.freeSpace=true] - Include a free space
 * @param {string} [options.freeSpaceText='FREE'] - Text for the free space
 * @returns {string[][]} 2D array representing the bingo card
 */
function generateCard(items, options = {}) {
  const { gridSize = 5, seed, freeSpace = true, freeSpaceText = 'FREE' } = options;

  if (gridSize < 3 || gridSize > 5) {
    throw new Error('Grid size must be 3, 4, or 5');
  }

  const { boardSize, freeSpaceIndex, cluesPerBoard } = gridMath(gridSize);

  if (items.length < cluesPerBoard) {
    throw new Error(
      `Need at least ${cluesPerBoard} items for a ${gridSize}x${gridSize} grid, got ${items.length}`
    );
  }

  const rng = seed != null ? mulberry32(seed) : undefined;
  const shuffled = shuffle(items, rng).slice(0, cluesPerBoard);

  // Build flat board with free space
  const flat = [];
  let itemIdx = 0;
  for (let i = 0; i < boardSize; i++) {
    if (freeSpace && i === freeSpaceIndex) {
      flat.push(freeSpaceText);
    } else {
      flat.push(shuffled[itemIdx++]);
    }
  }

  // Convert to 2D grid
  const grid = [];
  for (let row = 0; row < gridSize; row++) {
    grid.push(flat.slice(row * gridSize, (row + 1) * gridSize));
  }

  return grid;
}

/**
 * Generate multiple unique bingo cards from the same item pool.
 *
 * @param {string[]} items - Pool of items
 * @param {number} count - Number of cards to generate
 * @param {Object} [options] - Same options as generateCard
 * @returns {string[][][]} Array of 2D card grids
 */
function generateMultipleCards(items, count, options = {}) {
  const baseSeed = options.seed != null ? options.seed : Date.now();
  const cards = [];

  for (let i = 0; i < count; i++) {
    const cardSeed = (baseSeed ^ hashToInt(`player-${i}`)) >>> 0;
    cards.push(generateCard(items, { ...options, seed: cardSeed }));
  }

  return cards;
}

/**
 * Convert a bingo card to print-ready HTML.
 *
 * @param {string[][]} card - Card from generateCard
 * @param {Object} [options]
 * @param {string} [options.title] - Title above the card
 * @param {string} [options.style] - Additional CSS
 * @returns {string} HTML string
 */
function toHTML(card, options = {}) {
  const { title = 'BINGO', style = '' } = options;
  const gridSize = card.length;

  let html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; text-align: center; }
  h1 { font-size: 2em; margin: 0.5em 0; }
  table { border-collapse: collapse; margin: 0 auto; }
  td {
    border: 2px solid #333;
    width: 120px;
    height: 120px;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    padding: 8px;
    word-wrap: break-word;
  }
  td.free-space {
    background: #f0f0f0;
    font-weight: bold;
    font-size: 18px;
  }
  @media print {
    body { margin: 0; }
    h1 { font-size: 1.5em; }
  }
  ${style}
</style>
</head>
<body>
<h1>${title}</h1>
<table>\n`;

  const freeSpaceIndex = gridMath(gridSize).freeSpaceIndex;

  for (let r = 0; r < gridSize; r++) {
    html += '  <tr>\n';
    for (let c = 0; c < gridSize; c++) {
      const pos = r * gridSize + c;
      const isFree = pos === freeSpaceIndex;
      const cls = isFree ? ' class="free-space"' : '';
      html += `    <td${cls}>${card[r][c]}</td>\n`;
    }
    html += '  </tr>\n';
  }

  html += `</table>
<p style="margin-top: 1em; font-size: 12px; color: #999;">Generated with <a href="https://bingwow.com">BingWow</a></p>
</body>
</html>`;

  return html;
}

/**
 * Check if marked positions form a bingo.
 *
 * @param {string[][]} card - The bingo card grid
 * @param {Set<string>|Array<string>} markedPositions - Set of "row,col" strings
 * @returns {{ hasBingo: boolean, winningLine: string[][] | null }}
 */
function checkBingo(card, markedPositions) {
  const marked = markedPositions instanceof Set ? markedPositions : new Set(markedPositions);
  const gridSize = card.length;
  const freePos = gridMath(gridSize).freeSpaceIndex;
  const freeRow = Math.floor(freePos / gridSize);
  const freeCol = freePos % gridSize;
  marked.add(`${freeRow},${freeCol}`);

  // Check rows
  for (let r = 0; r < gridSize; r++) {
    let complete = true;
    for (let c = 0; c < gridSize; c++) {
      if (!marked.has(`${r},${c}`)) { complete = false; break; }
    }
    if (complete) {
      return { hasBingo: true, winningLine: card[r].map((_, c) => [r, c]) };
    }
  }

  // Check columns
  for (let c = 0; c < gridSize; c++) {
    let complete = true;
    for (let r = 0; r < gridSize; r++) {
      if (!marked.has(`${r},${c}`)) { complete = false; break; }
    }
    if (complete) {
      return { hasBingo: true, winningLine: Array.from({ length: gridSize }, (_, r) => [r, c]) };
    }
  }

  // Check diagonals
  let diag1 = true, diag2 = true;
  for (let i = 0; i < gridSize; i++) {
    if (!marked.has(`${i},${i}`)) diag1 = false;
    if (!marked.has(`${i},${gridSize - 1 - i}`)) diag2 = false;
  }
  if (diag1) return { hasBingo: true, winningLine: Array.from({ length: gridSize }, (_, i) => [i, i]) };
  if (diag2) return { hasBingo: true, winningLine: Array.from({ length: gridSize }, (_, i) => [i, gridSize - 1 - i]) };

  return { hasBingo: false, winningLine: null };
}

module.exports = {
  generateCard,
  generateMultipleCards,
  toHTML,
  checkBingo,
  gridMath,
  mulberry32,
  hashToInt,
  shuffle,
};
