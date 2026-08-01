import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()

# Full categorization - hand-tuned from auto-classify output
EL_CAT = {
    # 动物 (37)
    '仙鹤寿桃纹':'动物','仙鹤纹':'动物','凤纹':'动物','双龙戏珠纹':'动物',
    '变型鸟纹':'动物','变形鸟纹':'动物','团窠对鹿纹':'动物','夔凤问':'动物',
    '夔龙纹':'动物','大雁纹':'动物','太极鱼纹':'动物','对鸟团窠':'动物',
    '摩羯纹':'动物','朱雀纹':'动物','松鼠纹':'动物','海东青纹':'动物',
    '狮子纹':'动物','秋山纹':'动物','绵羊太子纹':'动物','联珠对马纹':'动物',
    '虎纹':'动物','蛙纹':'动物','蝉纹':'动物','蝙蝠纹':'动物','蝴蝶纹':'动物',
    '蟠螭':'动物','蟠龙纹':'动物','蟾蜍纹':'动物','金鱼纹':'动物',
    '鱼纹':'动物','鱼鳞纹':'动物','鸟纹':'动物','鸳鸯纹':'动物',
    '鹿纹':'动物','麒麟纹':'动物','龙纹':'动物','花蝶纹':'动物',
    # 植物 (38)
    '十字折枝花纹':'植物','卷草纹':'植物','四季花纹':'植物','团花纹':'植物',
    '宝相花':'植物','小团花':'植物','小团花纹':'植物','小花纹':'植物',
    '山茶花纹':'植物','忍冬':'植物','忍冬纹':'植物','折枝花纹':'植物',
    '方形宝相花纹':'植物','方形小宝相纹':'植物','果品纹':'植物',
    '柿蒂纹':'植物','梅花纹':'植物','水草纹':'植物','海石榴纹':'植物',
    '牡丹纹':'植物','石榴':'植物','石榴纹':'植物','缠枝纹':'植物',
    '缠枝花纹':'植物','缠枝莲纹':'植物','联珠小团花':'植物','艾草纹':'植物',
    '花卉纹':'植物','花纹':'植物','茶花纹':'植物','莲纹':'植物',
    '莲花':'植物','莲花纹':'植物','菊花纹':'植物','葡萄纹':'植物',
    '葫芦纹':'植物','蕉叶纹':'植物','西番莲纹':'植物',
    # 人物 (4)
    '和合二仙纹':'人物','日神纹':'人物','羽人纹':'人物','飞天':'人物',
    # 几何 (23)
    '云纹':'几何','云雷纹':'几何','冰裂纹':'几何','十二章纹':'几何',
    '卐字纹':'几何','四合云纹':'几何','四合如意纹':'几何','回型纹':'几何',
    '如意纹':'几何','开光纹':'几何','旋涡纹':'几何','曲水纹':'几何',
    '杯纹菱':'几何','波曲纹':'几何','涡纹':'几何','火焰纹':'几何',
    '球路纹':'几何','窃曲纹':'几何','连钱纹':'几何','锁子纹':'几何',
    '锦地纹':'几何','联珠纹':'几何','龟背纹':'几何',
    # 器物 (10)
    '八吉祥纹':'器物','华盖':'器物','博古纹':'器物','天华锦骨架':'器物',
    '宫灯纹':'器物','寿字纹':'器物','文字纹':'器物','暗八仙纹':'器物',
    '杂宝纹':'器物','磬纹':'器物','葫芦灯纹':'器物',
    # 其他 (12)
    '三多纹':'其他','五毒纹':'其他','传统纹样':'其他','兽面纹':'其他',
    '变型水纹':'其他','地纹':'其他','山水纹':'其他','怪兽纹':'其他',
    '海水江崖纹':'其他','海水纹':'其他','玄武纹':'其他','玄武纹':'其他',
}
EL_CAT_ORDER = ['动物','植物','人物','几何','器物','其他']

# Build data structure: {cat: [elements sorted by frequency]}
from collections import Counter
freq = Counter()
for m in re.finditer(r'"elements":\s*\[([^\]]*)\]', c):
    for item in m.group(1).split(','):
        item = item.strip().strip('"').strip("'")
        if item:
            freq[item] += 1

cat2elems = {cat: [] for cat in EL_CAT_ORDER}
for e, f in freq.most_common():
    cat = EL_CAT.get(e, '其他')
    cat2elems[cat].append([e, f])

# Generate TS code
ts_lines = [
    '// 自动生成: 元素分类体系',
    'export const ELEMENT_CATEGORIES = [',
]
for cat in EL_CAT_ORDER:
    items = cat2elems[cat]
    elems = ', '.join(f"'{e[0]}'" for e in items)
    ts_lines.append(f"  {{ cat: '{cat}', elements: [{elems}] }},")
ts_lines.append('];')

# Append to file (or we can put it in a separate module)
new_block = '\n' + '\n'.join(ts_lines) + '\n'

# Check if already exists
if 'ELEMENT_CATEGORIES' not in c:
    # Insert before the last line
    lines = c.split('\n')
    # Find export default line
    for i, line in enumerate(lines):
        if line.strip().startswith('export default'):
            lines.insert(i, new_block)
            break
    with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','w',encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f'Added ELEMENT_CATEGORIES: {sum(len(v) for v in cat2elems.values())} elements in {len(EL_CAT_ORDER)} categories')
else:
    print('ELEMENT_CATEGORIES already exists')
