// ============================================================
// Smart Mushroom Kenya Pilot - Footer Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-ultimate" role="contentinfo">
      <div class="footer-container">
        <section class="footer-funding" aria-label="European Union funding">
          <a class="footer-funding-emblem" [routerLink]="['/partners/eu']" aria-label="European Union partner page">
            <img src="/images/logos/eu_emblem.svg" alt="European Union emblem" />
          </a>
          <div class="footer-funding-copy">
            <p class="footer-funding-title">Funded by the European Union</p>
            <p class="footer-funding-grant">Horizon Europe &middot; Grant Agreement No. 101299050</p>
          </div>
        </section>

        <div class="footer-reference-grid">
          <section class="footer-reference-column">
            <h3>Contacts &amp; Location</h3>
            <p class="footer-institution">Jomo Kenyatta University of Agriculture and Technology</p>
            <address class="footer-contact-details">
              <p>P.O. BOX: 62000-00200, Nairobi, Kenya.</p>
              <p><strong>Tel:</strong> +254 67 52181/4 LAN Ext 2814.</p>
              <p><strong>Email Us:</strong> <a href="mailto:info.jhub@jkuat.ac.ke">info.jhub@jkuat.ac.ke</a></p>
            </address>
          </section>

          <section class="footer-reference-column">
            <h3>Legal &amp; Compliance</h3>
            <p><a [routerLink]="['/privacy-ethics']">Privacy &amp; Ethics</a> - Outlines compliance with Kenya’s Data Protection Act 2019 and NACOSTI research clearance protocols.</p>
            <p><a href="/terms">Terms &amp; Conditions</a> - E-commerce fulfillment, product returns, and spawn replacement guidelines.</p>
          </section>

          <section class="footer-reference-column" aria-label="Project partners">
            <h3>Project Partners</h3>
            <div class="footer-disclosures">
              <a class="footer-logo-only" [routerLink]="['/partners/jkuat']" aria-label="JKUAT partner page"><img src="/images/logos/jkuat_logo.svg" alt="Jomo Kenyatta University of Agriculture and Technology logo" loading="lazy" /></a>
              <a class="footer-logo-only" [routerLink]="['/partners/jhub']" aria-label="JHUB Africa partner page"><img src="/images/logos/jhub_logo.svg" alt="JHUB Africa logo" loading="lazy" /></a>
              <a class="footer-logo-only" [routerLink]="['/partners/bridge-ai']" aria-label="BRIDGE-AI partner page"><img src="/images/logos/bridge_ai_logo.svg" alt="BRIDGE-AI logo" loading="lazy" /></a>
            </div>
          </section>
        </div>

        <div class="footer-bottom footer-reference-bottom">
          <p class="footer-copyright">© Developed by SmartMushroom Team 2026. All Rights Reserved.</p>
          <a href="#top" class="footer-back-top" (click)="scrollToTop($event)"><span>Back to Top</span><span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .footer-ultimate {
      --footer-bg: #064e3b;
      --footer-text: #f7faf8;
      --footer-text-strong: #ffffff;
      --footer-text-muted: #bdd3c9;
      --footer-text-light: #8fb5a6;
      --footer-border: rgba(255, 255, 255, .18);
      --footer-primary: #d97706;
      --footer-primary-light: #f0b45e;
      --footer-primary-dim: rgba(255, 255, 255, 0.1);
      --footer-shadow: 0 -4px 40px rgba(0, 0, 0, 0.18);
      --footer-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      background: var(--footer-bg);
      padding: 48px 24px 20px;
      margin-top: 72px;
      font-family: var(--footer-font);
      border-top: 1px solid var(--footer-border);
      box-shadow: var(--footer-shadow);
      position: relative;
      color: var(--footer-text);
    }

    .footer-ultimate::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--footer-primary), var(--footer-primary-light), var(--footer-primary), transparent);
      opacity: 0.9;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .footer-logos-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: center;
      gap: 20px 32px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--footer-border);
    }

    .footer-logo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 82px;
    }

    .footer-logo-item-bridge {
      min-width: 0;
    }

    .footer-description {
      max-width: 520px;
      grid-column: 1 / -1;
      justify-self: center;
      margin: 0;
      color: var(--footer-text-muted);
      font-size: .82rem;
      line-height: 1.65;
      text-align: center;
    }

    .footer-logo {
      display: block;
      height: 58px;
      width: auto;
      opacity: 0.9;
      transition: opacity 0.3s ease, transform 0.3s ease;
      object-fit: contain;
    }

    .footer-logo:hover {
      opacity: 1;
      transform: scale(1.02);
    }

    .footer-logo-bridge {
      height: 78px;
    }

    .footer-logo-item-eu { min-width: 0; }
    .footer-logo-eu { height: 70px; }

    .footer-logo-item-partner {
      min-width: 0;
      min-height: 82px;
      padding: 6px 12px;
      border-radius: 8px;
      transition: background-color 0.25s ease, transform 0.25s ease;
    }

    .footer-logo-item-partner:hover {
      background: var(--footer-primary-dim);
      transform: translateY(-2px);
    }

    .footer-logo-item-partner:focus-visible {
      outline: 2px solid var(--footer-primary);
      outline-offset: 3px;
    }

    .footer-logo-item-mush {
      grid-column: 1 / -1;
      justify-self: center;
      width: min(100%, 220px);
    }

    .footer-logo-partner {
      height: 68px;
      max-width: 175px;
    }

    .footer-middle {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 32px;
      padding: 32px 0 28px;
      border-bottom: 1px solid var(--footer-border);
      text-align: center;
    }

    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
    }

    .footer-col-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--footer-text-strong);
      margin: 0 0 12px 0;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.7;
    }

    .footer-col-title::after {
      content: '';
      display: block;
      width: 28px;
      height: 2.5px;
      background: var(--footer-primary);
      margin-top: 6px;
      border-radius: 2px;
    }

    .footer-col-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .footer-col-links a {
      color: var(--footer-text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 450;
      transition: all 0.25s ease;
      padding: 5px 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: relative;
      opacity: 0.8;
    }

    .footer-col-links a::before {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--footer-primary);
      transition: width 0.3s ease;
    }

    .footer-col-links a:hover {
      color: var(--footer-primary);
      opacity: 1;
      transform: translateY(-1px);
    }

    .footer-col-links a:hover::before {
      width: 100%;
    }

    .footer-social-icon {
      width: 16px;
      height: 16px;
      opacity: 0.5;
      flex-shrink: 0;
      transition: opacity 0.3s ease;
      color: var(--footer-text-muted);
    }

    .footer-col-links a:hover .footer-social-icon {
      opacity: 0.9;
      color: var(--footer-primary);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 18px;
      flex-wrap: wrap;
      gap: 10px;
      text-align: left;
    }

    .footer-copyright {
      font-size: 0.75rem;
      font-weight: 450;
      color: var(--footer-text-muted);
      margin: 0;
      opacity: 0.7;
    }

    .footer-bottom-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .footer-builders {
      color: var(--footer-text-muted);
      font-size: .75rem;
      opacity: .7;
    }

    .footer-builders a {
      color: inherit;
      text-decoration: none;
    }

    .footer-builders a:hover {
      color: var(--footer-primary);
      opacity: 1;
    }

    .footer-badge {
      font-size: 0.55rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--footer-primary);
      background: var(--footer-primary-dim);
      padding: 3px 14px;
      border-radius: 40px;
      border: 1px solid rgba(11, 77, 59, 0.12);
      opacity: 0.8;
    }

    .footer-sep {
      color: var(--footer-border);
      font-size: 0.7rem;
      opacity: 0.5;
    }

    .footer-credit {
      font-size: 0.75rem;
      font-weight: 450;
      color: var(--footer-text-muted);
      margin: 0;
      opacity: 0.7;
    }

    .footer-back-top {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--footer-text-muted);
      text-decoration: none;
      font-size: 0.72rem;
      font-weight: 500;
      padding: 5px 14px 5px 10px;
      border-radius: 40px;
      background: var(--footer-primary-dim);
      border: 1px solid var(--footer-border);
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .footer-back-top svg {
      width: 14px;
      height: 14px;
      transition: transform 0.3s ease;
      color: var(--footer-text-muted);
    }

    .footer-back-top:hover {
      opacity: 1;
      color: var(--footer-primary);
      border-color: var(--footer-primary);
      background: var(--footer-primary-dim);
      transform: translateY(-2px);
    }

    .footer-back-top:hover svg {
      transform: translateY(-3px);
      color: var(--footer-primary);
    }

    .footer-col-links a:focus-visible,
    .footer-back-top:focus-visible {
      outline: 2px solid var(--footer-primary);
      outline-offset: 3px;
      border-radius: 2px;
    }

    .footer-funding {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      min-height: 132px;
      margin-bottom: 30px;
      padding: 18px 28px;
      border: 1px solid rgba(6, 78, 59, .16);
      border-radius: 8px;
      background: #f7faf8;
      color: #17372e;
      text-align: center;
    }
    .footer-funding-emblem { display: grid; flex: 0 0 190px; place-items: center; }
    .footer-funding-emblem img { display: block; width: 100%; height: 76px; object-fit: contain; }
    .footer-funding-copy { min-width: 0; }
    .footer-funding-label { margin: 0 0 5px; color: #567064; font-size: .68rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .footer-funding-title { margin: 0; color: #17372e; font-size: 1.1rem; font-weight: 750; line-height: 1.35; }
    .footer-funding-grant { margin: 5px 0 0; color: #496157; font-size: .84rem; line-height: 1.5; }
    .footer-reference-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px; padding: 14px 0 30px; border-bottom: 1px solid var(--footer-border); text-align: center; }
    .footer-reference-column { min-width: 0; padding: 0 10px; }
    .footer-reference-column h3 { margin: 0 0 18px; color: var(--footer-primary-light); font-size: .78rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
    .footer-reference-column h3::after { content: ''; display: block; width: 34px; height: 2px; margin: 8px auto 0; background: var(--footer-primary-light); }
    .footer-reference-column p { max-width: 340px; margin: 0 auto 14px; color: var(--footer-text-muted); font-size: .84rem; line-height: 1.7; }
    .footer-reference-column .footer-institution { color: var(--footer-text-strong); font-weight: 650; }
    .footer-contact-details { color: var(--footer-text-muted); font-size: .84rem; font-style: normal; line-height: 1.7; }
    .footer-contact-details p { margin-bottom: 8px; }
    .footer-reference-column strong { color: var(--footer-text-strong); }
    .footer-reference-column a { color: var(--footer-text-muted); text-decoration: underline; text-decoration-color: rgba(240,180,94,.6); text-underline-offset: 3px; }
    .footer-reference-column a:hover { color: var(--footer-primary-light); }
    .footer-disclosures { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px; }
    .footer-logo-only { display: grid; place-items: center; width: 112px; height: 86px; padding: 10px; border: 1px solid var(--footer-border); border-radius: 8px; background: #fff; box-shadow: 0 10px 22px rgba(0,0,0,.14); transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
    .footer-logo-only:hover { transform: translateY(-3px); border-color: var(--footer-primary-light); }
    .footer-logo-only:hover { box-shadow: 0 14px 28px rgba(0,0,0,.22); }
    .footer-logo-only img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .footer-reference-bottom { justify-content: center; padding-top: 18px; text-align: center; }
    .footer-reference-bottom .footer-bottom-right { justify-content: center; }

    @media (max-width: 1024px) {
      .footer-logos-row {
        gap: 16px 18px;
      }

      .footer-middle {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
      }

      .footer-logo-item {
        min-height: 72px;
      }

      .footer-logo-item-bridge {
        min-width: 0;
      }

    }

    @media (max-width: 768px) {
      .footer-ultimate {
        padding: 32px 16px 16px;
        margin-top: 48px;
      }

      .footer-logos-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 12px;
        padding-bottom: 20px;
      }

      .footer-logo {
        height: 44px;
      }

      .footer-logo-bridge {
        height: 54px;
      }

      .footer-description {
        flex: 1 1 100%;
        max-width: 560px;
        text-align: center;
      }

      .footer-logo-eu {
        height: 48px;
      }

      .footer-logo-item-partner {
        min-width: 0;
        min-height: 58px;
      }

      .footer-logo-partner {
        height: 48px;
        max-width: 140px;
      }

      .footer-middle {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
        padding: 24px 0 20px;
        text-align: center;
      }

      .footer-col {
        align-items: center;
      }

      .footer-col-title::after {
        margin: 6px auto 0;
      }

      .footer-col-links {
        align-items: center;
      }

      .footer-col-links a {
        font-size: 0.8rem;
        padding: 4px 0;
      }

      .footer-col-links a::before {
        display: none;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: 6px;
      }

      .footer-bottom-right {
        justify-content: center;
      }

      .footer-reference-grid { grid-template-columns: 1fr; gap: 24px; padding-top: 8px; }
      .footer-reference-column { padding: 0; }
      .footer-reference-column h3 { margin-bottom: 12px; }
      .footer-reference-column p { font-size: .82rem; }
      .footer-funding { flex-direction: column; gap: 8px; min-height: 0; margin-bottom: 24px; padding: 18px 16px; }
      .footer-funding-emblem { flex-basis: auto; width: min(100%, 180px); }
      .footer-funding-emblem img { height: 62px; }
      .footer-funding-title { font-size: 1rem; }
      .footer-funding-grant { font-size: .78rem; }
      .footer-disclosures { gap: 8px; }
      .footer-logo-only { width: 88px; height: 72px; padding: 8px; }

      .footer-copyright,
      .footer-credit {
        font-size: 0.7rem;
      }

      .footer-back-top span {
        display: none;
      }

      .footer-back-top svg {
        width: 18px;
        height: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .footer-logo:hover,
      .footer-logo-item-partner:hover,
      .footer-col-links a:hover,
      .footer-back-top:hover,
      .footer-back-top:hover svg {
        transform: none !important;
      }

      .footer-col-links a::before,
      .footer-back-top,
      .footer-logo {
        transition: none !important;
      }
    }

    @media (prefers-contrast: high) {
      .footer-ultimate {
        border-top: 2px solid var(--footer-primary);
      }

      .footer-col-title::after {
        background: var(--footer-primary);
      }

      .footer-col-links a::before {
        background: var(--footer-primary);
      }

      .footer-badge {
        border-color: var(--footer-primary);
      }
    }

    @media print {
      .footer-ultimate {
        background: #ffffff !important;
        border-top: 1px solid #ddd !important;
        padding: 20px 0 !important;
        margin-top: 40px !important;
        box-shadow: none !important;
      }

      .footer-ultimate::before,
      .footer-back-top,
      .footer-social-icon,
      .footer-badge {
        display: none !important;
      }

      .footer-col-links a {
        color: #333 !important;
      }
    }
  `]
})
export class FooterComponent {
  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}