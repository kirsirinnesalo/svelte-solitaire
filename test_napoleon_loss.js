// Test Napoleon loss detection
const testState = {
  center: [],
  corners: [[], [], [], []],
  helpers: [null, null, null, null],
  sixPile: [],
  stock: [],
  waste: [{rank: 'K', suit: 'hearts', faceUp: true, id: 'card1'}]
};

console.log('Testing isGameLost with:');
console.log('- stock empty, waste has unplayable K');
console.log('- recycleCount=0, maxRecycles=1');
console.log('- No moves available');

// Simulate: waste has K (can't start center with K, can't start corner with K)
// Expected: game should be LOST

// The logic should be:
// 1. stock.length > 0? NO
// 2. waste.length > 0 && can recycle? waste>0 YES, recycleCount < maxRecycles-1? 0 < 0? NO
// 3. Check if waste card can move... (would need full logic)

console.log('\nWith maxRecycles=1: recycleCount < maxRecycles-1 = 0 < 0 = FALSE');
console.log('So it does NOT return early, continues to check moves');
console.log('If no moves available, should return TRUE (lost)');
