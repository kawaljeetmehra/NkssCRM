const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user a question
rl.question('What is your name? ', (answer) => {
  // Print the user's response
  console.log(`Hello, ${answer}!`);
  
  // Close the interface
  rl.close();
});
