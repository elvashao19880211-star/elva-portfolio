import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()

# Extract all elements arrays
all_elems = set()
for m in re.finditer(r'"elements":\s*\[([^\]]*)\]', c):
    content = m.group(1)
    items = re.findall(r'"([^"]+)"', content)
    all_elems.update(items)

print(f'Total unique elements: {len(all_elems)}')
for e in sorted(all_elems):
    print(e)
