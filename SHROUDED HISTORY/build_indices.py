#!/usr/bin/env python3
"""
Build entity, relation, and definition indices from trees_catalog.json.
Outputs: entities_index.json, relations_index.json, definitions_index.json
"""

import json
import re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).parent

# Patterns
ENTITY_RE = re.compile(r'<([^>\n]+)>')
RELATION_RE = re.compile(r'\[([^\]\n]+)\]')
DEF_IS_RE = re.compile(r'<([^>\n]+)>\s*\[is(?: a)?\]\s*<([^>\n]+)>')

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def extract_entities(text):
    return ENTITY_RE.findall(text or '')

def extract_relations(text):
    return RELATION_RE.findall(text or '')

def extract_definitions_from_tree(text):
    """Extract definitions from tree structure like <X> [is] <Y>"""
    defs = []
    for m in DEF_IS_RE.finditer(text or ''):
        defs.append({
            'subject': f'<{m.group(1)}>',
            'predicate': 'is',
            'object': f'<{m.group(2)}>',
            'definition': f'is <{m.group(2)}>'
        })
    return defs

def extract_glossary_definitions(text):
    """Extract glossary-style definitions: <Term> followed by description line"""
    defs = []
    lines = (text or '').split('\n')
    for i, line in enumerate(lines):
        stripped = line.strip()
        # Check if line is just an entity like <Term>
        if re.match(r'^<[^>\n]+>$', stripped):
            # Look at next line for definition
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                # Must be a definition-like line (not tree structure, not empty)
                if (next_line and 
                    not re.match(r'^[├└│<\[]', next_line) and
                    len(next_line) > 10 and 
                    len(next_line) < 400):
                    defs.append({
                        'subject': stripped,
                        'predicate': 'defined as',
                        'object': next_line,
                        'definition': next_line
                    })
    return defs

def load_source_content(source_path):
    """Load source code-syntax file content"""
    try:
        full_path = ROOT / source_path
        if full_path.exists():
            return full_path.read_text(encoding='utf-8')
    except Exception:
        pass
    return None

def build_indices():
    trees_path = ROOT / 'trees_catalog.json'
    if not trees_path.exists():
        print(f"trees_catalog.json not found")
        return

    catalog = load_json(trees_path)
    trees = catalog.get('trees', [])

    # Indices
    entities = defaultdict(lambda: {'count': 0, 'trees': [], 'as_root': []})
    relations = defaultdict(lambda: {'count': 0, 'trees': []})
    definitions = []
    seen_defs = set()

    # Track source files we've processed for definitions
    processed_sources = set()

    for tree in trees:
        tree_id = tree.get('id', '')
        content = tree.get('content', '')
        root = tree.get('root', '')
        source = tree.get('source', {})
        source_path = source.get('path', '')

        # Extract entities
        for ent in extract_entities(content):
            key = f'<{ent}>'
            entities[key]['count'] += 1
            if tree_id not in entities[key]['trees']:
                entities[key]['trees'].append(tree_id)
            if root == key and tree_id not in entities[key]['as_root']:
                entities[key]['as_root'].append(tree_id)

        # Extract relations
        for rel in extract_relations(content):
            key = f'[{rel}]'
            relations[key]['count'] += 1
            if tree_id not in relations[key]['trees']:
                relations[key]['trees'].append(tree_id)

        # Extract definitions from tree
        for d in extract_definitions_from_tree(content):
            def_key = (d['subject'], d['definition'])
            if def_key not in seen_defs:
                seen_defs.add(def_key)
                d['source_tree'] = tree_id
                d['source_type'] = 'tree_structure'
                definitions.append(d)

        # Extract definitions from source file (once per source)
        if source_path and source_path not in processed_sources:
            processed_sources.add(source_path)
            src_content = load_source_content(source_path)
            if src_content:
                for d in extract_glossary_definitions(src_content):
                    def_key = (d['subject'], d['definition'])
                    if def_key not in seen_defs:
                        seen_defs.add(def_key)
                        d['source_file'] = source_path
                        d['source_type'] = 'glossary'
                        definitions.append(d)

    # Convert to serializable format
    entities_list = [
        {'entity': k, **v}
        for k, v in sorted(entities.items(), key=lambda x: -x[1]['count'])
    ]
    relations_list = [
        {'relation': k, **v}
        for k, v in sorted(relations.items(), key=lambda x: -x[1]['count'])
    ]

    # Summary stats
    stats = {
        'total_trees': len(trees),
        'unique_entities': len(entities_list),
        'unique_relations': len(relations_list),
        'definitions': len(definitions),
        'sources_processed': len(processed_sources)
    }

    # Save indices
    save_json(ROOT / 'entities_index.json', {
        'stats': stats,
        'entities': entities_list
    })
    save_json(ROOT / 'relations_index.json', {
        'stats': stats,
        'relations': relations_list
    })
    save_json(ROOT / 'definitions_index.json', {
        'stats': stats,
        'definitions': definitions
    })

    print(f"Built indices:")
    print(f"  Entities: {len(entities_list)}")
    print(f"  Relations: {len(relations_list)}")
    print(f"  Definitions: {len(definitions)}")
    print(f"  Sources processed: {len(processed_sources)}")

if __name__ == '__main__':
    build_indices()
