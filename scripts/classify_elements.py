import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()

all_elems = set()
for m in re.finditer(r'"elements":\s*\[([^\]]*)\]', c):
    for item in m.group(1).split(','):
        item = item.strip().strip('"').strip("'")
        if item:
            all_elems.add(item)

# Category rules (ordered - first match wins)
RULES = [
    ('动物', ['龙', '凤', '鸟', '鹿', '鱼', '麒麟', '狮', '虎', '马', '兔', '蝴蝶', '鸳鸯',
              '鹤', '蝙蝠', '羊', '猪', '蛙', '蟾', '蝉', '松鼠', '犬', '雁', '雀', '凰',
              '昆虫', '蜂', '蚕', '蛇', '龟', '夔', '螭', '鸢', '鹘', '鸷', '海东青', '秋山',
              '对马', '摩羯']),
    ('植物', ['莲', '花', '菊', '梅', '牡丹', '石榴', '葡萄', '忍冬', '宝相', '蕉叶', '竹',
              '兰', '桃', '桂花', '松', '茶花', '山茶', '艾草', '水草', '草', '树', '柳',
              '卷草', '缠枝', '折枝', '葫芦', '柿蒂', '果品']),
    ('人物', ['飞天', '人', '仕女', '童子', '乐人', '舞人', '佛像', '羽人', '和合二仙',
              '绵羊太子', '仙鹤', '日神']),
    ('几何', ['云', '如意', '回', '方胜', '菱', '龟背', '锁子', '曲水', '勾连', '球路',
              '连钱', '旋涡', '涡', '冰裂', '网格', '波', '窃曲', '环', '十二', '卍', '卐',
              '火', '锦地', '开光', '团窠']),
    ('器物', ['瓶', '炉', '灯', '旗', '伞', '盖', '璎珞', '戟', '磬', '杂宝', '八吉祥',
              '暗八仙', '博古', '宫灯', '华盖', '葫芦灯', '文字', '寿字', '福字', '喜字',
              '鱼鳞', '锦', '天华锦']),
]

def classify(name):
    for cat, keywords in RULES:
        for kw in keywords:
            if kw in name:
                return cat
    return '其他'

# Print all elements grouped
groups = {}
for e in sorted(all_elems):
    cat = classify(e)
    groups.setdefault(cat, []).append(e)

for cat in ['动物', '植物', '人物', '几何', '器物', '其他']:
    if cat in groups:
        print(f'\n=== {cat} ({len(groups[cat])}) ===')
        for e in groups[cat]:
            print(f'  {e}')
