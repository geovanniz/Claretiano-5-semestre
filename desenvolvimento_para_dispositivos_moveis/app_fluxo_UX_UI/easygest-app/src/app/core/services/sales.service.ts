import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Sale, CreateSaleDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class SalesService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Sale[]>                                        { return this.api.get('/sales'); }
  getById(id: number): Observable<Sale>                               { return this.api.get(`/sales/${id}`); }
  create(dto: CreateSaleDTO): Observable<Sale>                        { return this.api.post('/sales', dto); }
  updateStatus(id: number, status: Sale['status']): Observable<Sale>  { return this.api.patch(`/sales/${id}/status`, { status }); }
}
