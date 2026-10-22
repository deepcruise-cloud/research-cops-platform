const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const tags = [
  'id="metrics"',
  'id="services"',
  'id="workflow-hub"',
  'id="estimator"',
  'id="contact"',
  'id="nav-menu"',
  'class="hero-actions"',
  'name="phone"'
];

lines.forEach((line, i) => {
  tags.forEach(tag => {
    if (line.includes(tag)) {
      console.log(`index.html:${i + 1}: ${line.trim()}`);
    }
  });
});
