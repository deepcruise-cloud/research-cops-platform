const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (line.includes('automation-tab') || line.includes('data-flow')) {
    console.log(`app.js:${i + 1}: ${line.trim()}`);
  }
});
