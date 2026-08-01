import re
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()
all_t = re.findall(r'"title"\s*:\s*"([^"]+)"', c)
no_struct = []
no_elem = []
for t in all_t:
    pat = re.escape(t)
    m = re.search(rf'"title"\s*:\s*"{pat}"', c)
    if m:
        obj_start = c.rfind('{', 0, m.start())
        depth = 0; in_s = False
        for j in range(obj_start, len(c)):
            ch = c[j]
            if ch == '"': in_s = not in_s
            if not in_s:
                if ch == '{': depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        block = c[obj_start:j+1]
                        if '"structure"' not in block: no_struct.append(t)
                        if '"elements"' not in block: no_elem.append(t)
                        break

print(f'Total patterns: {len(all_t)}')
print(f'Missing structure: {no_struct if no_struct else "NONE"}')
print(f'Missing elements: {no_elem if no_elem else "NONE"}')
