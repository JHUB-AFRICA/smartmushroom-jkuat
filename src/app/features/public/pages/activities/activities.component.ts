// ============================================================
// Smart Mushroom Kenya Pilot - Activities Component
// ============================================================

import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

type ActivityFilters = {
  wp: string;
  type: string;
  year: string;
};

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="activities-page">
      <section class="activities-banner" aria-labelledby="activities-title">
        <div class="activities-banner-inner">
          <h1 id="activities-title">SmartMushroom News and Activities</h1>
        </div>
      </section>

      <section class="activities-section" id="activities">
        <div class="container">
          <div class="section-header reveal">
            <h2>Latest <span class="highlight">Activities</span></h2>
            <button type="button" class="open-filters" (click)="openFilterModal()" aria-haspopup="dialog" aria-controls="activity-filter-dialog">
              <i class="fas fa-sliders-h" aria-hidden="true"></i>
              <span>Filter Events</span>
              @if (hasActiveFilters()) {
                <span class="active-filter-count">{{ activeFilterCount() }}</span>
              }
            </button>
          </div>

          <dialog #filterDialog id="activity-filter-dialog" class="filter-dialog" aria-labelledby="filter-dialog-title" (click)="onDialogClick($event)">
            <div class="filter-dialog-content">
              <header class="filter-dialog-header">
                <div>
                  <span class="filter-eyebrow">Refine the collection</span>
                  <h2 id="filter-dialog-title">Filter activities</h2>
                </div>
                <button type="button" class="dialog-close" (click)="closeFilterModal()" aria-label="Close filters">
                  <i class="fas fa-times" aria-hidden="true"></i>
                </button>
              </header>

              <div class="filter-fields">
                <label class="filter-field">
                  <span>Work package</span>
                  <select [value]="selectedFilters.wp" (change)="setFilter('wp', $any($event.target).value)">
                    <option value="">All work packages</option>
                    @for (wp of wpOptions; track wp) {
                      <option [value]="wp">{{ wp }}</option>
                    }
                  </select>
                </label>
                <label class="filter-field">
                  <span>Activity type</span>
                  <select [value]="selectedFilters.type" (change)="setFilter('type', $any($event.target).value)">
                    <option value="">All activity types</option>
                    @for (type of typeOptions; track type) {
                      <option [value]="type">{{ formatTypeLabel(type) }}</option>
                    }
                  </select>
                </label>
                <label class="filter-field">
                  <span>Year</span>
                  <select [value]="selectedFilters.year" (change)="setFilter('year', $any($event.target).value)">
                    <option value="">All years</option>
                    @for (year of yearOptions; track year) {
                      <option [value]="year">{{ year }}</option>
                    }
                  </select>
                </label>
                <label class="filter-field">
                  <span>Sort by</span>
                  <select [value]="sortOrder" (change)="setSortOrder($any($event.target).value)">
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </label>
              </div>

              <footer class="filter-dialog-footer">
                <button type="button" class="clear-filters" (click)="clearFilters()">Clear filters</button>
                <button type="button" class="show-results" (click)="closeFilterModal()">Show {{ filteredActivities().length }} activities</button>
              </footer>
            </div>
          </dialog>

          <div class="activities-grid">
            @if (isLoading()) {
              @for (placeholder of skeletonCards; track placeholder) {
                <article class="activity-card activity-skeleton" aria-hidden="true">
                  <div class="skeleton-image shimmer"></div>
                  <div class="skeleton-body">
                    <div class="skeleton-meta shimmer"></div>
                    <div class="skeleton-title shimmer"></div>
                    <div class="skeleton-line shimmer"></div>
                    <div class="skeleton-line short shimmer"></div>
                    <div class="skeleton-footer shimmer"></div>
                  </div>
                </article>
              }
            } @else if (filteredActivities().length > 0) {
              @for (activity of filteredActivities(); track trackByActivity($index, activity); let first = $first) {
                <article class="activity-card reveal" [class.featured-card]="first">
                  <div class="card-image">
                    <img [src]="getActivityImage(activity)" [alt]="activity.title" loading="lazy" />
                    @if (activity.wp_tag) {
                      <span class="image-tag">{{ activity.wp_tag }}</span>
                    }
                  </div>

                  <div class="card-body">
                    <div class="card-meta">
                      @if (first) {
                        <span class="featured-label">Featured update</span>
                      }
                      <span class="meta-date">{{ getDateText(activity.date) }}</span>
                      @if (activity.wp_tag) {
                        <span class="meta-tag wp">{{ activity.wp_tag }}</span>
                      }
                      @if (activity.activity_type) {
                        <span class="meta-tag type">{{ formatTypeLabel(activity.activity_type) }}</span>
                      }
                    </div>

                    <h3>
                      <a [routerLink]="['/activities', activity.slug || activity.id]">{{ activity.title }}</a>
                    </h3>

                    <div class="card-footer">
                      @if (activity.location) {
                        <span class="card-location"><i class="fas fa-map-pin"></i> {{ activity.location }}</span>
                      }
                      <a [routerLink]="['/activities', activity.slug || activity.id]" class="card-link">
                        Read More <i class="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </article>
              }
            } @else {
              <div class="empty-state">
                <span class="empty-icon"><i class="fas fa-newspaper"></i></span>
                <h3>No Activities Found</h3>
                <p>There are no activities matching your filters. Try clearing the filters or check back later.</p>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      color: var(--color-text-main);
      background: var(--color-bg-clay);
      font-family: var(--font-body);
    }

    * { box-sizing: border-box; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; }

    .container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .hero { display: none; }
    .hero-image-wrapper { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
    .hero-slide-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; filter: none; transition: opacity 1.2s ease; }
    .hero-slide-bg.active { opacity: 1; animation: hero-zoom 8s ease-in-out both; }
    @keyframes hero-zoom { from { transform: scale(1); } to { transform: scale(1.06); } }
    .hero::after { content: ''; position: absolute; inset: 0; background: rgba(22, 40, 26, 0.52); z-index: 1; }
    .hero-grid { position: relative; z-index: 2; width: 100%; max-width: 1280px; display: flex; align-items: center; gap: 48px; padding: 60px 28px; }
    .hero-left { flex: 1 1 50%; text-align: left; }
    .hero-right { display: none; }
    .hero-left h1 { font-size: 3.6rem; font-weight: 900; line-height: 1.08; letter-spacing: -0.02em; color: #fff; margin: 0 0 12px; text-shadow: 0 4px 30px rgba(0,0,0,0.35); }
    .hero-left .highlight { color: #c89be8; }
    .hero-sub { font-size: 1.12rem; color: rgba(255,255,255,0.8); margin: 0 0 8px; letter-spacing: 0.02em; }
    .hero-description { max-width: 560px; font-size: 1.02rem; line-height: 1.8; color: rgba(255,255,255,0.76); margin: 16px 0 28px; }
    .hero-buttons { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .btn-primary, .btn-secondary, .card-link { display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 50px; font-weight: 600; transition: all 0.25s ease; }
    .btn-primary { background: var(--color-forest-green); color: var(--color-surface-white); padding: 14px 32px; border: none; text-decoration: none; }
    .btn-primary:hover { background: var(--color-forest-green-dark); transform: translateY(-3px); }
    .btn-secondary { background: transparent; color: #fff; padding: 14px 32px; border: 1.5px solid rgba(255,255,255,0.3); text-decoration: none; }
    .btn-secondary:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); }
    .activities-section { padding: 0 0 64px; background: #fff; }
    .section-header { position: sticky; top: var(--site-header-offset, 80px); z-index: 30; max-width: 1280px; margin: 0 auto 32px; padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; text-align: left; background: rgba(255,255,255,.97); border-bottom: 1px solid #e1e5e1; box-shadow: 0 8px 20px rgba(22,40,26,.06); }
    .section-header h2 { font-size: 2rem; font-weight: 800; color: #17241b; line-height: 1.08; margin: 0; }
    .open-filters { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 44px; padding: 0 18px; border: 1px solid #26432b; border-radius: 6px; background: #26432b; color: #fffdf7; font-size: .9rem; font-weight: 650; cursor: pointer; transition: background .2s ease, transform .2s ease; }
    .open-filters:hover { background: #16281a; transform: translateY(-1px); }
    .open-filters:focus-visible, .dialog-close:focus-visible, .clear-filters:focus-visible, .show-results:focus-visible, .filter-field select:focus-visible { outline: 3px solid #c89b3c; outline-offset: 3px; }
    .active-filter-count { display: grid; place-items: center; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 50%; background: #d8e86b; color: #17241b; font-size: .72rem; font-weight: 800; }
    .filter-dialog { position: fixed; inset: 0; margin: auto; width: min(560px, calc(100% - 32px)); max-width: none; max-height: min(90dvh, 680px); overflow-y: auto; padding: 0; border: 1px solid #d9dfd8; border-radius: 10px; color: #17241b; background: #fffdf7; box-shadow: 0 24px 80px rgba(10,25,16,.28); }
    .filter-dialog::backdrop { background: rgba(12,28,19,.62); backdrop-filter: blur(3px); }
    .filter-dialog-content { padding: 28px; }
    .filter-dialog-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding-bottom: 22px; border-bottom: 1px solid #e1e5e1; }
    .filter-eyebrow { color: #647365; font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .filter-dialog-header h2 { margin: 5px 0 0; font-size: 1.65rem; line-height: 1.2; }
    .dialog-close { display: grid; place-items: center; flex: 0 0 40px; width: 40px; height: 40px; border: 1px solid #d9dfd8; border-radius: 6px; background: #fff; color: #26432b; font-size: 1rem; cursor: pointer; }
    .filter-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 24px 0; }
    .filter-field { display: grid; gap: 8px; color: #34463a; font-size: .82rem; font-weight: 650; }
    .filter-field select { width: 100%; min-height: 46px; padding: 0 38px 0 12px; border: 1px solid #cbd4ca; border-radius: 5px; background: #fff; color: #24372a; font: inherit; font-weight: 500; cursor: pointer; }
    .filter-dialog-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 18px; border-top: 1px solid #e1e5e1; }
    .clear-filters, .show-results { min-height: 44px; padding: 0 16px; border-radius: 5px; font: inherit; font-size: .88rem; font-weight: 650; cursor: pointer; }
    .clear-filters { border: 1px solid #cbd4ca; background: transparent; color: #34463a; }
    .clear-filters:hover { background: #eef1eb; }
    .show-results { border: 1px solid #26432b; background: #26432b; color: #fffdf7; }
    .show-results:hover { background: #16281a; }
    .section-header .highlight { color: #818528; }
    .section-header p { margin-top: 14px; font-size: 1.05rem; color: #6e7767; }
    .activities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 360px)); justify-content: center; gap: 24px; align-items: stretch; max-width: 1180px; margin: 0 auto; }
    .activity-card { min-width: 0; display: flex; flex-direction: column; background: #fffdf7; border: 1px solid rgba(255,255,255,.55); border-radius: 22px; overflow: hidden; box-shadow: 0 12px 28px rgba(22,40,26,.1); transition: transform 0.35s ease, box-shadow 0.35s ease; }
    .activity-card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(22,40,26,.18); }
    .activity-card.featured-card { grid-column: auto; display: flex; min-height: 0; background: #fff; border-color: #e1e5e1; }
    .activity-card.featured-card .card-image { height: auto; min-height: 0; }
    .activity-card.featured-card .card-body { min-height: 0; padding: 18px 16px 0; background: #fff; }
    .activity-card.featured-card .card-body h3 a { color: #17241b; font-size: 1.1rem; }
    .activity-card.featured-card .card-footer { border-top-color: #e1d8c0; }
    .activity-card.featured-card .meta-date, .activity-card.featured-card .card-location { color: #6e7767; }
    .card-image { position: relative; height: 210px; overflow: hidden; background: #16281a; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .activity-card:hover .card-image img { transform: scale(1.05); }
    .image-tag { position: absolute; top: 12px; right: 12px; background: rgba(22, 40, 26, 0.8); color: #f7f2e6; padding: 3px 14px; border-radius: 50px; font-size: 0.58rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .card-body { padding: 16px 16px 0; display: flex; flex-direction: column; min-height: 190px; }
    .card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 10px; }
    .featured-label { color: #d8e86b; font: 600 .62rem 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; margin-right: 4px; }
    .meta-date { font-size: 0.65rem; color: #6e7767; font-weight: 500; }
    .meta-tag { display: inline-block; border-radius: 50px; padding: 2px 10px; font-size: 0.52rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .meta-tag.wp { background: rgba(124, 79, 163, 0.09); color: #5b3878; }
    .meta-tag.type { background: #efe6ce; color: #26432b; }
    .card-body h3 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; line-height: 1.3; }
    .card-body h3 a { color: #17241b; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding: 14px 0 20px; border-top: 1px solid #e1d8c0; }
    .card-location { display: inline-flex; align-items: center; gap: 4px; font-size: 0.7rem; color: #6e7767; }
    .card-link { font-size: 0.75rem; font-weight: 600; color: #26432b; gap: 6px; text-decoration: none; }
    .card-link:hover { gap: 12px; color: #16281a; }
    .activity-skeleton { pointer-events: none; }
    .shimmer { position: relative; overflow: hidden; background: #e6eadf; }
    .shimmer::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.62), transparent); animation: shimmer 1.35s infinite; }
    @keyframes shimmer { to { transform: translateX(100%); } }
    .skeleton-image { height: 176px; }
    .skeleton-body { padding: 18px 18px 20px; }
    .skeleton-meta { width: 42%; height: 10px; border-radius: 5px; margin-bottom: 18px; }
    .skeleton-title { width: 86%; height: 17px; border-radius: 5px; margin-bottom: 16px; }
    .skeleton-line { width: 100%; height: 10px; border-radius: 5px; margin-bottom: 10px; }
    .skeleton-line.short { width: 72%; }
    .skeleton-footer { width: 58%; height: 10px; border-radius: 5px; margin-top: 16px; }
    .empty-state { width: 100%; grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: #efe6ce; border-radius: 24px; border: 2px dashed #e1d8c0; }
    .empty-state .empty-icon { display: block; margin-bottom: 16px; font-size: 2.6rem; color: #26432b; opacity: 0.3; }
    .empty-state h3 { margin: 0 0 6px; font-size: 1.3rem; color: #17241b; }
    .empty-state p { max-width: 400px; margin: 0 auto; color: #6e7767; }
    @media (max-width: 1024px) { .section-header h2 { font-size: 2.2rem; } }
    @media (max-width: 768px) { .section-header { padding: 14px 16px; margin-bottom: 24px; } .section-header h2 { font-size: 1.65rem; } .activities-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; max-width: 600px; } .filter-dialog-content { padding: 22px; } }
    @media (max-width: 480px) { .container { padding: 0 16px; } .hero-left h1 { font-size: 1.8rem; } .section-header { gap: 10px; } .section-header h2 { font-size: 1.12rem; } .open-filters { min-height: 40px; padding: 0 9px; gap: 7px; font-size: .76rem; } .filter-fields { grid-template-columns: 1fr; gap: 14px; padding: 18px 0; } .filter-dialog-content { padding: 18px; } .filter-dialog-header h2 { font-size: 1.4rem; } .filter-dialog-footer { align-items: stretch; flex-direction: column-reverse; } .clear-filters, .show-results { width: 100%; } .card-body { padding: 16px 18px 0; } .card-footer { flex-direction: column; align-items: flex-start; } .activities-grid { grid-template-columns: 1fr; } }
  `]
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild('filterDialog') private filterDialog?: ElementRef<HTMLDialogElement>;
  protected allActivities = signal<Activity[]>([]);
  protected filteredActivities = signal<Activity[]>([]);
  protected isLoading = signal(true);
  protected readonly skeletonCards = [1, 2, 3, 4, 5, 6];
  protected selectedFilters: ActivityFilters = { wp: '', type: '', year: '' };
  protected sortOrder: 'latest' | 'oldest' = 'latest';
  protected wpOptions: string[] = [];
  protected typeOptions: string[] = [];
  protected yearOptions: string[] = [];
  protected heroIndex = signal(0);
  protected heroImages = signal<string[]>(['/images/smartmushrooms/q.jpeg']);
  private heroTimer?: number;

  protected readonly fallbackImage = '/images/webimages/mushroom.png';

  constructor(private activityService: ActivityService, private cloudinaryService: CloudinaryService) {}

  ngOnInit(): void {
    this.loadActivities();
    this.loadHeroImages();
    this.syncStickyOffset();
    window.addEventListener('resize', this.syncStickyOffset.bind(this));
    this.heroTimer = window.setInterval(() => {
      this.heroIndex.update(index => (index + 1) % this.heroImages().length);
    }, 7000);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) window.clearInterval(this.heroTimer);
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 92;
    document.documentElement.style.setProperty('--site-header-offset', `${headerHeight}px`);
  }

  private loadActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = (activities ?? []).filter((activity) =>
          activity.evidence_status?.trim().toLowerCase() === 'published'
        );
        this.allActivities.set(published);
        this.updateFilterOptions(published);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.allActivities.set([]);
        this.filteredActivities.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadHeroImages(): void {
    this.cloudinaryService.getActivityImages().subscribe({
      next: images => {
        const urls = images.map(image => image.secure_url).filter(Boolean);
        this.heroImages.set(['/images/smartmushrooms/q.jpeg', ...urls]);
      },
      error: () => this.heroImages.set(['/images/smartmushrooms/q.jpeg', this.fallbackImage])
    });
  }

  private updateFilterOptions(activities: Activity[]): void {
    this.wpOptions = this.getAvailableValues(activities.map((activity) => activity.wp_tag));
    this.typeOptions = this.getAvailableValues(activities.map((activity) => activity.activity_type));
    this.yearOptions = Array.from(new Set(activities
      .map((activity) => this.getActivityYear(activity.date))
      .filter((year): year is string => !!year)))
      .sort((first, second) => Number(second) - Number(first));
  }

  protected setFilter(key: 'wp' | 'type' | 'year', value: string): void {
    this.selectedFilters[key] = value;
    this.applyFilters();
  }

  protected clearFilters(): void {
    this.selectedFilters = { wp: '', type: '', year: '' };
    this.applyFilters();
  }

  protected setSortOrder(order: string): void {
    this.sortOrder = order === 'oldest' ? 'oldest' : 'latest';
    this.applyFilters();
  }

  protected getActivityImage(activity: Activity): string {
    return activity.featured_image || this.fallbackImage;
  }

  protected hasActiveFilters(): boolean {
    return Object.values(this.selectedFilters).some((value) => value && value.length > 0);
  }

  protected activeFilterCount(): number {
    return Object.values(this.selectedFilters).filter(Boolean).length;
  }

  protected openFilterModal(): void {
    this.filterDialog?.nativeElement.showModal();
  }

  protected closeFilterModal(): void {
    this.filterDialog?.nativeElement.close();
  }

  protected onDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeFilterModal();
    }
  }

  protected countType(type: string): number {
    return this.allActivities().filter((activity) => activity.activity_type === type).length;
  }

  protected activityTypeLabels(): string[] {
    const typeMap = new Map<string, string>([
      ['training', 'Training'],
      ['workshop', 'Workshops'],
      ['meeting', 'Meetings'],
      ['field_demo', 'Field Demos'],
      ['community_engagement', 'Community'],
      ['event', 'Events']
    ]);

    const labels = Array.from(new Set(this.allActivities().map((activity) => activity.activity_type).filter(Boolean)))
      .sort();
    return labels.slice(0, 6).map((label) => typeMap.get(label) || this.formatTypeLabel(label));
  }

  protected getTypeColor(type: string): string {
    const palette: Record<string, string> = {
      Training: '#C89BE8',
      Workshops: '#7C4FA3',
      Meetings: '#BE5A2B',
      'Field Demos': '#3E6B45',
      Community: '#D4B06A',
      Events: '#26432B'
    };

    return palette[type] || '#C89BE8';
  }

  protected formatTypeLabel(value: string): string {
    return value
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  protected getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      Training: 'Learning sessions and capacity-building activities.',
      Workshops: 'Practical group sessions and co-design activities.',
      Meetings: 'Stakeholder and project coordination updates.',
      'Field Demos': 'Hands-on demonstrations in the field.',
      Community: 'Farmer and local engagement outreach.',
      Events: 'Special events, launches, and showcases.'
    };

    return descriptions[type] || 'Project activities and implementation updates.';
  }

  protected getDateText(dateValue?: string): string {
    if (!dateValue) {
      return 'Recent';
    }

    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime()) ? 'Recent' : parsed.toISOString().slice(0, 10);
  }

  protected trackByActivity = (_: number, activity: Activity): string => activity.slug || activity.id?.toString() || activity.title;

  private applyFilters(): void {
    let filtered = [...this.allActivities()];

    if (this.selectedFilters.wp) {
      filtered = filtered.filter((activity) => this.matchesFilter(activity.wp_tag, this.selectedFilters.wp));
    }

    if (this.selectedFilters.type) {
      filtered = filtered.filter((activity) => this.matchesFilter(activity.activity_type, this.selectedFilters.type));
    }

    if (this.selectedFilters.year) {
      filtered = filtered.filter((activity) => this.getActivityYear(activity.date) === this.selectedFilters.year);
    }

    filtered.sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      return this.sortOrder === 'latest' ? bd - ad : ad - bd;
    });
    this.filteredActivities.set(filtered);
  }

  private getAvailableValues(values: Array<string | undefined>): string[] {
    return Array.from(new Set(values
      .map((value) => value?.trim())
      .filter((value): value is string => !!value)))
      .sort((first, second) => first.localeCompare(second));
  }

  private matchesFilter(value: string | undefined, selectedValue: string): boolean {
    return this.normalizeFilterValue(value) === this.normalizeFilterValue(selectedValue);
  }

  private normalizeFilterValue(value: string | undefined): string {
    return (value || '').trim().toLowerCase().replace(/[_-]+/g, ' ');
  }

  private getActivityYear(dateValue?: string): string | null {
    const match = dateValue?.trim().match(/^(\d{4})/);
    return match ? match[1] : null;
  }
}
