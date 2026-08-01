import re
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()

tm = re.search(r'title\s*:\s*"([^"]+)"', c)
if tm:
    print('First title:', tm.group(1))
    print('Has structureL1:', 'structureL1' in c[:1000])
else:
    print('No title match')
    
# Check indent logic
obj_start = c.rfind('{', 0, tm.start())
depth = 1; in_str = False; str_char = ''
j = obj_start + 1
while j < len(c):
    ch = c[j]
    if ch == '\\': j += 2; continue
    if in_str:
        if ch == str_char: in_str = False
        j += 1; continue
    if ch in ('"'): in_str = True; str_char = ch
    elif ch == '{': depth += 1
    elif ch == '}':
        depth -= 1
        if depth == 0: break
    j += 1

obj_body = c[obj_start+1:j]
print('Object body lines:', obj_body.count('\n'))
print('Last 200 chars of body:', repr(obj_body[-200:]))
