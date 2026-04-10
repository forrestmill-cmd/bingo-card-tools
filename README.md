# Bingo Card Tools

A lightweight JavaScript library for generating, shuffling, and printing custom bingo cards. Works in Node.js and the browser.

## Features

- Generate bingo cards from any list of items
- Support for 3x3, 4x4, and 5x5 grids
- Automatic free space placement
- Deterministic shuffling with seed support (same seed = same card)
- Multiple unique cards from one item pool
- Print-ready HTML output
- Zero dependencies

## Quick Start

```bash
npm install bingo-card-tools
```

```javascript
const { generateCard, generateMultipleCards } = require('./bingo');

// Generate a single 5x5 bingo card
const items = [
  'Called it first', 'Awkward silence', 'Someone late',
  'Phone rings', 'Coffee spill', 'Wrong screen share',
  'Pet cameo', 'Echo echo', 'Muted talking',
  'Background noise', 'Frozen screen', 'Can you see my screen',
  'Lets take this offline', 'Quick question', 'Youre on mute',
  'Schedule conflict', 'Action items', 'Circle back',
  'Double booked', 'Camera off', 'Hot take',
  'Sorry go ahead', 'Running long', 'Next steps',
  'Follow up email'
];

const card = generateCard(items, { gridSize: 5 });
console.log(card);
```

## API

### `generateCard(items, options)`

Generates a single bingo card.

**Parameters:**
- `items` (string[]) - Pool of items to place on the card
- `options.gridSize` (number) - Grid size: 3, 4, or 5 (default: 5)
- `options.seed` (number) - Optional seed for deterministic shuffling
- `options.freeSpace` (boolean) - Include a free space (default: true)
- `options.freeSpaceText` (string) - Text for the free space (default: 'FREE')

**Returns:** A 2D array representing the bingo card grid.

### `generateMultipleCards(items, count, options)`

Generates multiple unique cards from the same item pool. Each card has a different arrangement.

**Parameters:**
- `items` (string[]) - Pool of items
- `count` (number) - Number of cards to generate
- `options` - Same as `generateCard`

### `toHTML(card, options)`

Converts a card to print-ready HTML.

**Parameters:**
- `card` (string[][]) - Card from `generateCard`
- `options.title` (string) - Title above the card
- `options.style` (string) - Additional CSS

### `checkBingo(card, markedPositions)`

Checks if the marked positions form a bingo (row, column, or diagonal).

## Grid Sizes

| Size | Cells | Items Needed | Free Space Position |
|------|-------|-------------|--------------------|
| 3x3  | 9     | 8           | Center (4)         |
| 4x4  | 16    | 15          | Position 5         |
| 5x5  | 25    | 24          | Center (12)        |

## Use Cases

- **Classrooms**: Vocabulary bingo, math bingo, sight words
- **Baby showers**: Gift bingo, prediction bingo
- **Team building**: Meeting bingo, icebreaker bingo
- **Parties**: Movie bingo, music bingo, holiday bingo
- **Fundraisers**: Prize bingo, charity events

## Want a Full-Featured Bingo Experience?

Check out [BingWow](https://bingwow.com) -- a free bingo card generator with:
- AI-powered card creation (type a topic, get a card in seconds)
- Real-time multiplayer (share a link, play on phones)
- 500+ pre-made cards for every occasion
- Print and email cards as PDFs
- No app download or signup required

## License

MIT
