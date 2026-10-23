"""Core order pricing domain logic for the starter template."""

from dataclasses import dataclass
from typing import Sequence


@dataclass(frozen=True)
class LineItem:
    """Represents an individual item in a customer order."""

    sku: str
    unit_price_cents: int
    quantity: int

    def __post_init__(self) -> None:
        if not self.sku.strip():
            raise ValueError("LineItem sku must not be empty.")
        if self.unit_price_cents < 0:
            raise ValueError("LineItem unit_price_cents must be non-negative.")
        if self.quantity <= 0:
            raise ValueError("LineItem quantity must be greater than zero.")

    @property
    def subtotal_cents(self) -> int:
        """Return the total price in cents for this line item."""
        return self.unit_price_cents * self.quantity


def calculate_order_total_cents(items: Sequence[LineItem], tax_rate: float = 0.23) -> int:
    """Calculate the final order total in cents including tax.

    Args:
        items: Sequence of validated LineItem instances.
        tax_rate: Fractional tax rate between 0.0 and 1.0 (default 0.23 for 23% VAT).

    Returns:
        Rounded total amount in cents.
    """
    if not 0.0 <= tax_rate <= 1.0:
        raise ValueError("tax_rate must be between 0.0 and 1.0.")

    net_cents = sum(item.subtotal_cents for item in items)
    return round(net_cents * (1.0 + tax_rate))
