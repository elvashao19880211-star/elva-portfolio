import pandas as pd
import re

df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/复原库纹样说明.xlsx', engine='openpyxl')
names = [str(row.iloc[1]) if pd.notna(row.iloc[1]) else '' for _, row in df.iterrows()]
names = [n for n in names if n and n != '纹样名称']

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()
data_names = re.findall(r'"title"\s*:\s*"([^"]+)"', c)

excel_set = set(names)
data_set = set(data_names)

only_excel = sorted(n for n in names if n not in data_set)
only_data = sorted(n for n in data_names if n not in excel_set)

print('=== Excel有但data.ts没有 ===')
for n in only_excel:
    print(f'  {n}')
print(f'共 {len(only_excel)} 条')

print()
print('=== data.ts有但Excel没有 ===')
for n in only_data:
    print(f'  {n}')
print(f'共 {len(only_data)} 条')
