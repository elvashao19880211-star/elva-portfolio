import re
import json
import pandas as pd

# Load Excel
df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/复原库纹样说明.xlsx', engine='openpyxl')
lookup = {}
for _, row in df.iterrows():
    name = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
    if not name or name == '纹样名称':
        continue
    structure = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    elements_raw = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ''
    elements = [e.strip() for e in elements_raw.split('/') if e.strip()]
    lookup[name] = {'structure': structure, 'elements': elements}

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find each pattern block by matching { ... }
# We find all objects: from opening { to closing }, tracking nesting
def parse_patterns(text):
    """Extract individual pattern objects with their positions."""
    objects = []
    i = 0
    in_string = False
    esc = False
    
    while i < len(text):
        c = text[i]
        
        if esc:
            esc = False
            i += 1
            continue
        
        if c == '\\':
            esc = True
            i += 1
            continue
        
        if c == '"' and not in_string:
            in_string = True
            i += 1
            continue
        if c == '"' and in_string:
            in_string = False
            i += 1
            continue
        
        if not in_string and c == '{':
            start = i
            depth = 0
            j = i
            while j < len(text):
                ch = text[j]
                if ch == '\\':
                    j += 2
                    continue
                if ch == '"':
                    in_s = not in_s if 'in_s' in dir() else True
                    j += 1
                    continue
                if not in_s:
                    if ch == '{':
                        depth += 1
                    elif ch == '}':
                        depth -= 1
                        if depth == 0:
                            objects.append((start, j, text[start:j+1]))
                            i = j
                            break
                j += 1
        i += 1
    
    return objects

# Simpler approach: use regex to find "title": "xxxx" and then find surrounding object
updated = 0
for name, data in lookup.items():
    # Find this title in the file
    escaped = re.escape(name)
    pattern = rf'"title"\s*:\s*"{escaped}"'
    m = re.search(pattern, content)
    if not m:
        print(f'  NOT FOUND: {name}')
        continue
    
    pos = m.start()
    
    # Find the start of this object (look backwards for {)
    obj_start = content.rfind('{', 0, pos)
    if obj_start == -1:
        print(f'  NO START: {name}')
        continue
    
    # Find the end of this object
    depth = 0
    in_s = False
    obj_end = -1
    for j in range(obj_start, len(content)):
        ch = content[j]
        if ch == '\\':
            continue
        if ch == '"':
            in_s = not in_s
            continue
        if not in_s:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    obj_end = j
                    break
    
    if obj_end == -1:
        print(f'  NO END: {name}')
        continue
    
    block = content[obj_start:obj_end+1]
    
    # Check if structure field exists
    has_structure = '"structure"' in block
    
    new_block = block
    
    if has_structure:
        # Replace existing structure
        new_block = re.sub(
            r'"structure"\s*:\s*"[^"]*"',
            f'"structure": "{data["structure"]}"',
            new_block
        )
    else:
        # Insert structure after culture/era line
        # Find a good insertion point: after "culture" or after "colors" array or after "elements"
        insert_patterns = [
            (r'"culture"\s*:\s*"[^"]*",\s*\n', 1),   # after culture line
            (r'"colors"\s*:\s*\[[^\]]*\],\s*\n', 1),  # after colors line
            (r'"elements"\s*:\s*\[[^\]]*\],\s*\n', 1), # after elements line
        ]
        
        inserted = False
        for pat, mode in insert_patterns:
            m2 = re.search(pat, new_block, re.DOTALL)
            if m2:
                indent = re.search(r'(\s*)', m2.group(0)).group(1)
                insert_at = m2.end()
                struct_line = f'{indent}"structure": "{data["structure"]}",\n'
                new_block = new_block[:insert_at] + struct_line + new_block[insert_at:]
                inserted = True
                break
        
        if not inserted:
            # Insert after title line
            m2 = re.search(rf'"title"\s*:\s*"{escaped}",\s*\n', new_block)
            if m2:
                indent = re.search(r'(\s*)', m2.group(0)).group(1)
                insert_at = m2.end()
                struct_line = f'{indent}"structure": "{data["structure"]}",\n'
                new_block = new_block[:insert_at] + struct_line + new_block[insert_at:]
                inserted = True
        
        if not inserted:
            print(f'  NO INSERT POINT: {name}')
            continue
    
    # Update elements
    has_elements = '"elements"' in new_block
    if has_elements:
        els_str = json.dumps(data['elements'], ensure_ascii=False)
        new_block = re.sub(
            r'"elements"\s*:\s*\[[^\]]*\]',
            f'"elements": {els_str}',
            new_block
        )
    else:
        # Insert elements after structure
        m2 = re.search(r'"structure"\s*:\s*"[^"]*",\s*\n', new_block)
        if m2:
            indent = re.search(r'(\s*)', m2.group(0)).group(1)
            els_str = json.dumps(data['elements'], ensure_ascii=False)
            insert_at = m2.end()
            els_line = f'{indent}"elements": {els_str},\n'
            new_block = new_block[:insert_at] + els_line + new_block[insert_at:]
    
    if new_block != block:
        content = content[:obj_start] + new_block + content[obj_end+1:]
        updated += 1

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Updated {updated} patterns')

# Verify
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()
all_t = re.findall(r'"title"\s*:\s*"([^"]+)"', c)
for name in all_t:
    if name not in lookup:
        continue
    # Check for exactly one structure field per pattern
    pat = rf'"title"\s*:\s*"{re.escape(name)}"'
    m = re.search(pat, c)
    if m:
        # Find surrounding object
        obj_start = c.rfind('{', 0, m.start())
        depth = 0
        in_s = False
        for j in range(obj_start, len(c)):
            ch = c[j]
            if ch == '"': in_s = not in_s
            if not in_s:
                if ch == '{': depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        block = c[obj_start:j+1]
                        count = len(re.findall(r'"structure"', block))
                        if count != 1:
                            print(f'  WARN: {name} has {count} structure fields')
                        break
print('Done')
