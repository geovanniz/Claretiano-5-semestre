import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, CreateUserDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private api: ApiService) {}

  getAll(): Observable<User[]>                                        { return this.api.get('/users'); }
  create(dto: CreateUserDTO): Observable<User>                        { return this.api.post('/users', dto); }
  update(id: number, dto: Partial<CreateUserDTO>): Observable<User>   { return this.api.put(`/users/${id}`, dto); }
  deactivate(id: number): Observable<void>                            { return this.api.delete(`/users/${id}`); }
}
