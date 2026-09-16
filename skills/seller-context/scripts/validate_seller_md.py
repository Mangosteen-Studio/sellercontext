#!/usr/bin/env python3
"""Validate the structure and provenance markers of a SELLER.md file."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


REQUIRED_SECTIONS = (
    "Context Scope",
    "Context Owner",
    "Context Provenance",
    "Learning And Privacy Policy",
    "Context Scope And Precedence",
    "Refresh And Change Control",
    "Territory",
    "Company Sales Context",
    "Ideal Customer Profile",
    "Buyer Personas",
    "Selling Standards And Judgment",
    "Differentiation",
    "Proof Points",
    "Messaging Rules",
    "Banned Phrases",
    "Outreach Standards",
    "First Call Standards",
    "Qualification Standards",
    "Objections",
    "Pricing And Commercial Rules",
    "Customer And Account Memory References",
    "AI Output Quality Bar",
)

PROVENANCE_MARKERS = (
    "Profile creation method:",
    "Connected sources reviewed:",
    "Seller confirmed on:",
    "Overall confidence:",
    "Adaptive interview coverage:",
    "Important gaps:",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path, help="Path to the SELLER.md file")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not args.file.is_file():
        print(f"ERROR: file not found: {args.file}")
        return 2

    text = args.file.read_text(encoding="utf-8")
    errors: list[str] = []
    warnings: list[str] = []

    if not text.startswith("# SELLER.md"):
        errors.append("The document must begin with '# SELLER.md'.")

    headings = set(re.findall(r"^## (.+?)\s*$", text, flags=re.MULTILINE))
    for section in REQUIRED_SECTIONS:
        if section not in headings:
            errors.append(f"Missing required section: ## {section}")

    for marker in PROVENANCE_MARKERS:
        if marker not in text:
            errors.append(f"Missing provenance field: {marker}")

    fill_count = text.count("[fill in]")
    blank_fields = re.findall(r"^- [^\n:]+:\s*$", text, flags=re.MULTILINE)
    if fill_count:
        warnings.append(f"{fill_count} unresolved '[fill in]' marker(s) remain.")
    if blank_fields:
        warnings.append(f"{len(blank_fields)} blank field(s) remain.")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
    for warning in warnings:
        print(f"WARNING: {warning}")

    if errors:
        print(f"FAIL: {len(errors)} structural error(s) found.")
        return 1

    print("PASS: SELLER.md has the required structure and provenance fields.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
