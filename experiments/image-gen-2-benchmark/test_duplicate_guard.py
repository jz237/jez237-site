#!/usr/bin/env python3
from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from PIL import Image

from duplicate_guard import find_duplicates


class DuplicateGuardTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        Image.new("RGB", (32, 32), "navy").save(self.root / "old.jpg")
        entries = [{
            "id": "old-floodgate",
            "title": "Random rendering style: Scratchboard Floodgate Fish Passage",
            "slot": "random-image-style",
            "prompt": "scratchboard fish survey",
            "image": "old.jpg",
            "randomRenderingStyle": {"medium": "hand-cut scratchboard"},
        }, {
            "id": "voxel-apiary",
            "title": "Random rendering style: Voxel Rain-Glass Apiary",
            "slot": "random-image-style",
            "prompt": "voxel art; no scratchboard or claymation",
            "randomRenderingStyle": {"medium": "isometric voxel graphics"},
        }, {
            "id": "ordinary-mosaic-title",
            "title": "Ocean exploration: Mosaic Canyon",
            "slot": "ocean-exploration",
            "prompt": "photorealistic ocean canyon",
        }]
        (self.root / "gallery-data.json").write_text(json.dumps(entries))
        self.approvals = self.root / "style-approvals.json"
        self.approvals.write_text(json.dumps({"version": 1, "approvals": []}))

    def tearDown(self) -> None:
        self.temp.cleanup()

    def check(self, **overrides):
        values = {
            "title": "Copperplate Microbial Fuel Cell Orchard",
            "prompt": "copperplate engraving",
            "slot": "random-image-style",
            "concept_key": "microbial fuel cell orchard",
            "style_family": "copperplate engraving",
            "style_approvals_path": self.approvals,
        }
        values.update(overrides)
        return find_duplicates(self.root, **values)

    def test_exact_concept_is_rejected(self) -> None:
        reasons = {item["reason"] for item in self.check(
            title="Scratchboard Floodgate Fish Passage",
            concept_key="scratchboard floodgate fish passage",
            style_family="copperplate engraving",
        )}
        self.assertIn("concept-key", reasons)

    def test_used_style_is_rejected_for_new_subject(self) -> None:
        matches = self.check(
            title="Scratchboard Lunar Bakery",
            concept_key="lunar bakery night shift",
            style_family="scratchboard",
        )
        self.assertTrue(any(item["reason"] == "rendering-style-family" for item in matches))

    def test_alans_thumbs_up_allows_style_reuse_only(self) -> None:
        self.approvals.write_text(json.dumps({"version": 1, "approvals": [{
            "styleFamilies": ["scratchboard"],
            "discordMessageId": "1547144184266489886",
            "approverId": "485646922141532169",
            "emoji": "👍🏼",
        }]}))
        self.assertEqual([], self.check(
            title="Scratchboard Lunar Bakery",
            concept_key="lunar bakery night shift",
            style_family="scratchboard",
        ))

        concept_reasons = {item["reason"] for item in self.check(
            title="Scratchboard Floodgate Fish Passage",
            concept_key="scratchboard floodgate fish passage",
            style_family="scratchboard",
        )}
        self.assertIn("concept-key", concept_reasons)

    def test_other_users_thumbs_up_does_not_allow_style_reuse(self) -> None:
        self.approvals.write_text(json.dumps({"version": 1, "approvals": [{
            "styleFamilies": ["scratchboard"],
            "discordMessageId": "1547144184266489886",
            "approverId": "470002248894906368",
            "emoji": "👍🏼",
        }]}))
        matches = self.check(
            title="Scratchboard Lunar Bakery",
            concept_key="lunar bakery night shift",
            style_family="scratchboard",
        )
        self.assertTrue(any(item["reason"] == "rendering-style-family" for item in matches))

    def test_alans_non_thumbs_up_does_not_allow_style_reuse(self) -> None:
        self.approvals.write_text(json.dumps({"version": 1, "approvals": [{
            "styleFamilies": ["scratchboard"],
            "discordMessageId": "1547144184266489886",
            "approverId": "485646922141532169",
            "emoji": "👎🏼",
        }]}))
        matches = self.check(
            title="Scratchboard Lunar Bakery",
            concept_key="lunar bakery night shift",
            style_family="scratchboard",
        )
        self.assertTrue(any(item["reason"] == "rendering-style-family" for item in matches))

    def test_renamed_concept_with_synonyms_is_rejected(self) -> None:
        matches = self.check(
            title="Nocturnal Salmon Census at Spillway",
            prompt="engraved river monitoring scene",
            slot="ocean-exploration",
            concept_key="salmon census spillway",
            style_family="",
        )
        self.assertTrue(any(item["reason"] == "concept-contained" and item.get("id") == "old-floodgate" for item in matches))

    def test_negative_prompt_style_is_not_mistaken_for_positive_style(self) -> None:
        matches = self.check(
            title="Scratchboard Lunar Bakery",
            concept_key="lunar bakery night shift",
            style_family="scratchboard",
        )
        style_ids = {item.get("id") for item in matches if item["reason"] == "rendering-style-family"}
        self.assertIn("old-floodgate", style_ids)
        self.assertNotIn("voxel-apiary", style_ids)

    def test_fresh_concept_and_style_pass(self) -> None:
        self.assertEqual([], self.check())

    def test_non_random_title_does_not_reserve_a_style(self) -> None:
        self.assertEqual([], self.check(
            title="Random rendering style: Mosaic Magnetometer Lab",
            concept_key="magnetometer lab calibration",
            style_family="mosaic",
        ))

    def test_same_pixels_are_rejected(self) -> None:
        matches = self.check(
            slot="ocean-exploration",
            style_family="",
            image=self.root / "old.jpg",
        )
        self.assertTrue(any(item["reason"] == "visual-image-fingerprint" for item in matches))


if __name__ == "__main__":
    unittest.main()
