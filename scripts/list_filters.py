import re, json
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()

# Extract structures  
structs = set()
elems = set()
for m in re.finditer(r'"structure"\s*:\s*"([^"]*)"', c):
    val = m.group(1).strip()
    if val:
        structs.add(val)

for m in re.finditer(r'"elements"\s*:\s*\[([^\]]*)\]', c):
    arr = m.group(1)
    for e in re.findall(r'"([^"]+)"', arr):
        elems.add(e)

print('Structures:', len(structs))
for s in sorted(structs): print(f'  {s}')
print()
print('Elements:', len(elems))
for e in sorted(elems)[:30]: print(f'  {e}')
print(f'  ... ({len(elems)} total)')
