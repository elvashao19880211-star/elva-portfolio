import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix: "structureL2": "...",}, → "structureL2": "...",\n  },
c = re.sub(r'(  "structureL2": "[^"]+",)(},)', r'\1\n  \2', c)

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print('Fixed closing braces')
