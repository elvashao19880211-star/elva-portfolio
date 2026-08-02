import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

titles = re.findall(r"title:\s*'([^']+)'", content)
print('Innovation data titles:')
for t in titles:
    print(f'  [{t}]')

print()
print('Excel titles:')
import pandas as pd
df = pd.read_excel(r'E:/ElvaSite/elva-portfolio/content/创新纹样库纹样说明.xlsx', engine='openpyxl')
for _, row in df.iterrows():
    name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
    print(f'  [{name}]')
