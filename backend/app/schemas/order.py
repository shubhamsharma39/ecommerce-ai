from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.order import PaymentStatus, OrderStatus

class ShippingAddressRequest(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: Optional[str] = ""
    postal_code: str
    country: Optional[str] = "India"

class CreateOrderRequest(BaseModel):
    shipping_address: Optional[ShippingAddressRequest] = None
    payment_method: Optional[str] = "cod"  # "cod" or "stripe"

class OrderItemResponse(BaseModel):
    product_id: str
    product_name: str
    price: float
    quantity: int

class OrderResponse(BaseModel):
    id: str
    order_number: Optional[str] = None
    user_id: str
    items: List[OrderItemResponse]
    subtotal: float
    shipping_fee: Optional[float] = 0.0
    total: float
    currency: str = "usd"
    payment_method: Optional[str] = "cod"
    payment_status: PaymentStatus
    order_status: OrderStatus
    shipping_address: Optional[Dict[str, Any]] = None
    stripe_checkout_session_id: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
        "use_enum_values": True
    }

class UpdateOrderStatusRequest(BaseModel):
    order_status: OrderStatus
