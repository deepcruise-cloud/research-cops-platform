const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

function printSectionRange(sectionId) {
  let start = -1;
  let end = -1;
  let openDivs = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(`<section id="${sectionId}"`)) {
      start = i + 1;
    }
    if (start !== -1) {
      // Look for closing </section>
      if (line.includes('</section>')) {
        end = i + 1;
        break;
      }
    }
  }
  console.log(`Section ${sectionId}: line ${start} to ${end}`);
}

printSectionRange('metrics');
printSectionRange('services');
printSectionRange('workflow-hub');
printSectionRange('estimator');
