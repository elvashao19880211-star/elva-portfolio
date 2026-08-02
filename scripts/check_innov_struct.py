import re
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts','r',encoding='utf-8') as f:
    c = f.read()
l1s = re.findall(r"structureL1:\s*'([^']+)'", c)
l2s = re.findall(r"structureL2:\s*'([^']+)'", c)
titles = re.findall(r"title:\s*'([^']+)'", c)
print(f'Patches with L1: {len(l1s)}, L2: {len(l2s)}, titles: {len(titles)}')
for i, t in enumerate(titles):
    print(f'  {t:12s}  L1={l1s[i] if i<len(l1s) else "?"}  L2={l2s[i] if i<len(l2s) else "?"}')
