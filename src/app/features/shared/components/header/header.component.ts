// ============================================================
// Smart Mushroom Kenya Pilot - Header Component
// ============================================================

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SOCIAL_LINKS } from '../../../core/constants/app.constants';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="site-header" role="banner">
      <div class="header-container">
        <div class="header-left">
          <div class="logo-group">
            <a [routerLink]="['/']" class="logo" aria-label="Smart Mushroom Kenya Pilot home">
              <img src="/images/logos/logogreenn.jpeg" alt="Smart Mushroom Kenya Pilot" class="logo-img bridge-logo" />
              <span class="logo-divider" aria-hidden="true"></span>
              <span class="logo-copy"><strong>SmartMushroom</strong></span>
            </a>
          </div>
        </div>

        <div class="brand-center" aria-label="Smart Mushroom Kenya Pilot">Smart Mushroom Kenya Pilot</div>

        <button class="mobile-toggle" type="button" (click)="toggleMobileMenu()" aria-label="Toggle navigation" aria-expanded="{{ mobileOpen }}">
          @if (!mobileOpen) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        </button>

        <nav class="main-nav" [class.open]="mobileOpen" aria-label="Main navigation">
          <ul class="nav-list">
            @for (item of navItems; track item.path) {
              <li class="nav-item">
                <a [routerLink]="[item.path]" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }" (click)="closeMobileMenu()">
                  {{ item.label }}
                </a>
              </li>
            }
            <li class="nav-item linkedin-nav">
              <a [href]="socialLinks.LINKEDIN" target="_blank" rel="noopener noreferrer" aria-label="Smart Mushroom on LinkedIn" title="Smart Mushroom on LinkedIn" (click)="closeMobileMenu()">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M5.2 3.5A2.4 2.4 0 1 1 .4 3.5a2.4 2.4 0 0 1 4.8 0ZM.7 8h4.5v13H.7V8Zm7.3 0h4.3v1.8h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.5 3 5.5 6.9V21h-4.5v-5.9c0-1.4 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21H8V8Z"/></svg>
                <span class="linkedin-label">LinkedIn</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #064e2f;
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, .16);
      box-shadow: 0 8px 24px rgba(3, 56, 43, .22);
    }

    .header-container {
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      position: relative;
      min-height: 92px;
    }

    .header-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      z-index: 2;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
    }

    .logo-divider { width: 1px; height: 38px; background: rgba(255, 255, 255, .32); }
    .logo-copy {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      line-height: 1;
    }
    .logo-copy strong {
      color: #d8e86b;
      font: 700 clamp(1.28rem, 1.65vw, 1.9rem)/1 'Avenir Next', 'Trebuchet MS', sans-serif;
      letter-spacing: 0.01em;
      text-shadow: 0 2px 12px rgba(0,0,0,.18);
    }

    .logo-img {
      display: block;
      width: auto;
      height: 68px;
    }

    .bridge-logo {
      height: 68px;
      max-width: 240px;
      object-fit: contain;
    }

    .brand-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #f0b45e;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
      display: none;
    }

    .main-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      z-index: 2;
    }

    .nav-list {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      width: 100%;
      gap: 6px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 8px 12px;
      color: #e8f2ed;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: none;
      border-radius: 999px;
      background: transparent;
      transition: color 0.2s ease, transform 0.2s ease;
      position: relative;
    }

    .nav-item a::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 5px;
      height: 2px;
      border-radius: 999px;
      background: #d97706;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.25s ease;
    }

    .nav-item a:hover {
      color: #f0b45e;
      background: transparent;
      transform: translateY(-1px);
    }

    .nav-item a:hover::after,
    .nav-item a.active::after {
      transform: scaleX(1);
    }

    .nav-item a.active {
      color: #f0b45e;
      background: transparent;
      box-shadow: none;
    }

    .linkedin-nav a {
      width: 38px;
      padding: 8px;
      color: #fff;
      background: #0a66c2;
      border-radius: 8px;
    }

    .linkedin-nav a:hover {
      color: #fff;
      background: #084d91;
    }

    .linkedin-nav a::after { display: none; }
    .linkedin-nav svg { width: 18px; height: 18px; }
    .linkedin-label { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

    .mobile-toggle {
      display: none;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, .28);
      border-radius: 10px;
      color: #ffffff;
      width: 42px;
      height: 42px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
      z-index: 2;
    }

    .mobile-toggle:hover {
      background: rgba(255, 255, 255, .1);
      border-color: #f0b45e;
    }

    .nav-item a:focus-visible,
    .mobile-toggle:focus-visible {
      outline: 2px solid #f0b45e;
      outline-offset: 3px;
      border-radius: 999px;
    }

    @media (max-width: 1100px) {
      .header-container {
        padding-inline: 18px;
      }

      .nav-item a {
        padding: 7px 10px;
        font-size: 0.74rem;
      }
    }

    @media (max-width: 980px) {
      .site-header {
        border-bottom-color: rgba(255, 255, 255, .16);
      }

      .brand-center {
        display: none;
      }

      .mobile-toggle {
        display: inline-flex;
      }

      .header-container {
        position: relative;
      }

      .main-nav {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        padding: 14px 18px 20px;
        background: #04382b;
        border: 1px solid rgba(255, 255, 255, .16);
        border-top: none;
        box-shadow: 0 20px 30px rgba(3, 56, 43, .3);
        display: none;
      }

      .main-nav.open {
        display: flex;
      }

      .nav-list {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
      }

      .linkedin-nav a { width: 100%; justify-content: flex-start; }
      .linkedin-label { position: static; width: auto; height: auto; margin: 0; overflow: visible; clip: auto; white-space: normal; }

      .nav-item a {
        width: 100%;
        justify-content: flex-start;
        padding: 12px 14px;
        font-size: 0.88rem;
        border-radius: 10px;
      }

      .nav-item a::after {
        left: 14px;
        right: 14px;
      }
    }

    @media (max-width: 640px) {
      .header-container {
        padding: 12px 16px;
        min-height: 78px;
      }

      .header-left {
        flex: 1;
        justify-content: flex-start;
      }

      .header-container { justify-content: space-between; }
      .logo { justify-content: flex-start; }
      .mobile-toggle { position: absolute; right: 16px; }

      .logo-group {
        gap: 8px;
      }

      .logo-img {
        height: 48px;
      }

      .bridge-logo {
        height: 52px;
        max-width: 170px;
      }

      .logo-copy strong { font-size: 1.18rem; }
      .logo-divider { height: 30px; }

      

      .main-nav {
        padding-inline: 14px;
      }
    }
  `]
})
export class HeaderComponent {
  protected mobileOpen = false;

  protected navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/smartmushroom-tech', label: 'SmartMushroom Tech' },
    { path: '/shop', label: 'SmartMushroom Shop' },
    { path: '/training-events', label: 'Farmers-Training' },
    { path: '/activities', label: 'News & Activities' }
  ];

  protected socialLinks = SOCIAL_LINKS;

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 980) {
      this.mobileOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileMenu(): void {
    this.mobileOpen = false;
  }

}