import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

export interface ShopProduct { id: number; name: string; category: string; description: string; price: number; unit: string; image: string; badge?: string; }
export interface ShopCartItem extends ShopProduct { quantity: number; }

@Injectable({ providedIn: 'root' })
export class ShopCartService {
	readonly cart = signal<ShopCartItem[]>([]);
	readonly cartCount = computed(() => this.cart().reduce((total, item) => total + item.quantity, 0));
	readonly cartTotal = computed(() => this.cart().reduce((total, item) => total + item.price * item.quantity, 0));
	add(product: ShopProduct): void { this.cart.update(items => { const existing = items.find(item => item.id === product.id); return existing ? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]; }); }
	buyNow(product: ShopProduct): void { this.cart.set([{ ...product, quantity: 1 }]); }
	changeQuantity(productId: number, change: number): void { this.cart.update(items => items.map(item => item.id === productId ? { ...item, quantity: item.quantity + change } : item).filter(item => item.quantity > 0)); }
	remove(productId: number): void { this.cart.update(items => items.filter(item => item.id !== productId)); }
	clear(): void { this.cart.set([]); }
}

type DeliveryOption = 'pickup' | 'courier';

@Component({
	selector: 'app-shop',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './shop.component.html',
	styleUrl: './shop.component.css'
})
export class ShopComponent {
	private readonly api = inject(ApiService);
	private readonly formBuilder = inject(FormBuilder);
	private readonly cartService = inject(ShopCartService);

	readonly products = signal<ShopProduct[]>([]);
	readonly productsLoading = signal(true);
	readonly productsError = signal(false);

	readonly cart = this.cartService.cart;
	readonly drawerOpen = signal(false);
	readonly submitting = signal(false);
	readonly submitted = signal(false);
	readonly checkoutError = signal('');
	readonly cartCount = this.cartService.cartCount;
	readonly cartTotal = this.cartService.cartTotal;

	readonly checkoutForm = this.formBuilder.nonNullable.group({
		fullName: ['', [Validators.required, Validators.minLength(2)]],
		phoneNumber: ['', [Validators.required, Validators.pattern(/^(?:\+254|0)\d{9}$/)]],
		deliveryOption: ['pickup' as DeliveryOption, Validators.required]
	});

	constructor(route: ActivatedRoute) {
		this.loadProducts();
		route.queryParamMap.subscribe(params => {
			if (params.get('bag') === 'open') this.openDrawer();
		});
	}

	private loadProducts(): void {
		this.api.get<ShopProduct[]>('/shop-products').subscribe({
			next: products => { this.products.set(products); this.productsLoading.set(false); },
			error: () => { this.productsError.set(true); this.productsLoading.set(false); }
		});
	}

	addToCart(product: ShopProduct): void {
		this.cartService.add(product);
		this.openDrawer();
	}

	buyNow(product: ShopProduct): void {
		this.cartService.buyNow(product);
		this.openDrawer();
	}

	changeQuantity(productId: number, change: number): void {
		this.cartService.changeQuantity(productId, change);
	}

	removeFromCart(productId: number): void {
		this.cartService.remove(productId);
	}

	openDrawer(): void {
		this.submitted.set(false);
		this.checkoutError.set('');
		this.drawerOpen.set(true);
	}

	closeDrawer(): void {
		if (!this.submitting()) this.drawerOpen.set(false);
	}

	submitOrder(): void {
		if (this.checkoutForm.invalid || this.cart().length === 0) {
			this.checkoutForm.markAllAsTouched();
			return;
		}

		this.submitting.set(true);
		this.checkoutError.set('');
		const value = this.checkoutForm.getRawValue();
		this.api.post('/shop', {
			full_name: value.fullName.trim(),
			phone_number: value.phoneNumber.trim(),
			delivery_option: value.deliveryOption,
			items: this.cart().map(item => ({ product_id: item.id, product_name: item.name, quantity: item.quantity, unit_price: item.price })),
			total_amount: this.cartTotal()
		}).subscribe({
			next: () => {
				this.submitting.set(false);
				this.submitted.set(true);
				this.cartService.clear();
				this.checkoutForm.reset({ fullName: '', phoneNumber: '', deliveryOption: 'pickup' });
			},
			error: () => {
				this.submitting.set(false);
				this.checkoutError.set('We could not send your request. Please try again.');
			}
		});
	}
}
