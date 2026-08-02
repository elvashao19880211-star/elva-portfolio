import re
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts','r',encoding='utf-8') as f:
    c = f.read()

# Fix: 'structureL1' -> structureL1 (same indent as other fields)
c = re.sub(r"\n'structureL1':", "\n    structureL1:", c)
c = re.sub(r"\n'structureL2':", "\n    structureL2:", c)

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts','w',encoding='utf-8') as f:
    f.write(c)

# Verify
l1s = re.findall(r"structureL1:", c)
l2s = re.findall(r"structureL2:", c)
print(f'L1: {len(l1s)}, L2: {len(l2s)}')

titles = re.findall(r"title:\s*'([^']+)'", c)
l1v = re.findall(r"structureL1:\s*'([^']+)'", c)
l2v = re.findall(r"structureL2:\s*'([^']+)'", c)
for i, t in enumerate(titles):
    print(f'  {t:15s} L1={l1v[i] if i<len(l1v) else "?"}  L2={l2v[i] if i<len(l2v) else "?"}')
