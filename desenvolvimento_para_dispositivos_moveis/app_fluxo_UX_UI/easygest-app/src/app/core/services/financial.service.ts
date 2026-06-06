import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FinancialSummary, Boleto } from '../models';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  constructor(private api: ApiService) {}

  getSummary(): Observable<FinancialSummary>    { return this.api.get('/financial/summary'); }
  getBoleto(saleId: number): Observable<Boleto> { return this.api.get(`/financial/boleto/${saleId}`); }
}
