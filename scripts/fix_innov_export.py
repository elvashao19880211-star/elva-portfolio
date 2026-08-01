import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts','r',encoding='utf-8') as f:
    c = f.read()

# Replace STRUCTURES
old = "export const STRUCTURES = ['自由', '适合', '角隅', '二方连续', '四方连续', '组合', '开光'];"
new = """export const STRUCTURES = ['单独纹样', '二方连续', '四方连续'];
export const STRUCTURE_L2: Record<string, string[]> = {
  '单独纹样': ['自由纹样', '适合纹样', '角隅纹样'],
  '二方连续': ['散点式', '直立式', '波线式', '折线式', '综合式'],
  '四方连续': ['散点式', '连缀式', '重叠式'],
};"""
c = c.replace(old, new)

# Add structureL1/L2 to interface
m = re.search(r'(structure\?\s*:\s*string;\s*//\s*结构)', c)
if m and 'structureL1' not in c[:m.start()+500]:
    c = c.replace(m.group(1),
        m.group(1) + '\n  structureL1?: string;\n  structureL2?: string;')

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/innovation/data.ts','w',encoding='utf-8') as f:
    f.write(c)
print('Done')
