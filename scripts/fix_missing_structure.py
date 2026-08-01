import re
import pandas as pd

# Load Excel lookup
df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/复原库纹样说明.xlsx', engine='openpyxl')
revival_map = {}
for _, row in df.iterrows():
    name = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
    if not name or name == '纹样名称':
        continue
    structure = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    elements_raw = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ''
    elements = [e.strip() for e in elements_raw.split('/') if e.strip()]
    revival_map[name] = {'structure': structure, 'elements': elements}

# Read data file
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find patterns missing structure field
missing = re.findall(r'"title"\s*:\s*"([^"]+)"', content)
has_struct = set(t[0] for t in re.findall(r'"title"\s*:\s*"([^"]+)"[^}]*?"structure"', content, re.DOTALL))

updated = 0
for name in missing:
    if name in has_struct or name not in revival_map:
        continue
    
    data = revival_map[name]
    
    # Find this pattern block and insert structure field
    # Pattern: find "title": "name" in the file, then the surrounding object
    # We'll insert structure after the culture/era line or before elements
    
    # Find exact position of this title
    title_pattern = rf'"title"\s*:\s*"{re.escape(name)}"'
    title_match = re.search(title_pattern, content)
    if not title_match:
        continue
    
    # Find the end of this object (next })
    pos = title_match.end()
    # Look for a good insertion point: after culture or era or colors array
    obj_end = content.find('}', pos)
    if obj_end == -1:
        continue
    
    segment = content[pos:obj_end]
    
    # Try to insert after culture or era
    insert_after = None
    for field in ['"culture"', 'era', '"colors"']:
        m = re.search(rf'{field}[^,\n]*,\s*\n', segment)
        if m:
            insert_after = pos + m.end()
            break
    
    if not insert_after:
        # Insert right after title line
        insert_after = pos + segment.index('\n') + 1
    
    # Build the structure line
    indent = '    '
    struct_line = f'{indent}"structure": "{data["structure"]}",\n'
    
    content = content[:insert_after] + struct_line + content[insert_after:]
    updated += 1
    print(f'  ADDED structure: {name} → {data["structure"]}')

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nAdded structure to {updated} patterns')
