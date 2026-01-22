import json
import re
import hashlib
from pathlib import Path

TRUNC_RE = re.compile(r"\.\.\.\[(\d+) bytes truncated\]")

# Common patterns (user-provided, tightened)
REL_RE = re.compile(r"\[([^\]\n]+)\]\s*(?:→|->)?\s*<([^>\n]+)>")
TREE_RE = re.compile(r"^(\s*)(├──|└──|│\s+)(.*)$", re.M)
CONTENT_REF_RE = re.compile(r":contentReference\[([^\]]+)\]\{([^}]+)\}")

# Stats patterns
STAT_SINGLE_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(%|percent|times|×)\s*(?:hallucination|error|rate)?", re.I)
STAT_RANGE_RE = re.compile(r"(\d+)\s*(?:to|-|–)\s*(\d+)\s*(%|percent)", re.I)
STAT_CI_RE = re.compile(r"(\d+(?:\.\d+)?)\s*±\s*(\d+(?:\.\d+)?)")

# Angle token extraction
ANGLE_TOKEN_RE = re.compile(r"<([^>\n]+)>")

# POML parsing
POML_TAG_RE = re.compile(r"</?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s|>|/>)")
META_COMPONENTS_RE = re.compile(r"<meta\s+components=\"([^\"]+)\"\s*/?>", re.I | re.S)


def sha(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def clean_trunc(s: str, kind: str) -> tuple[str, list[int]]:
    sizes = [int(m.group(1)) for m in TRUNC_RE.finditer(s)]
    if not sizes:
        return s, []

    def repl(m: re.Match) -> str:
        n = m.group(1)
        if kind == "poml":
            return f"<!-- TRUNCATED BY EXPORTER: {n} bytes omitted -->"
        return f"[TRUNCATED BY EXPORTER: {n} bytes omitted]"

    return TRUNC_RE.sub(repl, s), sizes


def classify_angle_tokens(tokens: list[str]) -> dict:
    """Split <...> tokens into likely XML tags vs DSL entities."""
    xml_tags = []
    dsl_entities = []

    for t in tokens:
        raw = t.strip()
        if not raw:
            continue

        # Ignore comment artifacts and closing tags
        if raw.startswith("!") or raw.startswith("/"):
            continue
        if raw.startswith("!--") or raw.endswith("--"):
            continue

        # If it looks like an XML tag name or tag + attrs, classify as tag
        # e.g. let name="x", role, task, meta components="..."
        if re.match(r"^[a-zA-Z][a-zA-Z0-9_-]*(\s+|$)", raw):
            xml_tags.append(raw.split()[0])
            continue

        # Heuristic for DSL entities: capitalization/underscore/parens/quotes are common
        if re.search(r"[_()\"]", raw) or re.match(r"^[A-Z]", raw):
            dsl_entities.append(raw)
            continue

        # Default: treat as DSL entity (conservative)
        dsl_entities.append(raw)

    return {
        "xml_like": sorted(set(xml_tags)),
        "dsl_entities": sorted(set(dsl_entities))
    }


def parse_common(text: str) -> dict:
    angle_tokens = ANGLE_TOKEN_RE.findall(text)
    angle_class = classify_angle_tokens(angle_tokens)

    rels = [(a.strip(), b.strip()) for a, b in REL_RE.findall(text)]
    rels = sorted(set(rels))

    tree_lines = []
    for indent, connector, rest in TREE_RE.findall(text):
        tree_lines.append({"indent": indent, "connector": connector, "content": rest.strip()})

    content_refs = [{"raw": a.strip(), "meta": b.strip()} for a, b in CONTENT_REF_RE.findall(text)]

    stats = {
        "single": [m.group(0).strip() for m in STAT_SINGLE_RE.finditer(text)],
        "ranges": [{"from": m.group(1), "to": m.group(2), "unit": m.group(3)} for m in STAT_RANGE_RE.finditer(text)],
        "ci": [{"value": m.group(1), "plus_minus": m.group(2)} for m in STAT_CI_RE.finditer(text)],
    }

    return {
        "angle": angle_class,
        "relations": [{"relation": r, "target": t} for r, t in rels],
        "tree_lines": tree_lines,
        "content_references": content_refs,
        "stats": stats,
    }


def parse_poml(text: str) -> dict:
    tags = [t.lower() for t in POML_TAG_RE.findall(text)]
    tag_set = sorted(set(tags))

    meta_components_raw = []
    meta_components = []
    for m in META_COMPONENTS_RE.finditer(text):
        raw = m.group(1)
        meta_components_raw.append(raw)
        parts = [p.strip() for p in re.split(r"[\n,]+", raw) if p.strip()]
        meta_components.extend(parts)

    meta_components = sorted(set(meta_components))

    return {
        "poml_tags": tag_set,
        "meta_components_raw": meta_components_raw,
        "meta_components": meta_components,
    }


def stable_id(kind: str, message_index: int, h: str) -> str:
    return f"{kind}-{message_index}-{h[:10]}"


def build(source_path: Path, out_dir: Path) -> None:
    raw = json.loads(source_path.read_text(encoding="utf-8"))

    poml_dir = out_dir / "poml"
    code_dir = out_dir / "code_syntax"
    poml_dir.mkdir(parents=True, exist_ok=True)
    code_dir.mkdir(parents=True, exist_ok=True)

    index = {
        "source": {"metadata": raw.get("metadata", {}), "counts": raw.get("counts", {})},
        "instances": {"poml": [], "code_syntax": []},
    }

    poml_best_hashes = set(b["hash"] for b in raw.get("poml_best", []))

    for b in raw.get("poml_all", []):
        midx = b["message_index"]
        h = b["hash"]
        instance_id = stable_id("poml", midx, h)

        content_clean, trunc_sizes = clean_trunc(b["content"], "poml")
        prompt_clean, prompt_trunc = clean_trunc(b.get("prompt", ""), "code")

        path = poml_dir / f"{instance_id}.poml"
        path.write_text(content_clean, encoding="utf-8")

        parsed = parse_common(content_clean)
        parsed.update(parse_poml(content_clean))

        index["instances"]["poml"].append(
            {
                "id": instance_id,
                "message_index": midx,
                "hash": h,
                "is_best": h in poml_best_hashes,
                "is_truncated": bool(trunc_sizes),
                "truncation_bytes": trunc_sizes,
                "path": str(path.relative_to(out_dir.parent)),
                "prompt": prompt_clean,
                "prompt_truncation_bytes": prompt_trunc,
                "length": b.get("length"),
                "parsed": parsed,
            }
        )

    for b in raw.get("code_syntax_all", []):
        midx = b["message_index"]
        h = b["hash"]
        instance_id = stable_id("code", midx, h)

        content_clean, trunc_sizes = clean_trunc(b["content"], "code")
        prompt_clean, prompt_trunc = clean_trunc(b.get("prompt", ""), "code")

        path = code_dir / f"{instance_id}.txt"
        path.write_text(content_clean, encoding="utf-8")

        parsed = parse_common(content_clean)

        index["instances"]["code_syntax"].append(
            {
                "id": instance_id,
                "message_index": midx,
                "hash": h,
                "is_truncated": bool(trunc_sizes),
                "truncation_bytes": trunc_sizes,
                "path": str(path.relative_to(out_dir.parent)),
                "prompt": prompt_clean,
                "prompt_truncation_bytes": prompt_trunc,
                "length": b.get("length"),
                "parsed": parsed,
            }
        )

    index["instances"]["poml"].sort(key=lambda x: (x["message_index"], x["id"]))
    index["instances"]["code_syntax"].sort(key=lambda x: (x["message_index"], x["id"]))

    (out_dir / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    build(root / "extracted_blocks.json", root / "extracted_instances")
    print("OK: rebuilt extracted_instances")
