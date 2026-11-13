"""Membuat ikon aplikasi (burung hantu sederhana). Jalankan: python3 scripts/gen_icons.py"""
from PIL import Image, ImageDraw
import os
os.makedirs('public/icons', exist_ok=True)

def draw(size, pad=0.0):
    S = 1024
    im = Image.new('RGBA', (S, S), (108, 92, 231, 255))
    d = ImageDraw.Draw(im)
    k = 1 - pad * 2
    def p(x, y): return (S * (pad + x * k), S * (pad + y * k))
    def box(x0, y0, x1, y1): return [*p(x0, y0), *p(x1, y1)]
    d.ellipse(box(.15, .22, .85, .95), fill=(162, 155, 254))
    d.ellipse(box(.3, .55, .7, .93), fill=(233, 230, 255))
    d.polygon([p(.2, .38), p(.26, .12), p(.42, .3)], fill=(75, 63, 196))
    d.polygon([p(.8, .38), p(.74, .12), p(.58, .3)], fill=(75, 63, 196))
    for cx in (.35, .65):
        d.ellipse(box(cx - .14, .38, cx + .14, .66), fill='white', outline=(59, 47, 99), width=int(S * .018))
        d.ellipse(box(cx - .06, .47, cx + .06, .6), fill=(59, 47, 99))
    d.polygon([p(.45, .62), p(.55, .62), p(.5, .74)], fill=(255, 159, 67))
    return im

for name, size, pad in (('icon-192.png', 192, 0), ('icon-512.png', 512, 0), ('icon-maskable-512.png', 512, 0.12)):
    draw(size, pad).resize((size, size), Image.LANCZOS).save(f'public/icons/{name}')
print('ikon selesai')
