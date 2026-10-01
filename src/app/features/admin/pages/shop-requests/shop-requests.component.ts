import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ShopProduct } from '../../../public/pages/shop/shop.component';

interface ShopRequestItem { product_name: string; quantity: number; unit_price: number; }
interface ShopRequest { id: number; full_name: string; phone_number: string; delivery_option: 'pickup' | 'courier'; items: ShopRequestItem[]; total_amount: number; status: string; submitted_at: string; }

@Component({
	selector: 'app-shop-requests',
	imports: [CommonModule],
	templateUrl: './shop-requests.component.html',
	styleUrl: './shop-requests.component.css'
})
export class ShopRequestsComponent {
	private readonly api = inject(ApiService);
	private readonly notificationService = inject(NotificationService);
	readonly requests = signal<ShopRequest[]>([]);
	readonly loading = signal(true);
	readonly updatingId = signal<number | null>(null);
	readonly statuses = ['pending', 'confirmed', 'fulfilled', 'cancelled'];

	constructor() { this.loadRequests(); }

	loadRequests(): void {
		this.loading.set(true);
		this.api.get<ShopRequest[]>('/shop').subscribe({ next: requests => { this.requests.set(requests); this.loading.set(false); }, error: () => this.loading.set(false) });
	}

	updateStatus(item: ShopRequest, status: string): void {
		this.updatingId.set(item.id);
		this.api.patch<ShopRequest>(`/shop/${item.id}`, { status }).subscribe({ next: updated => { this.requests.update(items => items.map(request => request.id === item.id ? updated : request)); this.updatingId.set(null); }, error: () => this.updatingId.set(null) });
	}

	deleteRequest(item: ShopRequest): void {
		if (!window.confirm(`Delete the request from ${item.full_name}?`)) return;
		this.updatingId.set(item.id);
		this.api.delete(`/shop/${item.id}`).subscribe({ next: () => { this.requests.update(items => items.filter(request => request.id !== item.id)); this.updatingId.set(null); this.notificationService.showSuccess('Shop request deleted successfully'); }, error: () => this.updatingId.set(null) });
	}

	itemSummary(item: ShopRequest): string { return item.items.map(orderItem => `${orderItem.product_name} x${orderItem.quantity}`).join(', '); }
	deliveryLabel(option: ShopRequest['delivery_option']): string { return option === 'pickup' ? 'JKUAT pickup' : 'County courier'; }
}

type ProductDraft = Omit<ShopProduct, 'id'>;

@Component({
	selector: 'app-shop-products',
	imports: [CommonModule, FormsModule],
	template: `
		<section class="products-page">
			<header class="page-header">
				<div><p class="eyebrow">Marketplace</p><h1>Shop products</h1><p class="page-intro">Manage product details shown in the public marketplace.</p></div>
			<button type="button" class="primary-button" (click)="openCreate()"><i class="fa-solid fa-plus" aria-hidden="true"></i> Add product</button>
			</header>
			@if (loading()) {
				<p class="state-message" role="status">Loading products...</p>
			} @else if (loadError()) {
				<div class="state-message" role="alert"><p>Products could not be loaded.</p><button type="button" class="secondary-button" (click)="loadProducts()">Try again</button></div>
			} @else if (products().length === 0) {
				<div class="state-message"><strong>No marketplace products yet</strong><span>Add a product to publish it on the shop page.</span></div>
			} @else {
				<div class="products-table-wrap">
					<table class="products-table">
						<thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Unit</th><th>Badge</th><th><span class="sr-only">Actions</span></th></tr></thead>
						<tbody>
							@for (product of products(); track product.id) {
								<tr>
									<td><div class="product-cell"><img [src]="product.image" [alt]="product.name" /><div><strong>{{ product.name }}</strong><span>{{ product.description }}</span></div></div></td>
									<td>{{ product.category }}</td><td class="price-cell">KSh {{ product.price | number }}</td><td>{{ product.unit }}</td><td>{{ product.badge || '—' }}</td>
									<td><div class="row-actions"><button type="button" class="icon-button" [attr.aria-label]="'Edit ' + product.name" (click)="openEdit(product)"><i class="fa-solid fa-pen" aria-hidden="true"></i></button><button type="button" class="icon-button delete-action" [attr.aria-label]="'Delete ' + product.name" [disabled]="deletingId() === product.id" (click)="deleteProduct(product)"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div></td>
								</tr>
							}
						</tbody>
					</table>
				</div>
			}
		</section>

		@if (modalOpen()) {
			<div class="modal-backdrop" role="presentation" (click)="closeModal()">
				<section class="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" (click)="$event.stopPropagation()">
					<header class="modal-header"><div><p class="eyebrow">Marketplace catalogue</p><h2 id="product-modal-title">{{ editingId() === null ? 'Add product' : 'Edit product' }}</h2></div><button type="button" class="icon-button" aria-label="Close dialog" (click)="closeModal()"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></header>
					<form #productForm="ngForm" (ngSubmit)="saveProduct(productForm)" class="product-form">
						<div class="form-grid">
							<label>Product name<input name="name" [(ngModel)]="formData.name" required maxlength="120" /></label>
							<label>Category<input name="category" [(ngModel)]="formData.category" required maxlength="80" /></label>
							<label class="form-span">Description<textarea name="description" [(ngModel)]="formData.description" required rows="3" maxlength="500"></textarea></label>
							<label>Price (KSh)<input name="price" type="number" [(ngModel)]="formData.price" required min="0" step="1" /></label>
							<label>Unit<input name="unit" [(ngModel)]="formData.unit" required maxlength="60" placeholder="e.g. 1 kg bag" /></label>
							<label class="form-span">Image path or URL<input name="image" [(ngModel)]="formData.image" required maxlength="500" placeholder="/images/smartmushrooms/product.jpeg" /></label>
							<label class="form-span">Badge <span class="optional-label">Optional</span><input name="badge" [(ngModel)]="formData.badge" maxlength="50" placeholder="e.g. Best seller" /></label>
						</div>
						@if (formData.image) { <div class="image-preview"><img [src]="formData.image" [alt]="formData.name || 'Product preview'" /><span>Image preview</span></div> }
						@if (saveError()) { <p class="form-error" role="alert">{{ saveError() }}</p> }
						<footer class="form-actions"><button type="button" class="secondary-button" (click)="closeModal()" [disabled]="saving()">Cancel</button><button type="submit" class="primary-button" [disabled]="productForm.invalid || saving()">{{ saving() ? 'Saving...' : editingId() === null ? 'Create product' : 'Save changes' }}</button></footer>
					</form>
				</section>
			</div>
		}
	`,
	styles: [`
		:host{display:block;color:#1f2937}.products-page{padding-bottom:35px}.page-header{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:26px}.eyebrow{margin:0 0 7px;color:#bd572f;font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.page-header h1,.modal-header h2{margin:0;font-size:28px}.page-intro{margin:7px 0 0;color:#64748b}.primary-button,.secondary-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:9px 14px;border:1px solid transparent;border-radius:6px;font:700 13px inherit;cursor:pointer}.primary-button{background:#254d3b;color:#fff}.primary-button:hover{background:#18352b}.primary-button:disabled,.secondary-button:disabled{opacity:.55;cursor:not-allowed}.secondary-button{border-color:#cbd5e1;background:#fff;color:#334155}.products-table-wrap{overflow:auto;border:1px solid #e2e8f0;border-radius:8px;background:#fff}.products-table{width:100%;min-width:920px;border-collapse:collapse}.products-table th{padding:13px 15px;background:#f8fafc;color:#64748b;font-size:11px;letter-spacing:.07em;text-align:left;text-transform:uppercase}.products-table td{padding:14px 15px;border-top:1px solid #edf2f7;font-size:13px;vertical-align:middle}.product-cell{display:flex;align-items:center;gap:12px;max-width:370px}.product-cell img{width:56px;height:48px;flex:none;object-fit:cover;border-radius:4px;background:#edf2f7}.product-cell strong,.product-cell span{display:block}.product-cell strong{color:#1e293b}.product-cell span{display:-webkit-box;overflow:hidden;margin-top:4px;color:#64748b;font-size:12px;line-height:1.4;-webkit-box-orient:vertical;-webkit-line-clamp:2}.price-cell{font-weight:700;white-space:nowrap}.row-actions{display:flex;gap:6px}.icon-button{display:grid;place-items:center;width:34px;height:34px;border:1px solid #dbe2ea;border-radius:5px;background:#fff;color:#334155;cursor:pointer}.icon-button:hover{border-color:#254d3b;color:#254d3b}.icon-button:disabled{opacity:.5;cursor:wait}.delete-action{color:#b42318}.state-message{display:grid;justify-items:center;gap:10px;padding:60px 20px;border:1px dashed #cbd5e1;border-radius:8px;background:#fff;color:#64748b;text-align:center}.state-message strong{color:#334155}.modal-backdrop{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.58)}.product-modal{width:min(680px,100%);max-height:min(90vh,900px);overflow:auto;border-radius:8px;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.25)}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:22px 24px;border-bottom:1px solid #e2e8f0}.modal-header h2{font-size:22px}.product-form{padding:22px 24px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.form-grid label{display:grid;gap:6px;color:#334155;font-size:13px;font-weight:700}.form-grid input,.form-grid textarea{width:100%;min-width:0;padding:10px 11px;border:1px solid #cbd5e1;border-radius:5px;background:#fff;color:#1e293b;font:400 14px inherit}.form-grid input:focus,.form-grid textarea:focus{outline:2px solid #74a78a;outline-offset:1px;border-color:#254d3b}.form-span{grid-column:1/-1}.optional-label{color:#64748b;font-size:11px;font-weight:400}.image-preview{display:flex;align-items:center;gap:12px;margin-top:16px;color:#64748b;font-size:12px}.image-preview img{width:82px;height:64px;object-fit:cover;border-radius:4px;background:#edf2f7}.form-error{color:#b42318;font-size:13px}.form-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px;padding-top:18px;border-top:1px solid #e2e8f0}.sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:600px){.page-header{align-items:stretch;flex-direction:column}.page-header .primary-button{align-self:flex-start}.form-grid{grid-template-columns:1fr}.form-span{grid-column:auto}.modal-backdrop{padding:10px}.product-form{padding:18px}.modal-header{padding:18px}}
	`]
})
export class ShopProductsComponent {
	private readonly api = inject(ApiService);
	private readonly notifications = inject(NotificationService);
	readonly products = signal<ShopProduct[]>([]);
	readonly loading = signal(true);
	readonly loadError = signal(false);
	readonly modalOpen = signal(false);
	readonly editingId = signal<number | null>(null);
	readonly saving = signal(false);
	readonly saveError = signal('');
	readonly deletingId = signal<number | null>(null);
	formData: ProductDraft = this.emptyProduct();

	constructor() { this.loadProducts(); }

	loadProducts(): void {
		this.loading.set(true);
		this.loadError.set(false);
		this.api.get<ShopProduct[]>('/shop-products').subscribe({ next: products => { this.products.set(products); this.loading.set(false); }, error: () => { this.loadError.set(true); this.loading.set(false); } });
	}

	openCreate(): void { this.editingId.set(null); this.formData = this.emptyProduct(); this.saveError.set(''); this.modalOpen.set(true); }

	openEdit(product: ShopProduct): void {
		this.editingId.set(product.id);
		this.formData = { name: product.name, category: product.category, description: product.description, price: product.price, unit: product.unit, image: product.image, badge: product.badge || '' };
		this.saveError.set('');
		this.modalOpen.set(true);
	}

	closeModal(): void { if (!this.saving()) this.modalOpen.set(false); }

	saveProduct(form: NgForm): void {
		if (form.invalid || this.saving()) return;
		this.saving.set(true);
		this.saveError.set('');
		const payload: ProductDraft = { ...this.formData, name: this.formData.name.trim(), category: this.formData.category.trim(), description: this.formData.description.trim(), unit: this.formData.unit.trim(), image: this.formData.image.trim(), badge: this.formData.badge?.trim() || undefined };
		const id = this.editingId();
		const request = id === null ? this.api.post<ShopProduct>('/shop-products', payload) : this.api.put<ShopProduct>(`/shop-products/${id}`, payload);
		request.subscribe({
			next: product => { this.products.update(items => id === null ? [...items, product] : items.map(item => item.id === id ? product : item)); this.saving.set(false); this.modalOpen.set(false); this.notifications.showSuccess(id === null ? 'Product added to the marketplace' : 'Product details updated'); },
			error: () => { this.saving.set(false); this.saveError.set('The product could not be saved. Check the details and try again.'); }
		});
	}

	deleteProduct(product: ShopProduct): void {
		if (!window.confirm(`Delete ${product.name} from the marketplace?`)) return;
		this.deletingId.set(product.id);
		this.api.delete(`/shop-products/${product.id}`).subscribe({ next: () => { this.products.update(items => items.filter(item => item.id !== product.id)); this.deletingId.set(null); this.notifications.showSuccess('Product deleted from the marketplace'); }, error: () => { this.deletingId.set(null); this.notifications.showError('The product could not be deleted. Please try again.'); } });
	}

	private emptyProduct(): ProductDraft { return { name: '', category: '', description: '', price: 0, unit: '', image: '', badge: '' }; }
}
