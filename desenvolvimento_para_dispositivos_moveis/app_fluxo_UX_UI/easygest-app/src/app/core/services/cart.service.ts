import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product, CreateSaleDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();

  readonly total = computed(() =>
    this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  readonly count = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  add(product: Product): void {
    const current = this.items();
    const idx = current.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      this.items.set(updated);
    } else {
      this.items.set([...current, { product, quantity: 1 }]);
    }
  }

  remove(productId: number): void {
    const current = this.items();
    const idx = current.findIndex(i => i.product.id === productId);
    if (idx < 0) return;
    const item = current[idx];
    if (item.quantity > 1) {
      const updated = [...current];
      updated[idx] = { ...item, quantity: item.quantity - 1 };
      this.items.set(updated);
    } else {
      this.items.set(current.filter((_, i) => i !== idx));
    }
  }

  clear(): void {
    this.items.set([]);
  }

  toDTO(customerId: number, notes?: string): CreateSaleDTO {
    return {
      customer_id: customerId,
      items: this.items().map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      notes,
    };
  }
}
