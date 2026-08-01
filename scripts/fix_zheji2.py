import re
with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','r',encoding='utf-8') as f:
    c = f.read()
old = r'"折枝卧鹿纹"'
m = re.search(old, c)
if m:
    start = m.start()
    end = start + 500
    chunk = c[start:end]
    # Find "structure": "独立折枝"
    sr = re.search(r'"structure"\s*:\s*"独立折枝"', chunk)
    if sr:
        c = c[:start+sr.start()] + '"structure": "单独/适合/均衡"' + c[start+sr.end():]
        with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts','w',encoding='utf-8') as f:
            f.write(c)
        print('Fixed!')
    else:
        print('Not found:', chunk[:200])
