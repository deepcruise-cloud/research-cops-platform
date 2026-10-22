const fs = require('fs');
const content = fs.readFileSync('workflow-hub.html', 'utf8');
const lines = content.split('\n');

const tags = [
  'HRMS, Payroll, Onboarding',
  'Financial Operations',
  'Executive Analytics',
  'Smart Performance Coach',
  'Comparison Matrix',
  'Key Parameter'
];

lines.forEach((line, i) => {
  tags.forEach(tag => {
    if (line.includes(tag)) {
      console.log(`workflow-hub.html:${i + 1}: ${line.trim()}`);
    }
  });
});
