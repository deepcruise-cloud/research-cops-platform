const fs = require('fs');
const content = fs.readFileSync('styles.css', 'utf8');
const lines = content.split('\n');

const classes = [
  'workflow-hub-section',
  'automation-showcase',
  'automation-tabs',
  'automation-tab',
  'automation-panels',
  'automation-panel',
  'panel-features-grid',
  'pan-feat',
  'pipeline-schematic',
  'comparison-sub-header',
  'comparison-wrapper',
  'comparison-table'
];

lines.forEach((line, i) => {
  classes.forEach(cls => {
    if (line.includes(`.${cls}`) || line.includes(`${cls}`)) {
      console.log(`styles.css:${i + 1}: ${line.trim()}`);
    }
  });
});
