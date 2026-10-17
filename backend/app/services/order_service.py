import uuid
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId
from fastapi import HTTPException, status
from app.db.mongodb import get_database
from app.models.order import PaymentStatus, OrderStatus
from app.schemas.order import OrderResponse, OrderItemResponse, CreateOrderRequest
from app.services.cart_service import cart_service

class OrderService:
    @staticmethod
    async def create_order_from_cart(user_id: str, request_data: Optional[CreateOrderRequest] = None) -> OrderResponse:
        cart_response = await cart_service.get_user_cart(user_id)
        if not cart_response.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot create an order from an empty cart"
            )

        db = get_database()
        order_items = []
        subtotal = 0.0

        for cart_item in cart_response.items:
            product = await db.products.find_one({
                "_id": ObjectId(cart_item.product_id),
                "is_active": True
            })
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product {cart_item.name} is no longer available"
                )

            if cart_item.quantity > product.get("stock", 0):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product['name']}. Available: {product.get('stock', 0)}"
                )

            price_snapshot = float(product["price"])
            line_subtotal = round(price_snapshot * cart_item.quantity, 2)
            subtotal += line_subtotal

            order_items.append({
                "product_id": str(product["_id"]),
                "product_name": product["name"],
                "price": price_snapshot,
                "quantity": cart_item.quantity
            })

        subtotal = round(subtotal, 2)
        shipping_fee = 0.0 if subtotal >= 50.0 else 4.99
        total = round(subtotal + shipping_fee, 2)
        now = datetime.now(timezone.utc)

        payment_method = request_data.payment_method if request_data and request_data.payment_method else "cod"
        shipping_address = request_data.shipping_address.model_dump() if request_data and request_data.shipping_address else None

        # Cash on Delivery starts confirmed, Stripe starts pending
        payment_status = PaymentStatus.PENDING.value
        order_status = OrderStatus.CONFIRMED.value if payment_method == "cod" else OrderStatus.PENDING.value

        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"

        order_doc = {
            "order_number": order_number,
            "user_id": user_id,
            "items": order_items,
            "subtotal": subtotal,
            "shipping_fee": shipping_fee,
            "total": total,
            "currency": "usd",
            "payment_method": payment_method,
            "payment_status": payment_status,
            "order_status": order_status,
            "shipping_address": shipping_address,
            "stripe_checkout_session_id": None,
            "stripe_payment_intent_id": None,
            "created_at": now,
            "updated_at": now
        }

        result = await db.orders.insert_one(order_doc)
        order_doc["id"] = str(result.inserted_id)

        # Deduct product stock safely if confirmed COD
        if order_status == OrderStatus.CONFIRMED.value:
            for item in order_items:
                await db.products.update_one(
                    {"_id": ObjectId(item["product_id"])},
                    {"$inc": {"stock": -item["quantity"]}}
                )

        # Clear cart upon order placement
        await cart_service.clear_cart(user_id)

        return OrderResponse(**order_doc)

    @staticmethod
    async def get_user_orders(user_id: str) -> List[OrderResponse]:
        db = get_database()
        cursor = db.orders.find({"user_id": user_id}).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            orders.append(OrderResponse(**doc))
        return orders

    @staticmethod
    async def get_order_by_id_for_user(order_id: str, user_id: str) -> Optional[OrderResponse]:
        db = get_database()
        query = {"user_id": user_id}
        if ObjectId.is_valid(order_id):
            query["_id"] = ObjectId(order_id)
        else:
            query["order_number"] = order_id
        
        doc = await db.orders.find_one(query)
        if not doc:
            return None
        doc["id"] = str(doc["_id"])
        return OrderResponse(**doc)

    @staticmethod
    async def get_all_orders_admin() -> List[OrderResponse]:
        db = get_database()
        cursor = db.orders.find({}).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            orders.append(OrderResponse(**doc))
        return orders

    @staticmethod
    async def get_order_by_id_admin(order_id: str) -> Optional[OrderResponse]:
        db = get_database()
        query = {}
        if ObjectId.is_valid(order_id):
            query["_id"] = ObjectId(order_id)
        else:
            query["order_number"] = order_id
        doc = await db.orders.find_one(query)
        if not doc:
            return None
        doc["id"] = str(doc["_id"])
        return OrderResponse(**doc)

    @staticmethod
    async def update_order_status_admin(order_id: str, new_status: OrderStatus) -> Optional[OrderResponse]:
        db = get_database()
        now = datetime.now(timezone.utc)
        filter_q = {"_id": ObjectId(order_id)} if ObjectId.is_valid(order_id) else {"order_number": order_id}
        result = await db.orders.find_one_and_update(
            filter_q,
            {"$set": {"order_status": new_status.value, "updated_at": now}},
            return_document=True
        )
        if not result:
            return None
        result["id"] = str(result["_id"])
        return OrderResponse(**result)

order_service = OrderService()
