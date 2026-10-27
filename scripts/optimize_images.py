from __future__ import annotations

import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "assets" / "images-redrawn"
MAX_EDGE = 1800
QUALITY = 88


def convert(image_path: Path) -> tuple[int, int]:
    output_path = image_path.with_suffix(".webp")
    with Image.open(image_path) as source:
        image = source.convert("RGBA")
        if image.getchannel("A").getextrema()[0] < 255:
            background = Image.new("RGB", image.size, "#ffffff")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        else:
            image = image.convert("RGB")
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(
            output_path,
            "WEBP",
            quality=QUALITY,
            method=5,
            optimize=True,
        )
    return image_path.stat().st_size, output_path.stat().st_size


def main() -> None:
    images = sorted(IMAGE_DIR.glob("*.png"))
    if not images:
        raise SystemExit(f"No PNG files found in {IMAGE_DIR}")

    workers = min(8, max(2, (os.cpu_count() or 2) - 1))
    original_total = 0
    output_total = 0
    completed = 0
    print(f"Optimizing {len(images)} images with {workers} workers...")

    with ProcessPoolExecutor(max_workers=workers) as executor:
        for original_size, output_size in executor.map(convert, images, chunksize=4):
            original_total += original_size
            output_total += output_size
            completed += 1
            if completed % 50 == 0 or completed == len(images):
                ratio = output_total / original_total if original_total else 0
                print(
                    f"{completed}/{len(images)} images | "
                    f"{output_total / 1024 / 1024:.1f} MB | {ratio:.1%} of source"
                )

    print(
        f"Done: {original_total / 1024 / 1024:.1f} MB -> "
        f"{output_total / 1024 / 1024:.1f} MB "
        f"({output_total / original_total:.1%})"
    )


if __name__ == "__main__":
    main()
