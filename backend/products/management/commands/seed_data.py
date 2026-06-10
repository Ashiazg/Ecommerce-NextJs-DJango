import io
import json
import os
import urllib.request
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from products.models import Category, Product, ProductImage


class Command(BaseCommand):
    help = "Puebla la BD con datos de FakeStore API y descarga imágenes"

    CATEGORIES_URL = "https://fakestoreapi.com/products/categories"
    PRODUCTS_URL = "https://fakestoreapi.com/products"

    CATEGORY_REMAP = {
        "electronics": "Electrónica",
        "jewelery": "Joyería",
        "men's clothing": "Ropa Hombre",
        "women's clothing": "Ropa Mujer",
    }

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write("Ya hay productos en la BD. Usa --force para recargar.")
            return

        self._seed_categories()
        self._seed_products()
        self.stdout.write(self.style.SUCCESS("Seed completado exitosamente."))

    def _seed_categories(self):
        data = self._fetch(self.CATEGORIES_URL)
        for cat_name in data:
            display = self.CATEGORY_REMAP.get(cat_name, cat_name)
            Category.objects.get_or_create(
                slug=slugify(cat_name),
                defaults={"name": display, "description": f"Productos de {display}"},
            )
        self.stdout.write(f"Categorías creadas: {Category.objects.count()}")

    def _seed_products(self):
        data = self._fetch(self.PRODUCTS_URL)
        for item in data:
            cat_slug = slugify(item["category"])
            try:
                category = Category.objects.get(slug=cat_slug)
            except Category.DoesNotExist:
                continue

            product, created = Product.objects.get_or_create(
                slug=slugify(item["title"])[:50],
                defaults={
                    "category": category,
                    "name": item["title"],
                    "description": item.get("description", ""),
                    "price": item["price"],
                    "stock": 50,
                    "available": True,
                },
            )
            if created and item.get("image"):
                self._download_image(product, item["image"])

        self.stdout.write(f"Productos creados: {Product.objects.count()}")

    def _download_image(self, product, url):
        try:
            img_data = self._fetch_raw(url)
            ext = Path(url).suffix or ".jpg"
            filename = f"{product.slug}{ext}"
            img_io = io.BytesIO(img_data)
            ProductImage.objects.create(
                product=product,
                image=File(img_io, name=filename),
                is_primary=True,
            )
        except Exception as e:
            self.stdout.write(f"  Error descargando imagen para {product.name}: {e}")

    def _fetch(self, url):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def _fetch_raw(self, url):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read()
