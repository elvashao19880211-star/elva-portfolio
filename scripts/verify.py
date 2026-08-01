import re
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()
all_t = re.findall(r'"title"\s*:\s*"([^"]+)"', c)
has_s = set(t[0] for t in re.findall(r'"title"\s*:\s*"([^"]+)"[^}]*?"structure"', c, re.DOTALL))
no_s = [t for t in all_t if t not in has_s]
print(f'Total: {len(all_t)}, Has structure: {len(has_s)}, Missing: {len(no_s)}')
if no_s:
    for t in no_s: print(f'  MISSING: {t}')
else:
    print('ALL OK')
