const { generateCard, generateMultipleCards, toHTML, checkBingo } = require('./bingo');
const fs = require('fs');

// Example: Meeting Bingo
const meetingItems = [
  'Someone says "synergy"', 'Awkward silence', 'Late joiner',
  'Phone rings', 'Coffee visible', 'Wrong screen share',
  'Pet cameo', 'Echo problem', 'Talking while muted',
  'Background noise', 'Frozen screen', '"Can you see my screen?"',
  '"Take this offline"', '"Quick question"', '"You\'re on mute"',
  'Schedule conflict', '"Action items"', '"Circle back"',
  'Double booked', 'Camera off', '"Hot take"',
  '"Sorry, go ahead"', 'Running over time', '"Next steps"',
];

console.log('=== Meeting Bingo (5x5) ===\n');
const card = generateCard(meetingItems, { gridSize: 5, seed: 42 });
card.forEach(row => {
  console.log(row.map(cell => cell.padEnd(22)).join(' | '));
});

console.log('\n=== Baby Shower Bingo (4x4) ===\n');
const babyItems = [
  'Pacifier', 'Onesie', 'Teddy bear', 'Blanket',
  'Bottles', 'Diaper bag', 'Stroller', 'Rattle',
  'Bib', 'Car seat', 'Crib mobile', 'Baby monitor',
  'Booties', 'Swaddle', 'Teether',
];

const babyCard = generateCard(babyItems, { gridSize: 4, seed: 123 });
babyCard.forEach(row => {
  console.log(row.map(cell => cell.padEnd(15)).join(' | '));
});

console.log('\n=== Generate 4 unique cards ===\n');
const cards = generateMultipleCards(meetingItems, 4, { gridSize: 5, seed: 99 });
cards.forEach((c, i) => {
  console.log(`Card ${i + 1} center row: ${c[2].join(', ')}`);
});

// Save one as HTML
const html = toHTML(card, { title: 'Meeting Bingo' });
fs.writeFileSync('meeting-bingo.html', html);
console.log('\nSaved meeting-bingo.html -- open in a browser to print!\n');

console.log('For a full-featured bingo experience with AI card generation');
console.log('and real-time multiplayer, visit https://bingwow.com');
