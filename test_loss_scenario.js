// Manuaalinen testi: simuloidaan tilanne jossa tableau-kortit on siirretty foundationiin
// ja jäljellä on vain kortteja joita ei voi siirtää

const gameState = {
  tableau: [
    [{rank: '5', suit: 'hearts', faceUp: true}],
    [{rank: '6', suit: 'diamonds', faceUp: true}],
    [{rank: '7', suit: 'hearts', faceUp: true}],
    [],
    [],
    [],
    []
  ],
  foundations: [
    [{rank: 'A', suit: 'spades'}, {rank: '2', suit: 'spades'}, {rank: '3', suit: 'spades'}],
    [{rank: 'A', suit: 'clubs'}],
    [{rank: 'A', suit: 'diamonds'}],
    [{rank: 'A', suit: 'hearts'}]
  ],
  stock: [],
  waste: []
};

function getRankValue(rank) {
  const values = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
  return values[rank];
}

function isRed(suit) {
  return suit === 'hearts' || suit === 'diamonds';
}

function canStackOnTableau(topCard, bottomCard) {
  const topValue = getRankValue(topCard.rank);
  const bottomValue = getRankValue(bottomCard.rank);
  const differentColor = isRed(topCard.suit) !== isRed(bottomCard.suit);
  return topValue === bottomValue + 1 && differentColor;
}

function canMoveToTableau(card, targetPile) {
  if (targetPile.length === 0) {
    return getRankValue(card.rank) === 13;
  }
  const topCard = targetPile[targetPile.length - 1];
  return canStackOnTableau(topCard, card);
}

function canMoveToFoundation(card, targetPile) {
  if (targetPile.length === 0) {
    return card.rank === 'A';
  }
  const topCard = targetPile[targetPile.length - 1];
  const sameSuit = topCard.suit === card.suit;
  const nextInSequence = getRankValue(topCard.rank) + 1 === getRankValue(card.rank);
  return sameSuit && nextInSequence;
}

function isGameLost(state, recycleCount, maxRecycles) {
  // Stock check
  if (state.stock.length > 0) return false;
  
  // Recycle check
  if (maxRecycles === 'unlimited') return false;
  if (recycleCount < maxRecycles - 1) return false;
  
  // Check waste card
  if (state.waste.length > 0) {
    const wasteCard = state.waste[state.waste.length - 1];
    
    // Check foundations
    for (const foundation of state.foundations) {
      if (canMoveToFoundation(wasteCard, foundation)) return false;
    }
    
    // Check tableau
    for (const tableau of state.tableau) {
      if (canMoveToTableau(wasteCard, tableau)) return false;
    }
  }
  
  // Check tableau cards
  for (let i = 0; i < state.tableau.length; i++) {
    const pile = state.tableau[i];
    if (pile.length === 0) continue;
    
    // Find first face-up
    let firstFaceUpIndex = pile.findIndex(card => card.faceUp);
    if (firstFaceUpIndex === -1) continue;
    
    for (let j = firstFaceUpIndex; j < pile.length; j++) {
      const card = pile[j];
      
      // Check foundations (only top card)
      if (j === pile.length - 1) {
        for (const foundation of state.foundations) {
          if (canMoveToFoundation(card, foundation)) {
            console.log(`Card ${card.rank}${card.suit} can move to foundation with top ${foundation[foundation.length-1]?.rank}${foundation[foundation.length-1]?.suit}`);
            return false;
          }
        }
      }
      
      // Check tableau
      for (let k = 0; k < state.tableau.length; k++) {
        if (k === i) continue;
        if (canMoveToTableau(card, state.tableau[k])) {
          console.log(`Card ${card.rank}${card.suit} can move to pile ${k}`);
          return false;
        }
      }
    }
  }
  
  return true;
}

console.log('Testing loss scenario:');
console.log('Tableau piles:', gameState.tableau.map((p, i) => `${i}: ${p.map(c => c.rank+c.suit).join(',')}`));
console.log('Foundations:', gameState.foundations.map((f, i) => `${i}: ${f.map(c => c.rank+c.suit).join(',')}`));
console.log('Stock:', gameState.stock.length);
console.log('Waste:', gameState.waste.length);
console.log('');
console.log('Is game lost?', isGameLost(gameState, 0, 1));
