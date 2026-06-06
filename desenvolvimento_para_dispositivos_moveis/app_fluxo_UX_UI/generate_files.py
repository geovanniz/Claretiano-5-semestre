import os

base_dir = '/home/geovanni/Documentos/codewars/Claretiano-5-semestre/desenvolvimento_para_dispositivos_moveis/app_fluxo_UX_UI'

# Backend .gitignore
gitignore_content = """node_modules/
dist/
data/
.env
"""
with open(os.path.join(base_dir, 'easygest-api', '.gitignore'), 'w') as f:
    f.write(gitignore_content)

# Frontend services extraction (from services.ts)
services_ts_path = os.path.join(base_dir, 'easygest-app/src/app/core/services/services.ts')
if os.path.exists(services_ts_path):
    with open(services_ts_path, 'r') as f:
        services_content = f.read()
    
    products_content = """import { Injectable } from '@angular/core';
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
"""
    customers_content = """import { Injectable } from '@angular/core';
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
"""
    users_content = """import { Injectable } from '@angular/core';
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
"""
    sales_content = """import { Injectable } from '@angular/core';
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
"""
    financial_content = """import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FinancialSummary, Boleto } from '../models';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  constructor(private api: ApiService) {}

  getSummary(): Observable<FinancialSummary>    { return this.api.get('/financial/summary'); }
  getBoleto(saleId: number): Observable<Boleto> { return this.api.get(`/financial/boleto/${saleId}`); }
}
"""
    cart_content = """import { Injectable, signal, computed } from '@angular/core';
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
"""
    
    svc_dir = os.path.join(base_dir, 'easygest-app/src/app/core/services')
    os.makedirs(svc_dir, exist_ok=True)
    with open(os.path.join(svc_dir, 'products.service.ts'), 'w') as f: f.write(products_content)
    with open(os.path.join(svc_dir, 'customers.service.ts'), 'w') as f: f.write(customers_content)
    with open(os.path.join(svc_dir, 'users.service.ts'), 'w') as f: f.write(users_content)
    with open(os.path.join(svc_dir, 'sales.service.ts'), 'w') as f: f.write(sales_content)
    with open(os.path.join(svc_dir, 'financial.service.ts'), 'w') as f: f.write(financial_content)
    with open(os.path.join(svc_dir, 'cart.service.ts'), 'w') as f: f.write(cart_content)
    
    os.remove(services_ts_path)

# Frontend app setup files
with open(os.path.join(base_dir, 'easygest-app/src/app/app.component.ts'), 'w') as f:
    f.write("""import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
""")

with open(os.path.join(base_dir, 'easygest-app/src/app/app.component.html'), 'w') as f:
    f.write("""<ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
""")

with open(os.path.join(base_dir, 'easygest-app/src/main.ts'), 'w') as f:
    f.write("""import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
""")

with open(os.path.join(base_dir, 'easygest-app/src/polyfills.ts'), 'w') as f:
    f.write("""import 'zone.js';
""")

with open(os.path.join(base_dir, 'easygest-app/src/index.html'), 'w') as f:
    f.write("""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>EasyGest</title>
  <base href="/"/>
  <meta name="color-scheme" content="light dark"/>
  <meta name="viewport"
    content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="icon" type="image/png" href="assets/icon/favicon.png"/>
  <link rel="manifest" href="manifest.webmanifest"/>
</head>
<body>
  <app-root></app-root>
</body>
</html>
""")

with open(os.path.join(base_dir, 'easygest-app/ionic.config.json'), 'w') as f:
    f.write("""{
  "name": "easygest-app",
  "integrations": { "capacitor": {} },
  "type": "angular"
}
""")

with open(os.path.join(base_dir, 'easygest-app/tsconfig.json'), 'w') as f:
    f.write("""{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
""")

with open(os.path.join(base_dir, 'easygest-app/tsconfig.app.json'), 'w') as f:
    f.write("""{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts", "src/polyfills.ts"],
  "include": ["src/**/*.d.ts"]
}
""")

with open(os.path.join(base_dir, 'easygest-app/src/theme/variables.scss'), 'w') as f:
    f.write("""// Ionic CSS Variables — tema EasyGest
:root {
  --ion-color-primary: #1D9E75;
  --ion-color-primary-rgb: 29,158,117;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #198965;
  --ion-color-primary-tint: #34a883;

  --ion-color-secondary: #0F6E56;
  --ion-color-secondary-rgb: 15,110,86;
  --ion-color-secondary-contrast: #ffffff;
  --ion-color-secondary-shade: #0d614c;
  --ion-color-secondary-tint: #277d67;

  --ion-color-success: #3B6D11;
  --ion-color-warning: #854F0B;
  --ion-color-danger:  #C0392B;
}

// Componentes
.stat-card {
  background: var(--ion-color-step-50, #f5f5f5);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 4px;
  &.success { background: #EAF3DE; }
  &.warning { background: #FAEEDA; }
  .stat-label { font-size: 12px; color: #666; margin: 0 0 4px; }
  .stat-value { font-size: 20px; font-weight: 600; margin: 0; }
}

.qty-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
  span { font-size: 16px; font-weight: 600; min-width: 20px; text-align: center; }
}

.product-name { font-size: 13px; font-weight: 600; margin: 8px 0 2px; }
.product-price { font-size: 13px; color: #1D9E75; font-weight: 500; margin: 0 0 6px; }
.error-msg { color: var(--ion-color-danger); font-size: 12px; padding: 4px 16px; }
""")

with open(os.path.join(base_dir, 'easygest-app/angular.json'), 'w') as f:
    f.write("""{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "app": {
      "projectType": "application",
      "schematics": {
        "@ionic/angular-toolkit:component": {
          "style": "scss"
        },
        "@ionic/angular-toolkit:page": {
          "style": "scss",
          "standalone": false
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "www",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["src/polyfills.ts", "zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/theme/variables.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "app:build:production"
            },
            "development": {
              "buildTarget": "app:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "app:build"
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false
  }
}
""")

print("Initial files generated.")
