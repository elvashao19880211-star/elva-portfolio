import re
from collections import Counter

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()

structs = Counter()
elems = Counter()
for m in re.finditer(r'"structure"\s*:\s*"([^"]*)"', c):
    v = m.group(1).strip()
    if v:
        # Split by "/"  
        parts = [p.strip() for p in v.split('/') if p.strip()]
        structs[tuple(parts)] += 1

print('=== 所有结构值 (按频次) ===')
for k, cnt in structs.most_common():
    print(f'  {cnt:3d}  {" / ".join(k)}')

# Also check innovation
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts','r',encoding='utf-8') as f:
    c2 = f.read()
structs2 = Counter()
for m in re.finditer(r"structure:\s*'([^']+)'", c2):
    v = m.group(1).strip()
    if v:
        parts = [p.strip() for p in v.split('/') if p.strip()]
        structs2[tuple(parts)] += 1

print()
print('=== 创新纹样结构值 ===')
for k, cnt in structs2.most_common():
    print(f'  {cnt:3d}  {" / ".join(k)}')
