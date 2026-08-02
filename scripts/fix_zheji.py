import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()

pat = r'"title"\s*:\s*"折枝卧鹿纹"'
m = re.search(pat, c)
if m:
    obj_start = c.rfind('{', 0, m.start())
    depth = 0; in_s = False; obj_end = -1
    for j in range(obj_start, len(c)):
        ch = c[j]
        if ch == '"': in_s = not in_s
        if not in_s:
            if ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    obj_end = j; break
    
    block = c[obj_start:obj_end+1]
    
    if '"structure"' not in block:
        block = block.replace(
            '"elements": ["折枝"],\n',
            '"elements": ["鹿纹", "十字折枝花纹", "石榴纹"],\n    "structure": "单独/适合/均衡",\n'
        )
        c = c[:obj_start] + block + c[obj_end+1:]
        with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'w', encoding='utf-8') as f:
            f.write(c)
        print('Fixed!')
    else:
        print('Already has structure')
