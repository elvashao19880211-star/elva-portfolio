import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all pattern blocks more carefully
# Look for all id fields then extract the containing blocks
titles_with_structure = re.findall(r'"title"\s*:\s*"([^"]+)"[^}]*?"structure"\s*:\s*"([^"]*)"', content, re.DOTALL)
titles_all = re.findall(r'"title"\s*:\s*"([^"]+)"', content)

print(f'Total titles found: {len(titles_all)}')
print(f'Titles with structure field: {len(titles_with_structure)}')

# Find titles WITHOUT structure
titles_with_struct_set = set(t[0] for t in titles_with_structure)
for t in titles_all:
    if t not in titles_with_struct_set:
        print(f'NO STRUCTURE FIELD: {t}')
