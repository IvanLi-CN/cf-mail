#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "metadata_gate",
    Path(".github/scripts/metadata_gate.py"),
)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)

cases = [
    (["type:patch", "channel:stable"], True, "Labels OK: type:patch + channel:stable"),
    (["channel:stable"], False, "Expected exactly 1 type:* label"),
    (["type:minor", "channel:stable", "channel:rc"], False, "Expected exactly 1 channel:* label"),
    (["type:weird", "channel:stable"], False, "Unknown type label(s): type:weird"),
]

for labels, expected_passed, expected_text in cases:
    passed, description = module.evaluate_labels_from_names(labels)
    assert passed is expected_passed, (labels, passed, expected_passed)
    assert expected_text in description, (labels, description, expected_text)

print("metadata_gate tests passed")
PY
