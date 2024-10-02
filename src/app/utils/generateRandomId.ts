// Generate a random 20-digit string
export function generateRandom20DigitString() {
  let randomString = '';

  for (let i = 0; i < 20; i++) {
    randomString += Math.floor(Math.random() * 10);
  }

  return randomString;
}
