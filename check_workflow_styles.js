const fs = require('fs');
const content = fs.readFileSync('workflow-hub-styles.css', 'utf8');

console.log('Includes comparison-matrix:', content.includes('comparison-matrix'));
console.log('Includes comparison-table:', content.includes('comparison-table'));
console.log('Includes comparison-wrapper:', content.includes('comparison-wrapper'));
console.log('Includes automation-tabs:', content.includes('automation-tabs'));
console.log('Includes pipeline-schematic:', content.includes('pipeline-schematic'));
console.log('Includes automation-panel:', content.includes('automation-panel'));
