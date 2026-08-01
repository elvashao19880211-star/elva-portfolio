import re, json, pandas as pd

# Read WITHOUT header - first row is data
df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/后补的六个.xlsx', engine='openpyxl', header=None)
print(f'Rows: {len(df)}')

supplement = []
for _, row in df.iterrows():
    dynasty = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
    name = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
    structure = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ''
    elements_raw = str(row.iloc[3]) if pd.notna(row.iloc[3]) else ''
    elements = [e.strip() for e in elements_raw.split('/') if e.strip()]
    supplement.append({'dynasty': dynasty, 'name': name, 'structure': structure, 'elements': elements})
    print(f'Excel: [{dynasty}] [{name}] → {structure} | {elements}')

# Read data.ts
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

all_titles = re.findall(r'"title"\s*:\s*"([^"]+)"', content)

def find_match(excel_name, data_titles):
    for dt in data_titles:
        if excel_name in dt or dt in excel_name:
            return dt
    return None

updated = 0
for item in supplement:
    match = find_match(item['name'], all_titles)
    if not match:
        print(f'  NO MATCH: [{item["name"]}]')
        continue
    
    if match != item['name']:
        print(f'  FUZZY: {item["name"]} → {match}')
    
    escaped = re.escape(match)
    pat = rf'"title"\s*:\s*"{escaped}"'
    m = re.search(pat, content)
    if not m: continue
    
    obj_start = content.rfind('{', 0, m.start())
    depth = 0; in_s = False; obj_end = -1
    for j in range(obj_start, len(content)):
        ch = content[j]
        if ch == '\\': continue
        if ch == '"': in_s = not in_s; continue
        if not in_s:
            if ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    obj_end = j; break
    
    if obj_end == -1: continue
    
    block = content[obj_start:obj_end+1]
    new_block = block
    
    if item['dynasty']:
        old_d = re.search(r'"dynasty"\s*:\s*"([^"]*)"', new_block)
        if old_d:
            new_block = new_block.replace(old_d.group(0), f'"dynasty": "{item["dynasty"]}"')
    
    has_structure = '"structure"' in new_block
    if has_structure:
        new_block = re.sub(r'"structure"\s*:\s*"[^"]*"', f'"structure": "{item["structure"]}"', new_block)
    else:
        for ip in [r'"culture"\s*:\s*"[^"]*",\s*\n', r'"colors"\s*:\s*\[[^\]]*\],\s*\n', r'"elements"\s*:\s*\[[^\]]*\],\s*\n']:
            m2 = re.search(ip, new_block, re.DOTALL)
            if m2:
                indent = re.search(r'(\s*)', m2.group(0)).group(1)
                new_block = new_block[:m2.end()] + f'{indent}"structure": "{item["structure"]}",\n' + new_block[m2.end():]
                break
    
    has_elems = '"elements"' in new_block
    if has_elems:
        els_str = json.dumps(item['elements'], ensure_ascii=False)
        new_block = re.sub(r'"elements"\s*:\s*\[[^\]]*\]', f'"elements": {els_str}', new_block)
    else:
        m2 = re.search(r'"structure"\s*:\s*"[^"]*",\s*\n', new_block)
        if m2:
            indent = m2.group(0)[:len(m2.group(0)) - len(m2.group(0).lstrip())]
            els_str = json.dumps(item['elements'], ensure_ascii=False)
            new_block = new_block[:m2.end()] + f'{indent}"elements": {els_str},\n' + new_block[m2.end():]
    
    if new_block != block:
        content = content[:obj_start] + new_block + content[obj_end+1:]
        updated += 1
        print(f'    OK')

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nUpdated: {updated}/{len(supplement)}')
