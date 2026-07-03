const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'app', 'materials', 'data.ts');
let src = fs.readFileSync(DATA_FILE, 'utf-8');

// Same parsing as import script
src = src
  .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\n?/g, '')
  .replace(/export\s+(const|type|interface|default)\s+\w+.*?=\s*/g, 'var ')
  .replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=\s*[;,)}\]])/g, '');

const result = eval('(function(){' + src + '; return { ELEMENT_TREE, materials }; })()');
const tree = result.ELEMENT_TREE;

function findElementId(label) {
  for (const node of tree) {
    for (const child of (node.children || [])) {
      if (child.label === label) return child.id;
      for (const grand of (child.children || [])) {
        if (grand.label === label) return grand.id;
      }
    }
  }
  return null;
}

const testLabels = ['方形花卉纹样', '海东青捕大雁纹', '对鸟团窠纹', '云纹', '鸟纹'];
for (const label of testLabels) {
  console.log(label + ' → ' + (findElementId(label) || 'NOT FOUND'));
}
