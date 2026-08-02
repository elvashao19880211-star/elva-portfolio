import re
import json
import pandas as pd

# Load Excel data
df_revival = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/复原库纹样说明.xlsx', engine='openpyxl')
df_innovation = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/创新纹样库纹样说明.xlsx', engine='openpyxl')

# Build lookup: name -> {structure, elements}
revival_map = {}
for _, row in df_revival.iterrows():
    name = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
    if not name or name == '纹样名称':
        continue
    structure = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    elements_raw = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ''
    elements = [e.strip() for e in elements_raw.split('/') if e.strip()]
    revival_map[name] = {'structure': structure, 'elements': elements}

innovation_map = {}
for _, row in df_innovation.iterrows():
    name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
    if not name:
        continue
    structure = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
    elements_raw = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    elements = [e.strip() for e in elements_raw.split('/') if e.strip()]
    inspiration = str(row.iloc[3]) if pd.notna(row.iloc[3]) and str(row.iloc[3]) != '/' else ''
    innovation_map[name] = {'structure': structure, 'elements': elements, 'inspiration': inspiration}

def update_data_file(filepath, lookup, is_innovation=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all pattern objects
    # Each pattern starts with { and ends with }, - we need to match them
    pattern_re = re.compile(
        r'(\{\s*\n\s*"id":\s*"[^"]+",\s*\n\s*"title":\s*"([^"]+)"[^}]+\}\s*,?)',
        re.DOTALL
    )
    
    def replace_pattern(match):
        block = match.group(1)
        title = match.group(2)
        
        if title not in lookup:
            return block
        
        data = lookup[title]
        
        # Replace structure field
        old_structure = re.search(r'"structure":\s*"[^"]*"', block)
        if old_structure and data['structure']:
            block = block.replace(old_structure.group(0), f'"structure": "{data["structure"]}"')
        
        # Replace elements array
        old_elements = re.search(r'"elements":\s*\[[^\]]*\]', block)
        if old_elements and data['elements']:
            elements_str = json.dumps(data['elements'], ensure_ascii=False)
            block = block.replace(old_elements.group(0), f'"elements": {elements_str}')
        
        # Replace inspiration field (for innovation)
        if is_innovation and 'inspiration' in data:
            old_inspiration = re.search(r'"inspiration":\s*"[^"]*"', block)
            insp_val = data.get('inspiration', '')
            if old_inspiration:
                block = block.replace(old_inspiration.group(0), f'"inspiration": "{insp_val}"')
        
        return block
    
    new_content = pattern_re.sub(replace_pattern, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    # Count matches
    matches = 0
    for match in pattern_re.finditer(content):
        title = match.group(2)
        if title in lookup:
            matches += 1
    print(f'  Updated {matches} patterns')

# Process revival data
print('更新复原纹样数据...')
update_data_file(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', revival_map)

# Process innovation data
print('更新创新纹样数据...')
update_data_file(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts', innovation_map, is_innovation=True)

print('完成！')
