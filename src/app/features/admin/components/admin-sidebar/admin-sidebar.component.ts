// ============================================================
// BRIDGE-AI Kenya - Admin Sidebar Component
// ============================================================

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="admin-sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of navItems()" class="nav-item">
            <a
              [routerLink]="item.path ? ['/admin', item.path] : ['/admin']"
              routerLinkActive="active"
              class="nav-link"
              [class.active]="isActive(item.path)"
              [attr.aria-label]="collapsed ? item.label : null"
              (click)="navigationSelected.emit()"
            >
              <span class="nav-icon"><i [class]="item.icon" aria-hidden="true"></i></span>
              <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
              <span *ngIf="collapsed" class="nav-tooltip" role="tooltip">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button (click)="logout()" class="logout-btn" [title]="collapsed ? 'Logout' : ''">
          <span class="nav-icon"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i></span>
          <span *ngIf="!collapsed" class="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      width: 250px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      z-index: 40;
      overflow: hidden;
    }

    .admin-sidebar.collapsed {
      width: 64px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 2px;
    }

    .nav-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #4b5563;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .nav-link:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .nav-link.active {
      background: #eff6ff;
      color: #3b82f6;
    }

    .nav-link.active .nav-icon svg {
      stroke: #3b82f6;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .nav-icon i {
      width: 20px;
      font-size: 18px;
      color: #6b7280;
      text-align: center;
    }

    .nav-link.active .nav-icon i {
      color: #3b82f6;
    }

    .nav-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .admin-sidebar.collapsed .nav-label {
      display: none;
    }

    .admin-sidebar.collapsed .nav-link {
      justify-content: center;
      padding: 10px;
    }

    .nav-tooltip {
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      z-index: 60;
      padding: 7px 10px;
      border-radius: 6px;
      background: #1f2937;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-50%) translateX(-4px);
      transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
    }

    .nav-tooltip::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -5px;
      width: 10px;
      height: 10px;
      background: #1f2937;
      transform: translateY(-50%) rotate(45deg);
    }

    .admin-sidebar.collapsed .nav-link:hover .nav-tooltip,
    .admin-sidebar.collapsed .nav-link:focus-visible .nav-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
    }

    .sidebar-footer {
      padding: 12px 8px;
      border-top: 1px solid #f3f4f6;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      border-radius: 8px;
      color: #ef4444;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #fef2f2;
    }

    .logout-btn .nav-icon i {
      color: #ef4444;
    }

    .admin-sidebar.collapsed .logout-btn {
      justify-content: center;
      padding: 10px;
    }

    .admin-sidebar.collapsed .logout-btn .nav-label {
      display: none;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        transform: translateX(-100%);
        width: 280px;
        transition: transform 0.3s ease;
      }

      .admin-sidebar.mobile-open {
        transform: translateX(0);
      }

      .admin-sidebar.collapsed {
        width: 280px;
      }

      .admin-sidebar.collapsed .nav-label {
        display: inline;
      }

      .admin-sidebar.collapsed .nav-link {
        justify-content: flex-start;
        padding: 10px 12px;
      }

      .admin-sidebar.collapsed .nav-tooltip {
        display: none;
      }

      .admin-sidebar.collapsed .logout-btn {
        justify-content: flex-start;
        padding: 10px 12px;
      }

      .admin-sidebar.collapsed .logout-btn .nav-label {
        display: inline;
      }
    }
  `]
})
export class AdminSidebarComponent {
  @Input() collapsed: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Output() navigationSelected = new EventEmitter<void>();

  protected navItems = signal<AdminNavItem[]>([
    { path: '', label: 'Dashboard', icon: this.getDashboardIcon(), active: false },
    { path: 'activities', label: 'Activities', icon: this.getActivityIcon(), active: false },
    { path: 'events', label: 'Events', icon: this.getEventIcon(), active: false },
    { path: 'resources', label: 'Resources', icon: this.getResourceIcon(), active: false },
    { path: 'team', label: 'Team', icon: this.getTeamIcon(), active: false },
    { path: 'gallery', label: 'Gallery', icon: this.getGalleryIcon(), active: false },
    { path: 'faqs', label: 'FAQs', icon: this.getFaqIcon(), active: false },
    { path: 'sme', label: 'SME', icon: this.getSmeIcon(), active: false },
    { path: 'community', label: 'Community', icon: this.getCommunityIcon(), active: false },
    { path: 'replication', label: 'Replication', icon: this.getReplicationIcon(), active: false },
    { path: 'submissions', label: 'Submissions', icon: this.getSubmissionsIcon(), active: false },
    { path: 'shop-requests', label: 'Shop requests', icon: this.getShopIcon(), active: false },
    { path: 'shop-products', label: 'Shop products', icon: 'fa-solid fa-box-open', active: false }
  ]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getDashboardIcon(): string {
    return 'fa-solid fa-table-cells-large';
  }

  getActivityIcon(): string {
    return 'fa-solid fa-chart-line';
  }

  getEventIcon(): string {
    return 'fa-solid fa-calendar-days';
  }

  getResourceIcon(): string {
    return 'fa-solid fa-folder-open';
  }

  getTeamIcon(): string {
    return 'fa-solid fa-users';
  }

  getGalleryIcon(): string {
    return 'fa-solid fa-images';
  }

  getFaqIcon(): string {
    return 'fa-solid fa-circle-question';
  }

  getTrainingIcon(): string {
    return 'fa-solid fa-graduation-cap';
  }

  getSmeIcon(): string {
    return 'fa-solid fa-lightbulb';
  }

  getCommunityIcon(): string {
    return 'fa-solid fa-people-group';
  }

  getReplicationIcon(): string {
    return 'fa-solid fa-arrows-rotate';
  }

  getSubmissionsIcon(): string {
    return 'fa-solid fa-inbox';
  }

  getShopIcon(): string {
    return 'fa-solid fa-basket-shopping';
  }

  isActive(path: string): boolean {
    const currentUrl = this.router.url;
    if (path === '') {
      return currentUrl === '/admin' || currentUrl === '/admin/';
    }
    return currentUrl.includes(`/admin/${path}`);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}