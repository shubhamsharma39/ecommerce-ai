import asyncio
import os
import sys
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings

SAMPLE_PRODUCTS = [
    # 1. Mobiles
    {
        "name": "Apple iPhone 15 Pro Max (256GB)",
        "description": "Forged in titanium with Apple A17 Pro chip, 48MP pro camera system, and USB-C superfast connectivity.",
        "price": 1199.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
        "stock": 15,
        "category": "Mobiles",
        "is_active": True
    },
    {
        "name": "Samsung Galaxy S24 Ultra (512GB)",
        "description": "Next-gen Galaxy AI smartphone featuring 200MP camera, built-in S-Pen, and titanium frame.",
        "price": 1249.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
        "stock": 18,
        "category": "Mobiles",
        "is_active": True
    },

    # 2. Electronics
    {
        "name": "Wireless Noise-Canceling Headphones",
        "description": "Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and spatial audio.",
        "price": 249.99,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "stock": 25,
        "category": "Electronics",
        "is_active": True
    },
    {
        "name": "Minimalist Mechanical Keyboard",
        "description": "Custom compact RGB mechanical keyboard with tactile switches and durable PBT keycaps.",
        "price": 129.50,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
        "stock": 18,
        "category": "Electronics",
        "is_active": True
    },
    {
        "name": "MacBook Air 15\" M3 (16GB RAM)",
        "description": "Strikingly thin design with blazing-fast Apple M3 chip, Liquid Retina display, and 18-hour battery.",
        "price": 1299.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
        "stock": 9,
        "category": "Electronics",
        "is_active": True
    },
    {
        "name": "4K Ultra HD Streaming Webcam",
        "description": "Crisp 4K 60fps webcam with dual noise-canceling microphones and automatic low-light correction.",
        "price": 139.99,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600",
        "stock": 10,
        "category": "Electronics",
        "is_active": True
    },

    # 3. Fashion
    {
        "name": "Organic Heavyweight Cotton Hoodie",
        "description": "Ultra-soft 450gsm organic cotton hoodie with a cozy relaxed fit and reinforced double stitching.",
        "price": 85.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
        "stock": 30,
        "category": "Fashion",
        "is_active": True
    },
    {
        "name": "Classic Tailored Wool Blazer",
        "description": "Premium Italian wool blend blazer with slim silhouette and satin interior lining.",
        "price": 185.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600",
        "stock": 22,
        "category": "Fashion",
        "is_active": True
    },

    # 4. Home & Kitchen
    {
        "name": "Ceramic Pour-Over Coffee Set",
        "description": "Handcrafted matte ceramic dripper and glass carafe set for brewing barista-grade specialty coffee at home.",
        "price": 58.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
        "stock": 16,
        "category": "Home & Kitchen",
        "is_active": True
    },
    {
        "name": "Cast Iron Dutch Oven 6-Quart",
        "description": "Heavy-duty enameled cast iron Dutch oven providing flawless heat retention and even cooking.",
        "price": 89.50,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1584990347449-399066664e1c?w=600",
        "stock": 12,
        "category": "Home & Kitchen",
        "is_active": True
    },

    # 5. Beauty & Personal Care
    {
        "name": "Hydrating Botanical Facial Serum",
        "description": "Infused with hyaluronic acid, organic green tea extract, and vitamin C for radiant, hydrated skin.",
        "price": 36.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
        "stock": 45,
        "category": "Beauty & Personal Care",
        "is_active": True
    },

    # 6. Books & Stationery
    {
        "name": "Hardcover Productivity & Habit Planner",
        "description": "Undated 12-month goal setting and daily habit tracker bound in premium vegan pebble leather.",
        "price": 24.50,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
        "stock": 60,
        "category": "Books & Stationery",
        "is_active": True
    },

    # 7. Sports & Fitness
    {
        "name": "Smart Fitness Watch & Tracker",
        "description": "Track your heart rate, sleep metrics, and workouts with an vivid AMOLED display and 14-day battery life.",
        "price": 149.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        "stock": 20,
        "category": "Sports & Fitness",
        "is_active": True
    },

    # 8. Accessories
    {
        "name": "Water-Resistant Commuter Backpack",
        "description": "Sleek 22L urban backpack featuring a padded 16-inch laptop compartment and anti-theft hidden pockets.",
        "price": 110.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        "stock": 15,
        "category": "Accessories",
        "is_active": True
    },
    {
        "name": "Polarized Classic Aviator Sunglasses",
        "description": "Lightweight titanium frame sunglasses featuring UV400 anti-glare polarized lenses.",
        "price": 95.00,
        "currency": "usd",
        "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        "stock": 22,
        "category": "Accessories",
        "is_active": True
    }
]

async def seed_products():
    print("Connecting to MongoDB Atlas...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    try:
        db = client.get_default_database()
    except Exception:
        db = client[settings.MONGODB_DATABASE]

    now = datetime.now(timezone.utc)
    inserted_count = 0
    skipped_count = 0

    print(f"Checking {len(SAMPLE_PRODUCTS)} sample products across all 8 target categories...")
    for p in SAMPLE_PRODUCTS:
        existing = await db.products.find_one({"name": p["name"]})
        if not existing:
            p_to_insert = p.copy()
            p_to_insert["created_at"] = now
            p_to_insert["updated_at"] = now
            await db.products.insert_one(p_to_insert)
            inserted_count += 1
            print(f"  + Inserted: {p['name']} ({p['category']})")
        else:
            skipped_count += 1
            print(f"  = Existing (preserved): {p['name']}")

    print(f"\nSeed Complete: {inserted_count} new products inserted, {skipped_count} existing products preserved.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_products())
