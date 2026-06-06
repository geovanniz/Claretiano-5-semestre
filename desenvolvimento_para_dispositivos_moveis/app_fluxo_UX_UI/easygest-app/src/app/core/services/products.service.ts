import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, CreateProductDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Product[]>                              { return this.api.get('/products'); }
  getById(id: number): Observable<Product>                     { return this.api.get(`/products/${id}`); }
  create(dto: CreateProductDTO): Observable<Product>           { return this.api.post('/products', dto); }
  update(id: number, dto: Partial<CreateProductDTO>): Observable<Product> { return this.api.put(`/products/${id}`, dto); }
  remove(id: number): Observable<void>                         { return this.api.delete(`/products/${id}`); }
}
