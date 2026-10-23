"""Unit tests for core order pricing domain logic."""

import unittest
from src.main import LineItem, calculate_order_total_cents


class OrderPricingTests(unittest.TestCase):
    def test_single_item_with_default_vat(self) -> None:
        items = [LineItem(sku="BOOK-AI-01", unit_price_cents=1000, quantity=2)]
        self.assertEqual(calculate_order_total_cents(items, tax_rate=0.23), 2460)

    def test_empty_order_returns_zero(self) -> None:
        self.assertEqual(calculate_order_total_cents([], tax_rate=0.23), 0)

    def test_invalid_quantity_raises_value_error(self) -> None:
        with self.assertRaises(ValueError):
            LineItem(sku="BOOK-AI-01", unit_price_cents=1000, quantity=0)

    def test_invalid_tax_rate_raises_value_error(self) -> None:
        items = [LineItem(sku="BOOK-AI-01", unit_price_cents=500, quantity=1)]
        with self.assertRaises(ValueError):
            calculate_order_total_cents(items, tax_rate=-0.05)


if __name__ == "__main__":
    unittest.main()
