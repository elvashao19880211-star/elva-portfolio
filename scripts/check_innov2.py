import pandas as pd
import re

# Check innovation
df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/创新纹样库纹样说明.xlsx', engine='openpyxl')
excel_names = [str(row.iloc[0]) if pd.notna(row.iloc[0]) else '' for _, row in df.iterrows()]

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()
data_names = re.findall(r"title:\s*'([^']+)'", c)

# Check structure coverage
all_titles = re.findall(r"title:\s*'([^']+)'", c)
has_struct = set()
for m in re.finditer(r"title:\s*'([^']+)'[^}]*?structure:", c, re.DOTALL):
    has_struct.add(m.group(1))
missing = [t for t in all_titles if t not in has_struct]

print('Innovation total:', len(all_titles))
print('Has structure:', len(has_struct))
print('Missing structure:', missing if missing else 'NONE')

# Check elements
has_elem = set()
for m in re.finditer(r"title:\s*'([^']+)'[^}]*?elements:", c, re.DOTALL):
    has_elem.add(m.group(1))
missing_elem = [t for t in all_titles if t not in has_elem]
print('Missing elements:', missing_elem if missing_elem else 'NONE')

# Name comparison
print()
excel_set = set(excel_names)
data_set = set(all_titles)
print('In Excel not in data:', [n for n in excel_names if n not in data_set])
print('In data not in Excel:', [n for n in all_titles if n not in excel_set])
