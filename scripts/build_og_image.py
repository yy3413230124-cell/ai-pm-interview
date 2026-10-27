from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "og-cover.png"

INK = "#050607"
BLUE = "#075bf5"
MUTED = "#5f6673"
CYAN = "#01f7f2"
LIME = "#d9ff69"

BOLD_FONT = "C:/Windows/Fonts/msyhbd.ttc"
REGULAR_FONT = "C:/Windows/Fonts/msyh.ttc"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(BOLD_FONT if bold else REGULAR_FONT, size)


def main() -> None:
    image = Image.new("RGB", (1200, 630), "#f5f6f7")
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle(
        (34, 34, 1166, 596),
        radius=28,
        fill="#ffffff",
        outline=INK,
        width=4,
    )

    draw.rounded_rectangle((74, 82, 474, 116), radius=17, fill="#eaf2ff", outline=INK, width=2)
    draw.ellipse((88, 92, 104, 108), fill=CYAN, outline=INK, width=2)
    draw.text((116, 88), "AI PM INTERVIEW ATLAS · 2026", font=font(14, True), fill=BLUE)

    draw.text((74, 154), "AI产品经理", font=font(86, True), fill=INK, spacing=0)
    draw.text((74, 250), "面试题图谱", font=font(86, True), fill=BLUE, spacing=0)
    draw.rounded_rectangle((74, 373, 416, 391), radius=9, fill=LIME, outline=INK, width=2)
    draw.text(
        (74, 432),
        "业务目标 · 方案取舍 · 失败兜底 · 评测迭代",
        font=font(24),
        fill="#303745",
    )
    draw.text(
        (74, 536),
        "不是背答案，是把技术题讲成产品判断。",
        font=font(18, True),
        fill=MUTED,
    )

    draw.rounded_rectangle((762, 116, 1084, 462), radius=18, fill="#ffffff", outline=INK, width=3)
    draw.rounded_rectangle((762, 116, 1084, 188), radius=18, fill="#0a0a0f", outline=INK, width=3)
    draw.rectangle((765, 167, 1081, 188), fill="#0a0a0f")
    draw.text((786, 137), "124 / INTERVIEW QUESTIONS", font=font(15, True), fill="#ffffff")

    rows = [
        (218, "#eaf2ff", BLUE, "01  Agent 系统与边界"),
        (280, "#fff0dd", "#b45b0d", "02  RAG 检索与评测"),
        (342, "#e2fbf1", "#087453", "03  工具调用与权限"),
    ]
    for top, background, color, label in rows:
        draw.rounded_rectangle((786, top, 1060, top + 48), radius=10, fill=background, outline=INK, width=2)
        draw.text((804, top + 10), label, font=font(19, True), fill=color)

    draw.ellipse((1014, 399, 1052, 437), fill=CYAN, outline=INK, width=3)
    draw.line(((1022, 419), (1030, 426), (1047, 405)), fill=INK, width=4, joint="curve")

    image.save(OUTPUT, "PNG", optimize=True)
    print(f"Wrote {OUTPUT} ({OUTPUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
