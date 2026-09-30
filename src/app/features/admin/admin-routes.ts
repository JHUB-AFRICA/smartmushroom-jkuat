import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from '../core/guards/admin.guard';

export const AdminRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    canActivateChild: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'activities', loadComponent: () => import('./pages/activities/activities.component').then(m => m.AdminActivitiesComponent) },
      { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.AdminEventsComponent) },
      { path: 'resources', loadComponent: () => import('./pages/resources/resources.component').then(m => m.AdminResourcesComponent) },
      { path: 'team', loadComponent: () => import('./pages/team/team.component').then(m => m.AdminTeamComponent) },
      { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.AdminGalleryComponent) },
      { path: 'faqs', loadComponent: () => import('./pages/faqs/faqs.component').then(m => m.AdminFaqsComponent) },
      { path: 'sme', loadComponent: () => import('./pages/sme/sme.component').then(m => m.AdminSmeComponent) },
      { path: 'community', loadComponent: () => import('./pages/community/community.component').then(m => m.AdminCommunityComponent) },
      { path: 'replication', loadComponent: () => import('./pages/replication/replication.component').then(m => m.AdminReplicationComponent) },
      { path: 'submissions', loadComponent: () => import('./pages/submissions/submissions.component').then(m => m.AdminSubmissionsComponent) },
      { path: 'shop-requests', loadComponent: () => import('./pages/shop-requests/shop-requests.component').then(m => m.ShopRequestsComponent) },
      { path: 'shop-products', loadComponent: () => import('./pages/shop-requests/shop-requests.component').then(m => m.ShopProductsComponent) }
    ]
  }
];