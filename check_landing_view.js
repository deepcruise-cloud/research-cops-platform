const fs = require('fs');
const content = fs.readFileSync('workflow-hub.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (line.includes('id="landing-view"') || line.includes('id="app-view"') || line.includes('id="login-modal"')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});
