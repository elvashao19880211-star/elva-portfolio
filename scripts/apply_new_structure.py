"""
为 revival 和 innovation data.ts 添加 structureL1 / structureL2 字段
"""

import re

def classify(raw):
    if not raw: return ('单独纹样', '自由纹样')
    v = raw.strip()
    if v.startswith('四方连续'):
        rest = v.replace('四方连续','').lstrip('/').lstrip()
        first = rest.split('  ')[0].split('  ')[0].strip()
        if '重叠' in first: return ('四方连续', '重叠式')
        if any(kw in first for kw in ['散点','错位散点','不规则散点','规则散点','单散点']):
            return ('四方连续', '散点式')
        return ('四方连续', '连缀式')
    if v.startswith('二方连续'):
        rest = v.replace('二方连续','').lstrip('/').lstrip()
        first = rest.split('  ')[0].split('  ')[0].strip()
        if '折线' in first: return ('二方连续', '折线式')
        if '直立' in first: return ('二方连续', '直立式')
        if '综合' in first: return ('二方连续', '综合式')
        if '波线' in first: return ('二方连续', '波线式')
        return ('二方连续', '散点式')
    if v.startswith('适合'): return ('单独纹样', '适合纹样')
    if v.startswith('单独'):
        if '角隅' in v and '适合' not in v: return ('单独纹样', '角隅纹样')
        if '适合' in v: return ('单独纹样', '适合纹样')
        if '角隅' in v: return ('单独纹样', '角隅纹样')
        return ('单独纹样', '自由纹样')
    if '角隅' in v: return ('单独纹样', '角隅纹样')
    if '适合' in v: return ('单独纹样', '适合纹样')
    if '自由' in v: return ('单独纹样', '自由纹样')
    return ('单独纹样', '自由纹样')


def add_structure_fields(path, quoted_key, quote_val):
    """quoted_key = True for JSON style ("title"), False for TS style (title)"""
    kq = '"' if quoted_key else ''
    vq = quote_val
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title_pat = re.compile(kq + 'title' + kq + r'\s*:\s*' + vq + r'([^' + vq + r']*)' + vq)
    struct_pat = re.compile(kq + 'structure' + kq + r'\s*:\s*' + vq + r'([^' + vq + r']*)' + vq)
    
    count = 0
    i = 0
    while i < len(content):
        tm = title_pat.search(content, i)
        if not tm: break
        
        title_start = tm.start()
        obj_start = content.rfind('{', 0, title_start)
        if obj_start == -1: break
        
        # Find matching closing }
        depth = 1; in_str = False; str_char = ''
        j = obj_start + 1
        while j < len(content):
            ch = content[j]
            if ch == '\\': j += 2; continue
            if in_str:
                if ch == str_char: in_str = False
                j += 1; continue
            if ch in ('"', "'"): in_str = True; str_char = ch
            elif ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0: break
            j += 1
        
        if depth != 0:
            i += 1
            continue
        
        obj_body = content[obj_start+1:j]
        
        # Skip if already has structureL1
        if 'structureL1' in obj_body:
            i = j + 1
            continue
        
        # Get structure value
        sm = struct_pat.search(obj_body)
        struct_val = sm.group(1) if sm else ''
        l1, l2 = classify(struct_val)
        
        # Find indent level
        lines = obj_body.rstrip().split('\n')
        indent = ''
        for ch in lines[-1]:
            if ch in (' ', '\t'): indent += ch
            else: break
        
        l1_line = f'\n{indent}{kq}structureL1{kq}: {vq}{l1}{vq},'
        l2_line = f'\n{indent}{kq}structureL2{kq}: {vq}{l2}{vq},'
        
        new_body = obj_body + l1_line + l2_line
        content = content[:obj_start+1] + new_body + content[j:]
        
        count += 1
        # Reset search position after the object
        i = obj_start + len(new_body) + 2
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'{path}: {count} patterns updated')


print('=== Revival (JSON style) ===')
add_structure_fields(
    r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts',
    quoted_key=True, quote_val='"'
)

print('=== Innovation (TS style) ===')
add_structure_fields(
    r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts',
    quoted_key=False, quote_val="'"
)

# Verify
from collections import Counter
for path, kq, vq in [
    (r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', '"', '"'),
    (r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts', '', "'"),
]:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    l1_pat = re.compile(kq + 'structureL1' + kq + r'\s*:\s*' + vq + r'([^' + vq + r']*)' + vq)
    l2_pat = re.compile(kq + 'structureL2' + kq + r'\s*:\s*' + vq + r'([^' + vq + r']*)' + vq)
    l1c = Counter(l1_pat.findall(c))
    l2c = Counter(l2_pat.findall(c))
    print(f'\n--- {path.split("/")[-1]} ---')
    for l1 in ['单独纹样','二方连续','四方连续']:
        print(f'  {l1}: {l1c.get(l1,0)}')
    print(f'  L2: {dict(l2c)}')
