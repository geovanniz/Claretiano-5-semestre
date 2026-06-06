import { db } from '../../database/connection';
import { Product, CreateProductDTO } from '../../types';

export class ProductsService {
  findAll(): Product[] {
    return db
      .prepare('SELECT * FROM products WHERE active = 1 ORDER BY name')
      .all() as Product[];
  }

  findById(id: number): Product {
    const row = db
      .prepare('SELECT * FROM products WHERE id = ? AND active = 1')
      .get(id) as Product | undefined;
    if (!row) throw new Error('Produto não encontrado.');
    return row;
  }

  create(dto: CreateProductDTO): Product {
    const stmt = db.prepare(`
      INSERT INTO products (name, sku, category, price, stock)
      VALUES (@name, @sku, @category, @price, @stock)
    `);
    const result = stmt.run(dto);
    return this.findById(result.lastInsertRowid as number);
  }

  update(id: number, dto: Partial<CreateProductDTO>): Product {
    this.findById(id); // valida existência

    const fields = Object.keys(dto)
      .map(k => `${k} = @${k}`)
      .join(', ');

    db.prepare(`UPDATE products SET ${fields} WHERE id = @id`)
      .run({ ...dto, id });

    return this.findById(id);
  }

  remove(id: number): void {
    this.findById(id);
    // Soft delete — preserva histórico em vendas
    db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(id);
  }

  // Baixa estoque ao finalizar uma venda
  decrementStock(productId: number, quantity: number): void {
    const product = this.findById(productId);
    if (product.stock < quantity) {
      throw new Error(`Estoque insuficiente para "${product.name}" (disponível: ${product.stock}).`);
    }
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?')
      .run(quantity, productId);
  }
}
