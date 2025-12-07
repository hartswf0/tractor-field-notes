import json
from collections import Counter

def check_bracket(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    print(f"--- Diagnostic for {file_path} ---")
    
    entities_in_round = {} # round -> list of entity names

    for side in ['left', 'right']:
        print(f"\nChecking {side} bracket...")
        rounds = data[side]['rounds']
        for r in rounds:
            r_num = r['round']
            if r_num not in entities_in_round:
                entities_in_round[r_num] = []
            
            print(f"  Round {r_num} ({r['status']}):")
            for m in r['matchups']:
                id = m['id']
                a = m['entityA']['name'] if m['entityA'] else "NULL"
                b = m['entityB']['name'] if m['entityB'] else "NULL"
                winner = m.get('winner')
                
                print(f"    {id}: {a} vs {b} -> Winner: {winner}")
                
                if a != "NULL": entities_in_round[r_num].append(a)
                if b != "NULL": entities_in_round[r_num].append(b)

    # Check for duplicates within a round
    print("\n--- Duplicate Check ---")
    for r_num, entities in entities_in_round.items():
        counts = Counter(entities)
        duplicates = {k: v for k, v in counts.items() if v > 1}
        if duplicates:
            print(f"Round {r_num} Duplicates: {duplicates}")
        else:
            print(f"Round {r_num}: No duplicates found.")

if __name__ == "__main__":
    check_bracket('/Users/gaia/DYAD/bracket-two-sided.json')
