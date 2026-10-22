const fs = require('fs');
const content = fs.readFileSync('workflow-hub.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (line.includes('<div id="') && line.match(/id="[^"]*"/)) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});
