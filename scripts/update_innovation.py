import re
import json
import pandas as pd

df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/创新纹样库纹样说明.xlsx', engine='openpyxl')

# Build list from Excel
excel_data = []
for _, row in df.iterrows():
    name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
    if not name:
        continue
    structure = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
    elements_raw = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    elements = [e.strip() for e in elements_raw.split('/') if e.strip()]
    inspiration = str(row.iloc[3]) if pd.notna(row.iloc[3]) and str(row.iloc[3]) != '/' else ''
    excel_data.append({
        'name': name,
        'structure': structure,
        'elements': elements,
        'inspiration': inspiration,
    })

# Read data.ts
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find each pattern block: { ... }
# Patterns in this file have keys without quotes: title: 'xxx'
# We need to find the title, match with Excel, and update fields

# Simple approach: split by pattern boundaries
# Match each object block
def find_pattern_blocks(text):
    """Find all top-level pattern objects in the array."""
    blocks = []
    # Find start of array
    array_start = text.find('const innovationPatterns')
    if array_start == -1:
        array_start = text.find('const revivalPatterns')
    bracket_start = text.find('[', array_start)
    
    # Now find each object recursively
    i = bracket_start + 1
    depth = 0
    block_start = None
    in_string = False
    string_char = None
    
    while i < len(text):
        c = text[i]
        prev = text[i-1] if i > 0 else ''
        
        # Track string state
        if c in ("'", '"') and prev != '\\':
            if not in_string:
                in_string = True
                string_char = c
            elif c == string_char:
                in_string = False
                string_char = None
        
        if not in_string:
            if c == '{':
                if depth == 0:
                    block_start = i
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0 and block_start is not None:
                    blocks.append(text[block_start:i+1])
                    block_start = None
        
        i += 1
    
    return blocks

blocks = find_pattern_blocks(content)

print(f'Found {len(blocks)} pattern blocks')
updated = 0

def get_title(block):
    m = re.search(r"title:\s*'([^']+)'", block)
    if m:
        return m.group(1)
    return None

def fuzzy_match(title, excel_data):
    """Match Excel name to data title using substring."""
    # First try exact match
    for d in excel_data:
        if d['name'] == title:
            return d
    
    # Then try substring match (longer contains shorter)
    for d in excel_data:
        if title in d['name'] or d['name'] in title:
            return d
    
    return None

for block in blocks:
    title = get_title(block)
    if not title:
        continue
    
    match = fuzzy_match(title, excel_data)
    if not match:
        print(f'  NO MATCH: [{title}]')
        continue
    
    new_block = block
    
    # Replace structure
    if match['structure']:
        old = re.search(r"structure:\s*'[^']*'", new_block)
        if old:
            new_block = new_block.replace(old.group(0), f"structure: '{match['structure']}'")
    
    # Replace elements
    if match['elements']:
        old_e = re.search(r"elements:\s*\[[^\]]*\]", new_block)
        if old_e:
            els = match['elements']
            # Format as single-quoted items
            els_str = ', '.join(f"'{e}'" for e in els)
            new_block = new_block.replace(old_e.group(0), f'elements: [{els_str}]')
    
    # Replace inspiration (only if Excel has a non-empty value)
    if match['inspiration']:
        old_i = re.search(r"inspiration:\s*'[^']*'", new_block)
        if old_i:
            new_block = new_block.replace(old_i.group(0), f"inspiration: '{match['inspiration']}'")
    
    if new_block != block:
        content = content.replace(block, new_block)
        updated += 1
        print(f'  UPDATED: {title} ← {match["name"]}')

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Updated {updated}/{len(blocks)} innovation patterns')
