import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, CreateCustomerDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Customer[]>                                    { return this.api.get('/customers'); }
  getById(id: number): Observable<Customer>                           { return this.api.get(`/customers/${id}`); }
  create(dto: CreateCustomerDTO): Observable<Customer>                { return this.api.post('/customers', dto); }
  update(id: number, dto: Partial<CreateCustomerDTO>): Observable<Customer> { return this.api.put(`/customers/${id}`, dto); }
  remove(id: number): Observable<void>                                { return this.api.delete(`/customers/${id}`); }
}
