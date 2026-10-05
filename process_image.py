import sys
import os
from PIL import Image, ImageEnhance
import rembg

input_path = r"d:\adham alaa\photo_2026-04-09_12-56-58.jpg"
output_dir = r"d:\adham alaa\portfolio\public"

print("Loading image...")
img = Image.open(input_path)

print("Removing background with rembg...")
session = rembg.new_session("u2net")
img_nobg = rembg.remove(img, session=session, post_process_mask=True)

print("Applying premium cinematic grayscale...")
# Extract alpha to preserve exact transparency cutout
alpha = img_nobg.getchannel('A')

r, g, b, _ = img_nobg.split()
rgb_img = Image.merge('RGB', (r, g, b))

# Convert to grayscale
l_img = rgb_img.convert('L')

# Apply elegant contrast and brightness
enhancer_contrast = ImageEnhance.Contrast(l_img)
l_img = enhancer_contrast.enhance(1.15) # Cinematic contrast

enhancer_bright = ImageEnhance.Brightness(l_img)
l_img = enhancer_bright.enhance(0.95) # Slight darkening for premium vibe

# Subtle sharpening for details
enhancer_sharp = ImageEnhance.Sharpness(l_img)
l_img = enhancer_sharp.enhance(1.05)

# Merge back with the precise alpha mask
final_img = Image.merge('RGBA', (l_img, l_img, l_img, alpha))

w, h = final_img.size
print(f"Original dimension: {w}x{h}")

# Save original aspect WebP
final_img.save(os.path.join(output_dir, "portrait.webp"), "WEBP", quality=90, exact=True)

# Generate 800w version
if w > 800:
    ratio = 800.0 / w
    h_800 = int(h * ratio)
    img_800 = final_img.resize((800, h_800), Image.Resampling.LANCZOS)
else:
    img_800 = final_img

img_800.save(os.path.join(output_dir, "portrait-800.webp"), "WEBP", quality=88, exact=True)

# Generate 400w version
if w > 400:
    ratio = 400.0 / w
    h_400 = int(h * ratio)
    img_400 = final_img.resize((400, h_400), Image.Resampling.LANCZOS)
else:
    img_400 = final_img

img_400.save(os.path.join(output_dir, "portrait-400.webp"), "WEBP", quality=85, exact=True)

print("Done generating WebP assets.")
