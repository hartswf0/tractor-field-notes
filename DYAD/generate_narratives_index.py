import os
import json
import re

narratives_dir = "/Users/gaia/DYAD/narratives"
output_file = "/Users/gaia/DYAD/narratives.json"

files = os.listdir(narratives_dir)
index = {}

# Regex to capture Match ID (e.g., L2-01, R2-10)
# Assumes format: [ID]-[name].md or [ID]-assessment.md
pattern = re.compile(r"([LR]\d-\d{2})-(.*)\.md")

for f in files:
    match = pattern.match(f)
    if match:
        match_id = match.group(1)
        rest = match.group(2)
        
        if match_id not in index:
            index[match_id] = {"narrative": None, "assessment": None}
            
        if "assessment" in rest:
            index[match_id]["assessment"] = f"narratives/{f}"
        else:
            index[match_id]["narrative"] = f"narratives/{f}"

# Convert to list for easier frontend consumption or keep as dict
# Dict is better for lookup by ID
with open(output_file, "w") as f:
    json.dump(index, f, indent=2)

print(f"Generated {output_file} with {len(index)} entries.")
