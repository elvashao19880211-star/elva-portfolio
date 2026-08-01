import re

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Pattern: a line ending with " (value with NO comma), then optional blank line, then "structureL1"
# Fix: add comma at end of the last field line

# Strategy: find "\n    "structureL1": and look back for the field line that needs a comma
# The issue is: last_field_line\n\n    "structureL1"
# We need to find the last non-empty, non-structureL1 line before each structureL1 and add comma

lines = c.split('\n')
result = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if this line starts a structureL1 block (indented, starts with "structureL1")
    stripped = line.strip()
    if stripped.startswith('"structureL1"'):
        # Look back at previous lines to find the last field that's missing a comma
        lookback = i - 1
        while lookback >= 0:
            prev = lines[lookback]
            # Skip blank lines
            if prev.strip() == '':
                lookback -= 1
                continue
            # If this line ends with a quote or ] and no comma, add comma
            p_stripped = prev.strip()
            if (p_stripped.endswith('"') or p_stripped.endswith(']')) and not prev.rstrip().endswith(','):
                # Add comma at end
                lines[lookback] = prev.rstrip() + ','
                break
            # If it already has a comma or is something else, stop looking
            break
    
    i += 1

c = '\n'.join(lines)

with open(r'E:/ElvaSite/elva-portfolio/app/patterns/revival/data.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print(f'Fixed commas')

# Verify by checking first pattern
import json
lines2 = c.split('\n')
for j, l in enumerate(lines2):
    if l.strip().startswith('"structureL1"'):
        print(f'Line {j+1}: {l[:60]}')
        # Check previous non-blank line
        p = j - 1
        while p >= 0 and lines2[p].strip() == '':
            p -= 1
        if p >= 0:
            prev_ends = lines2[p].rstrip()[-5:]
            print(f'  Previous line ends with: ...{prev_ends}')
        break
