import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './features/shared/components/header/header.component';
import { FooterComponent } from './features/shared/components/footer/footer.component';
import { Notification, NotificationService } from './features/core/services/notification.service';

interface AppNotification extends Notification {
  leaving?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-shell">
      @if (!isAdminRoute()) {
        <app-header></app-header>
      }
      @if (!isAdminRoute()) {
        <div class="app-notifications" aria-live="polite" aria-atomic="false">
          @for (notification of notifications(); track notification.id) {
            <div class="app-notification" [class]="'notification-' + notification.type" [class.notification-leaving]="notification.leaving" role="alert">
              <strong>{{ notification.title || (notification.type | titlecase) }}</strong>
              <span>{{ notification.message }}</span>
              <button type="button" aria-label="Dismiss notification" (click)="dismissNotification(notification.id)">×</button>
            </div>
          }
        </div>
      }
      <main class="page-content">
        <router-outlet></router-outlet>
      </main>
      @if (!isAdminRoute()) {
        <app-footer></app-footer>
      }
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  title = 'bridge-ai-angular';
  protected isAdminRoute = signal(false);
  protected notifications = signal<AppNotification[]>([]);
  private readonly notificationSubscription;

  constructor(private router: Router, notificationService: NotificationService) {
    this.notificationSubscription = notificationService.notifications$.subscribe(notification => {
      this.notifications.set([notification]);
      if ((notification.duration ?? 0) > 0) {
        window.setTimeout(() => this.dismissNotification(notification.id), notification.duration);
      }
    });

    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin')));
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  protected dismissNotification(id?: number): void {
    if (id === undefined) {
      return;
    }

    this.notifications.update(current => current.map(notification =>
      notification.id === id ? { ...notification, leaving: true } : notification
    ));
    window.setTimeout(() => {
      this.notifications.update(current => current.filter(notification => notification.id !== id));
    }, 220);
  }
}
