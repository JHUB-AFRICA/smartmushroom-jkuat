// ============================================================
// BRIDGE-AI - Home Component
// ============================================================

import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { EventService } from '../../../../services/event.service';
import { Activity } from '../../../core/models/activity.model';
import { Event } from '../../../core/models/event.model';
import { APP } from '../../../core/constants/app.constants';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { TeamService } from '../../../../services/team.service';
import { TeamMember } from '../../../core/models/team.model';
import { Router } from '@angular/router';
import { ShopCartService, ShopProduct, SHOP_PRODUCTS } from '../shop/shop.component';

type SmartMushroomFeedItem = {
  title: string;
  date: string;
  image?: string;
  kind: 'activity' | 'event';
  slug: string;
  label: string;
  summary?: string;
};

@Component({
  selector: 'app-home-redesigned',
  imports: [CommonModule, RouterModule],
  template: `
    <main class="redesign-home">
      <section class="redesign-hero"><div class="hero-wash" aria-hidden="true"></div><div class="hero-content"><h1>Climate-Smart Mushroom Farming Powered by <em>IoT &amp; AI</em></h1><p>Revolutionizing African agriculture through passive pumice architecture, high-yield biological strains, offline voice AI, and real-time environmental automation.</p><div class="hero-buttons"><a class="primary-action" routerLink="/smartmushroom-tech">Explore SmartMushroom Tech &#8594;</a><a class="secondary-action" routerLink="/shop">SmartMushroom Marketplace &#8594;</a></div></div></section>
      <section class="redesign-partners"><h2>A connected network for <em>local impact</em>.</h2><div class="logo-marquee"><div class="logo-track">@for (partner of marqueePartners; track $index) {<a [routerLink]="['/partners', partner.slug]" [attr.aria-label]="'Open partner profile for ' + partner.name">@if (partner.logo) {<img [src]="partner.logo" [alt]="partner.name + ' logo'" loading="lazy">} @else {<b>{{ partner.name }}</b>}<span>{{ partner.name }}</span></a>}</div></div></section>
      <section class="redesign-innovation"><div class="innovation-block" aria-hidden="true"><b>IoT</b><b>AI</b><b>GROW</b></div><div><h2>Passive first, <em>smart second.</em></h2><p>We redesigned our grow rooms around a simple principle: reduce energy demand before adding automation. Pumice walls, passive natural cooling and connected sensing make off-grid mushroom farming more practical for smallholder farmers.</p><a class="gold-link" routerLink="/smartmushroom-tech">See the Smart Mushroom system &#8594;</a></div></section>
      <section class="redesign-products"><p class="eyebrow">Built for the field</p><h2>Tools that turn good ideas into <em>good harvests.</em></h2><div class="product-row">@for (product of products; track product.title) {<a [routerLink]="product.route"><small>{{ product.index }}</small><strong>{{ product.icon }} {{ product.title }}</strong><span>{{ product.description }}</span><i aria-hidden="true">&#8594;</i></a>}</div></section>
      <section class="redesign-impact"><p class="eyebrow">Live impact</p><h2>Progress you can <em>measure.</em></h2><p>Our counters track people reached through training, community practice and farmer-led experimentation.</p><div class="counter-row">@for (counter of counters; track counter.label) {<div><strong>{{ counter.value }}</strong><span>{{ counter.label }}</span></div>}</div></section>
      <section class="redesign-team"><p class="eyebrow">Project developers &amp; leadership</p><h2>The minds making the <em>future practical.</em></h2><div class="team-row">@for (member of team(); track member.id ?? member.name) {<article>@if (member.photo) {<img [src]="member.photo" [alt]="member.name" loading="lazy">}<h3>{{ member.name }}</h3><p>{{ member.role }}</p><small>{{ member.affiliation || 'BRIDGE-AI' }}</small></article>} @empty {<p>Our project team profiles will appear here shortly.</p>}</div></section>
    </main>
  `,
  styles: [`
    :host{display:block;--forest:#183d31;--deep:#102d25;--lime:#d8e86b;--gold:#d3a64e;--cream:#f7f2e6;--clay:#efe6ce;--muted:#617269;font-family:'Avenir Next','Trebuchet MS',sans-serif;color:#1b2d27}.redesign-home{overflow:hidden;background:var(--cream)}.redesign-hero{min-height:650px;display:grid;align-items:center;position:relative;color:#fffdf7;background:var(--deep)}.hero-wash{position:absolute;inset:0;z-index:0;background:linear-gradient(90deg,rgba(16,45,37,.97),rgba(16,45,37,.62)),url('/images/smartmushrooms/q.jpeg') center/cover}.hero-content{position:relative;z-index:1;width:min(1180px,calc(100% - 48px));margin:auto;padding:110px 0}.eyebrow{margin:0 0 16px;color:var(--gold);font:700 .72rem monospace;letter-spacing:.12em;text-transform:uppercase}h1,h2,h3{font-family:Georgia,serif}h1,h2{font-weight:400;line-height:.98}h1{max-width:780px;font-size:clamp(3.2rem,7vw,6.8rem);margin:0 0 24px}h2{font-size:clamp(2.2rem,4vw,4.1rem);margin:0 0 20px}em{color:var(--lime);font-style:normal}.hero-content>p:not(.eyebrow){max-width:560px;color:rgba(255,253,247,.8);line-height:1.7;margin-bottom:30px}.primary-action,.gold-link{display:inline-block;padding:14px 20px;text-decoration:none;font-weight:700}.primary-action{background:var(--lime);color:var(--deep)}.redesign-partners,.redesign-products,.redesign-team{padding:100px max(24px,calc((100vw - 1180px)/2))}.redesign-partners{background:var(--cream)}.logo-marquee{width:100vw;margin-left:calc((1180px - 100vw)/2);overflow:hidden;border-block:1px solid #d8cfba}.logo-track{display:flex;width:max-content;animation:marquee 34s linear infinite}.logo-track a{display:grid;grid-template-columns:52px 150px;align-items:center;gap:14px;width:230px;padding:22px 24px;border-right:1px solid #d8cfba;color:var(--forest);text-decoration:none}.logo-track img,.logo-track b{width:52px;height:42px;object-fit:contain}.logo-track b{display:grid;place-items:center;background:var(--forest);color:var(--lime);font-size:.6rem;text-align:center}.logo-track span{font-weight:700;font-size:.82rem;line-height:1.15}@keyframes marquee{to{transform:translateX(-50%)}}.redesign-innovation{display:grid;grid-template-columns:1fr 1fr;gap:9vw;align-items:center;padding:110px max(24px,calc((100vw - 1180px)/2));background:var(--forest);color:#fffdf7}.redesign-innovation p:not(.eyebrow){max-width:580px;color:rgba(255,253,247,.72);line-height:1.75}.innovation-block{display:grid;grid-template-columns:1fr 1fr;gap:10px;transform:rotate(-4deg)}.innovation-block b{display:grid;place-items:center;min-height:180px;background:var(--lime);color:var(--deep);font:700 3rem Georgia,serif}.innovation-block b:nth-child(2){margin-top:30px;background:var(--gold)}.innovation-block b:last-child{grid-column:span 2;background:#f0eee1;color:var(--forest)}.gold-link{padding-left:0;color:var(--gold)}.redesign-products{background:var(--clay)}.product-row,.counter-row,.team-row{display:grid;gap:14px}.product-row{grid-template-columns:repeat(4,1fr)}.product-row a{position:relative;min-height:260px;padding:24px;background:#fffdf7;color:var(--deep);text-decoration:none;border-top:4px solid var(--forest)}.product-row a:hover{background:var(--lime)}.product-row small,.team-row small{display:block;color:var(--gold);font:700 .65rem monospace}.product-row strong{display:block;margin:42px 0 12px;font:700 1.3rem Georgia,serif}.product-row span{color:var(--muted);font-size:.82rem;line-height:1.6}.product-row i{position:absolute;right:20px;bottom:18px}.redesign-impact{padding:110px max(24px,calc((100vw - 1180px)/2));background:var(--deep);color:#fffdf7}.redesign-impact>p:not(.eyebrow){color:rgba(255,255,255,.7);max-width:600px}.counter-row{grid-template-columns:repeat(4,1fr);margin-top:50px;border-top:1px solid rgba(255,255,255,.2)}.counter-row div{padding:26px 18px;border-right:1px solid rgba(255,255,255,.2)}.counter-row strong{display:block;color:var(--lime);font:400 3.8rem Georgia,serif}.counter-row span{color:rgba(255,255,255,.68);font-size:.78rem}.redesign-team{background:var(--cream)}.team-row{grid-template-columns:repeat(4,1fr)}.team-row article{background:#fffdf7}.team-row img{width:100%;aspect-ratio:1;object-fit:cover}.team-row h3,.team-row p,.team-row small{margin:14px 18px 0}.team-row p{color:var(--muted);font-size:.78rem}.team-row small{padding-bottom:18px}@media(max-width:800px){.redesign-innovation{grid-template-columns:1fr}.product-row,.team-row{grid-template-columns:repeat(2,1fr)}.counter-row{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.hero-content,.redesign-partners,.redesign-products,.redesign-team,.redesign-innovation,.redesign-impact{padding-left:20px;padding-right:20px}.logo-marquee{margin-left:-20px}.product-row,.team-row{grid-template-columns:1fr}}
  `]
})
export class HomeComponent {
  private readonly teamService = inject(TeamService);
  protected readonly team = signal<TeamMember[]>([]);
  protected readonly partners = [{ slug:'eu',name:'European Union (EU)',logo:'/images/logos/eu_emblem.svg' },{ slug:'bridge-ai',name:'BRIDGE-AI',logo:'/images/logos/bridge_ai_logo.svg' },{ slug:'jkuat',name:'JKUAT',logo:'/images/webimages/partners/jkuat-logo.png' },{ slug:'mush&',name:'Mush&',logo:'/images/logos/mush.jpeg' },{ slug:'koica',name:'KOICA',logo:'/images/logos/koica.jpeg' },{ slug:'gdih',name:'gDIH',logo:'/images/logos/gdih.jpeg' },{ slug:'jhub',name:'JHUB Africa',logo:'/images/logos/jhub_logo.svg' }];
  protected readonly marqueePartners = [...this.partners,...this.partners];
  protected readonly products = [{ index:'01 / GROWING SYSTEM',icon:'◒',title:'Smart Mushroom',description:'Sensor-led growing guidance for more stable conditions.',route:'/smartmushroom-tech' },{ index:'02 / LEARNING',icon:'✦',title:'Farmer training',description:'Practical workshops for digital farming skills.',route:'/training-events' },{ index:'03 / REPLICATION',icon:'↗',title:'Replication toolkit',description:'Open resources for adapting climate-smart innovation.',route:'/replication-toolkit' },{ index:'04 / COMMUNITY',icon:'◎',title:'Community practice',description:'A network of builders, researchers, farmers and SMEs.',route:'/community-practice' }];
  protected readonly counters = [{value:'0',label:'Farmers trained'},{value:'0',label:'Grow houses connected'},{value:'0',label:'Training sessions'},{value:'0',label:'SMEs supported'}];
  constructor(){this.teamService.getVisibleTeamMembers().subscribe({next:members=>this.team.set(members),error:()=>this.team.set([])});}
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="home-page">
      <section class="hero" id="heroSection">
        <div class="hero-image-wrapper" id="heroImageWrapper">
          <div class="hero-slide-bg active" [style.backgroundImage]="'url(' + activeHeroImage() + ')'" aria-hidden="true"></div>
        </div>

        <div class="hero-content-wrapper">
          <div class="hero-content">
            <h1>Climate-Smart Mushroom Farming Powered by IoT &amp; AI</h1>
            <p class="hero-description">Revolutionizing African agriculture through passive pumice architecture, high-yield biological strains, offline voice AI, and real-time environmental automation.</p>
            <div class="hero-buttons">
              <a [routerLink]="['/smartmushroom-tech']" class="btn-primary">Explore SmartMushroom Tech <span aria-hidden="true">→</span></a>
              <a [routerLink]="['/shop']" class="btn-secondary">SmartMushroom Marketplace <span aria-hidden="true">↗</span></a>
            </div>

          </div>
        </div>
      </section>

      <section class="partner-network-section" aria-labelledby="partner-network-title">
        <div class="container">
          <div class="section-header partner-network-heading">
            <h2 id="partner-network-title">A connected network for <span class="highlight">local impact.</span></h2>
          </div>
        </div>
        <div class="partner-marquee" aria-label="SmartMushroom partners">
          <div class="partner-track">
            @for (partner of marqueePartners; track $index) {
              <a [routerLink]="['/partners', partner.slug]" [attr.aria-label]="'Open partner profile for ' + partner.name">
                @if (partner.logo) { <img [src]="partner.logo" [alt]="partner.name + ' logo'" loading="lazy"> }
                @else { <span class="partner-placeholder">{{ partner.name }}</span> }
                <strong>{{ partner.name }}</strong>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="innovation-highlight-section">
        <div class="container innovation-highlight-grid">
          <div class="innovation-highlight-visual" aria-hidden="true">
            <span>IoT</span><span>AI</span><strong>GROW</strong>
          </div>
          <div class="innovation-highlight-copy">
            <h3>Rethinking the grow room: why pumice outperforms metal containers</h3>
            <p>Early automated prototypes revealed that active cooling in metallic containers consumed excessive electricity, proving that smart does not mean sustainable. At JKUAT, we redesigned our grow rooms around a passive-first, smart-second principle. Our porous pumice wall structure uses natural thermal mass and evaporative cooling to cut power draw and make off-grid solar operation viable for smallholder farmers across Kenya.</p>
            <a class="innovation-link" [routerLink]="['/smartmushroom-tech']">Explore the SmartMushroom system <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section class="featured-products-section" id="shop">
        <div class="container">
          <div class="section-header featured-products-heading">
            <p class="section-kicker">SmartMushroom Marketplace</p>
          </div>
          <div class="featured-products-track" aria-label="Featured shop products">
            @for (product of featuredProducts; track product.id) {
              <article class="featured-product-card">
                <img [src]="product.image" [alt]="product.name" loading="lazy" />
                @if (product.badge) { <span class="product-badge">{{ product.badge }}</span> }
                <div class="featured-product-copy"><p>{{ product.category }}</p><h3>{{ product.name }}</h3><span>KSh {{ product.price | number }} / {{ product.unit }}</span><button type="button" class="add-to-bag-button" [class.added-to-cart]="isInCart(product)" (click)="addToBag(product)">{{ isInCart(product) ? 'Added to cart' : 'Add to cart' }} <span aria-hidden="true">{{ isInCart(product) ? '✓' : '+' }}</span></button></div>
              </article>
            }
          </div>
          <div class="featured-products-actions"><button type="button" class="bag-button" (click)="openBag()">Open Cart ({{ cartCount() }})</button><a [routerLink]="['/shop']" class="catalog-link">View full marketplace <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section class="activity-section latest-feed-section" id="latest">
        <div class="container">
          <div class="section-header">
            <h2>News, learning, and <span class="highlight">field activity.</span></h2>
          </div>

          <div class="activity-track" aria-label="Latest SmartMushroom news and activities">
            @for (item of latestFeed(); track item.kind + item.slug) {
              <a class="activity-item" [routerLink]="item.kind === 'activity' ? ['/activities', item.slug] : ['/training-events', item.slug]" [attr.aria-label]="'Open ' + item.label + ': ' + item.title">
                <div class="activity-img"><img [src]="item.image || heroFallbackImage()" [alt]="item.title" loading="lazy"></div>
                <div class="activity-copy"><div class="activity-meta"><span class="date">{{ item.date }}</span><span class="tag">{{ item.label }}</span></div><h4>{{ item.title }}</h4><p>{{ item.summary }}</p></div>
              </a>
            } @empty { <p class="feed-empty">New SmartMushroom updates are on the way.</p> }
          </div>
          <a [routerLink]="['/activities']" class="view-all-link">View all news and activities <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section class="live-impact-section">
        <div class="container">
          <div class="section-header live-impact-heading">
            <p class="section-kicker">Live impact</p>
          </div>
          <div class="live-impact-grid">
            @for (counter of impactCounters; track counter.label) {
              <article><strong>{{ counter.value }}</strong><span>{{ counter.label }}</span></article>
            }
          </div>
        </div>
      </section>

      <section class="home-team-section" aria-labelledby="home-team-title">
        <div class="container">
          <div class="section-header"><p class="section-kicker">Project developers &amp; leadership team</p></div>
          <div class="home-team-grid">
            @for (member of team(); track member.id ?? member.name) {
              <article class="home-team-card"><div class="home-team-photo">@if (member.photo) { <img [src]="member.photo" [alt]="member.name" loading="lazy"> }<div class="home-team-socials">@if (member.link) { <a [href]="member.link" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Open LinkedIn profile for ' + member.name"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a> } @if (member.website) { <a [href]="member.website" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Open website for ' + member.name"><i class="fas fa-globe" aria-hidden="true"></i></a> }</div></div><h3>{{ member.name }}</h3><p>{{ member.role }}</p><small>{{ member.affiliation || 'BRIDGE-AI' }}</small></article>
            } @empty { <p>Our project team profiles will appear here shortly.</p> }
          </div>
        </div>
      </section>

      <section class="cta-section" id="connect">
        <div class="container">
          <h2>Stay Connected</h2>
          <p>Follow our journey and be a part of the Smartmushroom community.</p>
          <div class="cta-buttons">
            <a [routerLink]="['/contact']" class="btn-primary btn-primary-two">
              <i class="fas fa-envelope btn-icon"></i>
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: var(--color-bg-clay);
      color: var(--color-text-main);
      font-family: var(--font-body);
    }

    .home-page {
      background: #f7f2e6;
      color: #2d3d35;
      line-height: 1.7;
      overflow-x: clip;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
    }

    .hero {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 100vh;
      background: #16281a;
    }

    .hero-image-wrapper {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .hero-slide-bg {
      position: absolute;
      inset: 0;
      background-image: url('/images/smartmushrooms/q.jpeg');
      background-size: cover;
      background-position: center;
      opacity: 0.94;
      filter: saturate(1.2) contrast(1.1) brightness(.86);
      transform: translate3d(0, var(--hero-parallax, 0px), 0) scale(1.08);
      transition: background-image 1.8s ease, opacity 1.8s ease, transform 0.08s linear;
    }

    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(6, 78, 59, 0.64);
      z-index: 1;
    }

    .hero-content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 900px;
      padding: 60px 40px;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3.6rem;
      font-weight: 900;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }

    .hero-sub {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      margin-bottom: 6px;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.02em;
    }

    .hero-highlight-title {
      font-size: 2.8rem;
      margin-top: 4px;
      margin-bottom: 0;
      font-weight: 800;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -0.02em;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }

    .highlight {
      color: #c89be8;
      font-weight: 900;
    }

    .highlight.purple {
      color: #c89be8;
    }

    .hero-description {
      font-size: 1.02rem;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.8;
      margin: 16px auto 28px;
      max-width: 680px;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    }

    .hero-badge {
      display: inline-block;
      padding: 4px 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .badge-text {
      color: #c89be8;
    }

    .hero-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary,
    .btn-light {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .btn-primary {
      background: #d8e86b;
      color: #102d25;
      border: none;
      box-shadow: 0 14px 34px rgba(6, 78, 59, 0.36);
    }

    .btn-primary:hover {
      background: #eff69b;
      transform: translateY(-3px);
    }

    .btn-primary-two {
      background: #7c4fa3;
    }

    .btn-secondary {
      background: transparent;
      color: #fff;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      border-color: #fff;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-3px);
    }

    .btn-light {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
    }

    .btn-light:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .btn-icon {
      font-size: 1rem;
    }

    html {
      scroll-padding-top: calc(var(--site-header-offset, 92px) + var(--section-nav-height, 52px) + 20px);
    }

    .partner-network-section { padding: 84px 0 0; background: #26432b; color: #fffdf7; }
    .partner-network-heading { margin-bottom: 34px; }
    .partner-network-heading h2 { max-width: 760px; margin-inline: auto; color: #f7f2e6 !important; text-shadow: 0 2px 14px rgba(16,45,37,.3); }
    .partner-network-heading .highlight { color: #d8e86b !important; }
    .partner-marquee { overflow: hidden; border-block: 1px solid #e1d8c0; background: #fff; }
    .partner-track { display: flex; width: max-content; animation: partner-marquee 48s linear infinite; }
    .partner-track a { display: grid; grid-template-columns: 104px 180px; align-items: center; gap: 20px; width: 330px; min-height: 146px; padding: 26px 30px; border-right: 1px solid #ecebe6; color: #17241b; text-decoration: none; }
    .partner-track img, .partner-placeholder { width: 104px; height: 82px; object-fit: contain; }
    .partner-placeholder { display: grid; place-items: center; padding: 8px; background: #26432b; color: #d8e86b; font-size: .68rem; font-weight: 800; text-align: center; }
    .partner-track strong { font-size: .88rem; line-height: 1.2; }
    .partner-track a:focus-visible { outline: 3px solid #c89b3c; outline-offset: -3px; }
    @keyframes partner-marquee { to { transform: translateX(-50%); } }

    .section-nav {
      position: sticky;
      top: var(--site-header-offset, 80px);
      z-index: 40;
      background: rgba(255, 253, 247, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #e1d8c0;
    }

    .section-nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .section-nav {
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .section-nav-inner {
        width: max-content;
        min-width: 100%;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
    }

    .section-nav a {
      display: inline-flex;
      align-items: center;
      padding: 14px 20px;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #6e7767;
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: all 0.25s ease;
    }

    .section-nav a:hover,
    .section-nav a.active {
      color: #26432b;
      border-bottom-color: #c89b3c;
    }

    .pilot-section,
    .challenge-section,
    .jkuat-section,
    .activity-section,
    .funding-section {
      padding: 80px 0;
      scroll-margin-top: calc(var(--site-header-offset, 92px) + var(--section-nav-height, 52px) + 18px);
    }

    .pilot-section {
      background: #f7f2e6;
    }

    .section-header {
      max-width: 720px;
      margin: 0 auto 48px;
      text-align: center;
    }

    .section-header h2 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: 0;
    }

    .section-header p {
      max-width: 620px;
      margin: 16px auto 0;
      font-size: 1rem;
      color: #43534a;
      line-height: 1.65;
      font-weight: 400;
    }

    .varieties-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(260px, .85fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .variety-card {
      display: flex;
      min-height: 250px;
      flex-direction: column;
      padding: 18px;
      border: 1px solid #e2e5d8;
      border-radius: 14px;
      background: #fffdf7;
      color: #24352e;
      text-decoration: none;
      box-shadow: 0 14px 30px rgba(22, 40, 26, .12);
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .variety-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 22px 42px rgba(22, 40, 26, .2);
      border-color: #aeb879;
    }

    .variety-card-featured { grid-row: span 2; min-height: 520px; padding: 22px; }
    .variety-card img { order: 0; width: 100%; height: 150px; margin: 0 0 18px; border-radius: 9px; object-fit: cover; }
    .variety-card-featured img { flex: 1; min-height: 290px; height: auto; margin-bottom: 22px; }
    .variety-card-content { order: 1; }
    .variety-number { display: block; margin-bottom: 9px; color: #59600f; font-size: .63rem; font-weight: 800; letter-spacing: .1em; line-height: 1.35; }
    .variety-card h3 { margin: 0 0 10px; color: #17241b; font-size: 1.25rem; font-weight: 800; line-height: 1.25; }
    .variety-card p { margin: 0; color: #43534a; font-size: .86rem; line-height: 1.65; }
    .variety-card-footer { order: 2; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 18px; color: #43534a; font-size: .75rem; font-weight: 700; }
    .variety-card-footer strong { padding: 8px 14px; border-radius: 999px; background: #dce68a; color: #17241b; font-size: .7rem; font-weight: 800; white-space: nowrap; }

    .impact-section { padding: 80px 0; background: #16281a; }
    .impact-section .section-header h2 { color: #fff; }
    .impact-section .section-header p { color: rgba(247, 242, 230, .7); }
    .impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(247, 242, 230, .16); }
    .impact-grid article { min-height: 190px; padding: 30px; text-align: left; background: #16281a; }
    .impact-index { display: block; margin-bottom: 22px; color: #d8e86b; font: 600 .64rem 'IBM Plex Mono', monospace; letter-spacing: .12em; }
    .impact-grid strong { display: block; color: #fff; font-size: 1.45rem; line-height: 1.2; }
    .impact-grid article > span:last-child { display: block; max-width: 270px; margin-top: 10px; color: rgba(247, 242, 230, .66); font-size: .82rem; line-height: 1.6; }

    .pilot-card {
      flex: 1 1 220px;
      max-width: 280px;
      min-width: 200px;
      background: #fffdf7;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e1d8c0;
      transition: all 0.4s ease;
    }

    .pilot-card:hover {
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      border-color: #7c4fa3;
      transform: translateY(-4px);
    }

    .pilot-image {
      overflow: hidden;
      background: #16281a;
      height: 220px;
    }

    .pilot-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .pilot-card:hover .pilot-image img {
      transform: scale(1.04);
    }

    .pilot-body {
      padding: 20px 22px 24px;
    }

    .pilot-title {
      display: block;
      font-size: 1.1rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 2px;
    }

    .pilot-country {
      font-size: 0.75rem;
      font-weight: 600;
      color: #5b3878;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: block;
      margin-bottom: 8px;
    }

    .pilot-country i {
      margin-right: 4px;
    }

    .pilot-body p {
      font-size: 0.85rem;
      color: #6e7767;
      line-height: 1.6;
      margin: 0;
    }

    .challenge-section {
      background: #efe6ce;
    }

    .challenge-wrapper {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr);
      gap: 52px;
      align-items: start;
    }

    .challenge-text {
      min-width: 0;
      text-align: left;
    }

    .solutions-kicker { display: block; margin-bottom: 10px; color: #818528; font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }

    .challenge-text h2 {
      max-width: 760px;
      font-size: clamp(2.5rem, 4vw, 4rem);
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: 0;
      margin-bottom: 16px;
    }

    .challenge-text p {
      max-width: 600px;
      margin: 0 0 22px;
      font-size: 1rem;
      color: #43534a;
      line-height: 1.65;
    }

    .challenge-intro {
      padding-bottom: 8px;
    }

    .challenge-lead {
      max-width: 720px !important;
      font-size: 1.15rem !important;
      line-height: 1.8 !important;
      color: #30483b !important;
    }

    .problem-panel,
    .solution-story,
    .monitor-panel {
      margin-top: 22px;
      padding: 22px 24px;
      border: 1px solid rgba(129, 133, 40, .22);
      background: rgba(255, 253, 247, .58);
    }

    .problem-panel {
      border-left: 5px solid #818528;
    }

    .panel-label {
      display: block;
      margin-bottom: 8px;
      color: #818528;
      font-size: .7rem;
      font-weight: 800;
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    .problem-panel h3,
    .solution-story h3,
    .monitor-panel h3,
    .solutions-heading h3 {
      margin: 0 0 8px;
      color: #17241b;
      font-size: 1.3rem;
      line-height: 1.25;
    }

    .problem-panel p,
    .solution-story span,
    .monitor-panel p {
      margin: 0;
      font-size: .94rem;
      line-height: 1.65;
    }

    .solution-story {
      background: #26432b;
      border-color: #26432b;
    }

    .solution-story .panel-label,
    .solution-story h3,
    .solution-story span {
      color: #fffdf7;
    }

    .solution-story h3 {
      font-size: 1.5rem;
    }

    .story-steps {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-top: 18px;
    }

    .story-steps div {
      padding-top: 13px;
      border-top: 1px solid rgba(255, 253, 247, .28);
    }

    .story-steps strong,
    .story-steps span {
      display: block;
    }

    .story-steps strong {
      margin-bottom: 5px;
      color: #d8e86b;
      font-size: .85rem;
    }

    .story-steps span {
      color: rgba(255, 253, 247, .78);
      font-size: .78rem;
      line-height: 1.5;
    }

    .monitor-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      background: #fffdf7;
    }

    .monitor-panel h3 {
      margin-bottom: 0;
    }

    .monitor-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      max-width: 370px;
    }

    .monitor-list span {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 8px 10px;
      border: 1px solid #d7ddc8;
      color: #30483b;
      font-size: .77rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .solutions-heading {
      margin-top: 34px;
    }

    .solutions-heading h3 {
      font-size: 1.8rem;
    }

    .solutions-heading p {
      margin-bottom: 16px;
    }

    .solutions-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
    .solution-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; padding-top: 13px; border-top: 1px solid #d7ddc8; }
    .solution-index { color: #818528; font-size: .65rem; font-weight: 800; letter-spacing: .08em; }
    .solution-item h4 { margin: 0 0 4px; color: #17241b; font-size: 1rem; font-weight: 800; }
    .solution-item p { margin: 0; color: #59685f; font-size: .78rem; line-height: 1.5; }

    .challenge-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 32px;
      justify-content: center;
      margin-top: 20px;
    }

    .challenge-stat {
      text-align: center;
    }

    .challenge-stat .stat-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #26432b;
      display: block;
      line-height: 1.1;
    }

    .challenge-stat .stat-label {
      font-size: 0.8rem;
      color: #6e7767;
      font-weight: 500;
      margin-top: 2px;
    }

    .challenge-image {
      min-width: 0;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      min-height: 420px;
      background: #dfe6d4;
    }

    .challenge-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 420px;
    }

    @media (min-width: 901px) {
      .challenge-image {
        position: sticky;
        top: calc(var(--site-header-offset, 92px) + var(--section-nav-height, 52px) + 18px);
        height: 520px;
      }

      .challenge-image img {
        min-height: 520px;
      }
    }

    .jkuat-section {
      background: #f7f2e6;
    }

    .jkuat-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
    }

    .jkuat-card {
      flex: 1 1 calc(50% - 15px);
      min-width: 280px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.4s ease;
      background: #fffdf7;
      border: 1px solid #e1d8c0;
    }

    .jkuat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      border-color: #7c4fa3;
    }

    .card-image {
      height: 200px;
      overflow: hidden;
      background: #16281a;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .jkuat-card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-body {
      padding: 28px 30px;
    }

    .card-badge {
      display: inline-block;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      background: #26432b;
      padding: 3px 14px;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    .card-body h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 8px;
    }

    .card-body p {
      font-size: 0.92rem;
      color: #6e7767;
      line-height: 1.7;
      margin-bottom: 14px;
    }

    .card-link {
      color: #26432b;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .card-link:hover {
      color: #5b3878;
      gap: 14px;
    }

    .counters-section {
      padding: 80px 0;
      background: #16281a;
      position: relative;
      overflow: hidden;
    }

    .counters-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(247, 242, 230, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 242, 230, 0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }

    .counters-header {
      max-width: 100%;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .counters-header h2 {
      color: #fff;
    }

    .counters-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1px;
      background: rgba(247, 242, 230, 0.14);
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }

    .counter-item {
      flex: 1 1 calc(16.666% - 1px);
      min-width: 120px;
      background: #16281a;
      padding: 28px 20px;
      text-align: center;
    }

    .counter-number {
      font-size: 2.4rem;
      font-weight: 700;
      color: #fff;
      display: block;
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .counter-suffix {
      font-size: 1.4rem;
      font-weight: 500;
      color: #c89be8;
    }

    .counter-label {
      color: rgba(247, 242, 230, 0.55);
      font-size: 0.72rem;
      font-weight: 500;
      margin-top: 6px;
      display: block;
    }

    .activity-section {
      background: #f7f2e6;
    }

    .innovation-highlight-section { position: relative; overflow: hidden; padding: 104px 0; background: #26432b; color: #fffdf7; }
    .innovation-highlight-section::before { content: ''; position: absolute; inset: 0; opacity: .14; background-image: linear-gradient(rgba(216,232,107,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(216,232,107,.28) 1px, transparent 1px); background-size: 42px 42px; pointer-events: none; }
    .innovation-highlight-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(280px, .85fr) minmax(0, 1.15fr); gap: 72px; align-items: center; }
    .innovation-highlight-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; transform: rotate(-3deg); }
    .innovation-highlight-visual span, .innovation-highlight-visual strong { display: grid; place-items: center; min-height: 150px; border: 1px solid rgba(23,36,27,.12); background: #d8e86b; color: #17241b; font: 700 2.2rem Georgia, serif; box-shadow: 14px 14px 0 rgba(16,45,37,.38); }
    .innovation-highlight-visual span:nth-child(2) { margin-top: 28px; background: #d3a64e; }
    .innovation-highlight-visual strong { grid-column: 1 / -1; background: #f7f2e6; font-size: 2rem; }
    .innovation-highlight-copy .section-kicker { color: #d3a64e; }
    .innovation-highlight-copy h2 { margin-bottom: 18px; color: #fffdf7; font-size: clamp(2.3rem, 4vw, 4rem); }
    .innovation-highlight-copy .highlight { color: #d8e86b; }
    .innovation-highlight-copy h3 { max-width: 650px; margin: 0 0 14px; color: #d8e86b; font-size: 1.28rem; line-height: 1.35; }
    .innovation-highlight-copy > p:not(.section-kicker) { max-width: 680px; margin: 0; color: rgba(255,253,247,.78); line-height: 1.8; }
    .innovation-link { display: inline-flex; gap: 8px; margin-top: 26px; color: #d3a64e; font-weight: 800; text-decoration: none; }
    .live-impact-section { position: relative; overflow: hidden; padding: 104px 0; background: #102d25; color: #fffdf7; }
    .live-impact-section::before { content: ''; position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(rgba(216,232,107,.24) 1px, transparent 1px), linear-gradient(90deg, rgba(216,232,107,.24) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
    .live-impact-section .container { position: relative; z-index: 1; }
    .live-impact-heading { margin-bottom: 42px; }
    .live-impact-heading .section-kicker { display: inline-flex; margin: 0; padding: 8px 14px; border: 1px solid rgba(216,232,107,.55); background: rgba(216,232,107,.12); color: #d8e86b; font-size: .74rem; font-weight: 900; letter-spacing: .18em; }
    .live-impact-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: rgba(255,253,247,.22); box-shadow: 0 24px 50px rgba(0,0,0,.16); }
    .live-impact-grid article { position: relative; min-height: 180px; padding: 32px 26px; background: rgba(16,45,37,.92); border: 0; transition: background .25s ease, transform .25s ease; }
    .live-impact-grid article::before { content: ''; position: absolute; top: 0; right: 26px; left: 26px; height: 3px; background: #d8e86b; transform: scaleX(.28); transform-origin: left; transition: transform .25s ease; }
    .live-impact-grid article:hover { z-index: 1; background: #183d31; transform: translateY(-5px); }
    .live-impact-grid article:hover::before { transform: scaleX(1); }
    .live-impact-grid article:last-child { border-right: 0; }
    .live-impact-grid strong { display: block; margin-bottom: 12px; color: #d8e86b; font: 400 clamp(2.4rem, 4vw, 3.8rem) Georgia, serif; }
    .live-impact-grid span { color: rgba(255,253,247,.72); font-size: .8rem; }
    .featured-products-section { padding: 96px 0; background: #26432b; color: #fffdf7; }
    .featured-products-section .featured-products-heading h2 { color: #fffdf7; }
    .featured-products-section .featured-products-heading p:last-child { color: rgba(255,253,247,.78); }
    .featured-products-section .section-kicker { display: inline-flex; align-items: center; margin-bottom: 20px; padding: 8px 13px; border: 1px solid rgba(216,232,107,.52); background: rgba(216,232,107,.12); color: #d8e86b !important; font-size: .72rem; font-weight: 900; letter-spacing: .14em; }
    .featured-products-section .featured-products-track { padding-bottom: 22px; scrollbar-width: thin; scrollbar-color: #d8e86b rgba(255,253,247,.16); }
    .featured-products-section .featured-products-track::-webkit-scrollbar { height: 8px; }
    .featured-products-section .featured-products-track::-webkit-scrollbar-track { background: rgba(255,253,247,.16); border-radius: 999px; }
    .featured-products-section .featured-products-track::-webkit-scrollbar-thumb { background: #d8e86b; border-radius: 999px; }
    .featured-products-actions { display: flex; align-items: center; gap: 14px; margin-top: 24px; padding-top: 22px; border-top: 1px solid rgba(255,253,247,.2); }
    .featured-products-section .bag-button { display: inline-flex; align-items: center; justify-content: center; min-width: 190px; padding: 14px 22px; border: 1px solid #d8e86b; border-radius: 10px; background: #818528; color: #fffdf7; box-shadow: 0 10px 24px rgba(16,45,37,.22); transition: background .2s ease, transform .2s ease, box-shadow .2s ease; }
    .featured-products-section .bag-button:hover { background: #6f7623; transform: translateY(-2px); box-shadow: 0 14px 28px rgba(16,45,37,.32); }
    .featured-products-section .catalog-link { display: inline-flex; align-items: center; gap: 8px; padding: 13px 16px; border: 1px solid rgba(216,232,107,.5); border-radius: 10px; background: rgba(216,232,107,.1); color: #d8e86b; font-weight: 900; text-decoration: none; transition: background .2s ease, gap .2s ease, border-color .2s ease; }
    .featured-products-section .catalog-link:hover { gap: 12px; border-color: #d8e86b; background: rgba(216,232,107,.2); }
    .latest-feed-section { background: #183d31; color: #fffdf7; }
    .latest-feed-section .section-header h2 { color: #fffdf7; }
    .latest-feed-section .section-header p:last-child { color: rgba(255,253,247,.76); }
    .latest-feed-section .section-kicker { color: #d3a64e; }
    .latest-feed-section .view-all-link { color: #d8e86b; }
    .home-team-section { position: relative; overflow: hidden; background: var(--color-forest-green, #064e3b) !important; color: #fffdf7; }
    .home-team-section::before { content: ''; position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(rgba(216,232,107,.24) 1px, transparent 1px), linear-gradient(90deg, rgba(216,232,107,.24) 1px, transparent 1px); background-size: 44px 44px; pointer-events: none; }
    .home-team-section .container { position: relative; z-index: 1; }
    .home-team-section .section-header { max-width: 820px; margin-bottom: 42px; }
    .home-team-section .section-header h2 { color: #fffdf7; }
    .home-team-section .section-header p:last-child { color: rgba(255,253,247,.76); }
    .home-team-section .section-kicker { display: inline-flex; align-items: center; margin-bottom: 18px; padding: 8px 13px; border: 1px solid rgba(216,232,107,.5); background: rgba(216,232,107,.12); color: #d8e86b; font-size: .72rem; font-weight: 900; letter-spacing: .14em; }
    .home-team-grid { gap: 22px; }
    .home-team-card { border: 1px solid rgba(255,253,247,.18); background: #f7f2e6; box-shadow: 0 18px 34px rgba(16,45,37,.22); transition: transform .25s ease, box-shadow .25s ease; }
    .home-team-card:hover { transform: translateY(-6px); box-shadow: 0 24px 44px rgba(16,45,37,.34); }
    .home-team-photo { background: #102d25; }
    .home-team-socials a { border: 2px solid #183d31; background: #d8e86b; transition: background .2s ease, color .2s ease, transform .2s ease; }
    .home-team-socials a:hover { background: #d3a64e; color: #102d25; transform: scale(1.08); }
    .home-team-card h3 { font-size: 1.12rem; }
    .home-team-card p { min-height: 2.4em; }
    .home-team-section .team-contact-link { color: #d8e86b; }
    .cta-section { background: #102d25; }
    .section-kicker { margin: 0 0 10px; color: #818528; font-size: .68rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .featured-products-heading { margin-bottom: 34px; }
    .featured-products-track { display: flex; gap: 18px; overflow-x: auto; padding: 4px 2px 18px; scrollbar-width: thin; scrollbar-color: #818528 transparent; }
    .featured-product-card { position: relative; flex: 0 0 min(280px, 78vw); overflow: hidden; background: #fffdf7; border: 1px solid #e1d8c0; box-shadow: 0 10px 28px rgba(23, 36, 27, .08); }
    .featured-product-card > img { width: 100%; height: 190px; object-fit: cover; }
    .product-badge { position: absolute; top: 12px; left: 12px; padding: 5px 9px; background: #d8e86b; color: #17241b; font-size: .62rem; font-weight: 800; text-transform: uppercase; }
    .featured-product-copy { padding: 18px; }
    .featured-product-copy p { margin: 0 0 6px; color: #818528; font-size: .65rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .featured-product-copy h3 { min-height: 50px; margin: 0 0 8px; color: #17241b; font-size: 1.12rem; line-height: 1.25; }
    .featured-product-copy > span { display: block; margin-bottom: 16px; color: #59685f; font-size: .78rem; }
    .add-to-bag-button, .bag-button { border: 0; cursor: pointer; font: inherit; font-weight: 800; }
    .add-to-bag-button { width: 100%; padding: 11px 14px; background: #26432b; color: #fffdf7; transition: background .2s ease, color .2s ease, transform .2s ease; }
    .add-to-bag-button:hover { background: #16281a; transform: translateY(-1px); }
    .add-to-bag-button.added-to-cart { background: #818528; color: #fffdf7; }
    .add-to-bag-button.added-to-cart:hover { background: #6f7623; }
    .add-to-bag-button:hover, .bag-button:hover { background: #16281a; }
    .featured-products-actions { display: flex; align-items: center; gap: 20px; margin-top: 18px; }
    .bag-button { padding: 12px 18px; background: #818528; color: #fff; }
    .catalog-link, .team-contact-link { color: #26432b; font-weight: 800; text-decoration: none; }
    .latest-feed-section { padding-top: 88px; }
    .feed-empty { color: #59685f; }
    .home-team-section { padding: 88px 0; background: #fffdf7; }
    .home-team-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
    .home-team-card { overflow: hidden; background: #f7f2e6; border: 1px solid #e1d8c0; }
    .home-team-photo { position: relative; aspect-ratio: 1; background: #26432b; }
    .home-team-photo img { width: 100%; height: 100%; object-fit: cover; }
    .home-team-socials { position: absolute; top: 12px; right: 12px; display: grid; gap: 7px; }
    .home-team-socials a { display: grid; width: 32px; height: 32px; place-items: center; background: #d8e86b; color: #17241b; font-size: .78rem; font-weight: 900; text-decoration: none; }
    .home-team-card h3 { margin: 16px 16px 5px; color: #17241b; font-size: 1.05rem; }
    .home-team-card p { margin: 0 16px; color: #43534a; font-size: .8rem; }
    .home-team-card small { display: block; padding: 8px 16px 18px; color: #818528; font-size: .68rem; font-weight: 800; }
    .team-contact-link { display: inline-flex; gap: 8px; margin-top: 30px; }

    .activity-section .section-header {
      display: block;
      max-width: 100%;
      margin-bottom: 36px;
    }

    .activity-section .section-header h2 {
      font-size: 2.4rem;
      margin-bottom: 12px;
    }

    .activity-section .section-header p {
      font-size: 1.05rem;
      margin: 0 auto;
    }

    .activity-grid {
      display: flex;
      flex-direction: column;
      gap: 52px;
    }

    .activity-col {
      min-width: 0;
    }

    .col-heading {
      margin-bottom: 20px;
      text-align: left;
    }

    .col-heading h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #17241b;
      margin-top: 4px;
    }

    .col-heading .accent {
      color: #26432b;
      font-weight: 700;
    }

    .activity-track,
    .event-track {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
      padding: 4px 2px 18px;
      scrollbar-width: thin;
      scrollbar-color: #c89b3c transparent;
    }

    .activity-track::-webkit-scrollbar,
    .event-track::-webkit-scrollbar {
      height: 7px;
    }

    .activity-track::-webkit-scrollbar-thumb,
    .event-track::-webkit-scrollbar-thumb {
      background: #c89b3c;
      border-radius: 999px;
    }

    .activity-item {
      display: flex;
      flex: 0 0 min(360px, 78vw);
      flex-direction: column;
      gap: 0;
      padding: 0 0 18px;
      background: #fffdf7;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #e1d8c0;
      box-shadow: 0 8px 24px rgba(23, 36, 27, 0.07);
      transition: all 0.3s ease;
      color: inherit;
      text-decoration: none;
    }

    .activity-item:hover {
      border-color: #c89b3c;
      box-shadow: 0 14px 30px rgba(23, 36, 27, 0.12);
      transform: translateY(-4px);
    }

    .activity-img {
      width: 100%;
      height: 190px;
      border-radius: 0;
      overflow: hidden;
      flex-shrink: 0;
      background: #efe6ce;
    }

    .activity-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: #fff;
      background: #26432b;
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }

    .date {
      font-size: 0.68rem;
      color: #6e7767;
      font-weight: 500;
    }

    .tag {
      display: inline-block;
      background: rgba(124, 79, 163, 0.09);
      color: #5b3878;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 0.58rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .activity-copy h4 {
      font-size: 1.14rem;
      font-weight: 700;
      color: #17241b;
      margin: 0;
      line-height: 1.35;
    }

    .activity-copy {
      padding: 16px 18px 0;
    }

    .activity-copy p { display: none; }

    .event-item {
      display: flex;
      flex: 0 0 min(360px, 78vw);
      align-items: center;
      gap: 16px;
      padding: 15px 18px;
      background: #fffdf7;
      border-radius: 16px;
      margin-bottom: 0;
      transition: all 0.3s ease;
      border: 1px solid #e1d8c0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }

    .event-item:hover {
      border-color: #7c4fa3;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
      transform: translateY(-4px);
    }

    .event-item:focus-visible,
    .activity-item:focus-visible {
      outline: 3px solid #c89b3c;
      outline-offset: 4px;
    }

    .event-date {
      text-align: center;
      background: #26432b;
      color: #fff;
      padding: 7px 12px;
      border-radius: 8px;
      min-width: 50px;
      flex-shrink: 0;
    }

    .event-date .day {
      font-size: 1.05rem;
      font-weight: 700;
      display: block;
      line-height: 1.1;
    }

    .event-date .month {
      font-size: 0.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: block;
    }

    .event-info {
      flex: 1;
    }

    .event-info h5 {
      font-size: 0.94rem;
      font-weight: 700;
      color: #17241b;
      margin: 0;
    }

    .event-info p {
      color: #6e7767;
      font-size: 0.78rem;
      margin: 0;
    }

    .event-status {
      font-size: 0.56rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 14px;
      border-radius: 50px;
      background: #3e6b45;
      color: #fff;
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .event-status.soon {
      background: #be5a2b;
    }

    .view-all-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 18px;
      color: #26432b;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .view-all-link:hover {
      gap: 12px;
      color: #5b3878;
    }

    .cta-section {
      position: relative;
      padding: 80px 0;
      background: linear-gradient(135deg, #16281a, #26432b);
      overflow: hidden;
      text-align: center;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80') center/cover no-repeat;
      opacity: 0.06;
      pointer-events: none;
    }

    .cta-section .container {
      position: relative;
      z-index: 1;
    }

    .cta-section h2 {
      font-size: 2.6rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
    }

    .cta-section p {
      font-size: 1.05rem;
      color: rgba(247, 242, 230, 0.7);
      max-width: 520px;
      margin: 0 auto 32px;
    }

    .cta-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .funding-section {
      padding-top: 32px;
      padding-bottom: 72px;
    }

    @media (max-width: 1024px) {
      .hero-content h1 {
        font-size: 2.8rem;
      }

      .section-header h2 {
        font-size: 2.2rem;
      }

      .challenge-text h2 {
        font-size: 2.2rem;
      }

      .challenge-stats {
        gap: 24px;
      }

      .challenge-stat .stat-number {
        font-size: 1.8rem;
      }

      .counter-item {
        flex: 1 1 calc(33.333% - 1px);
      }

      .cta-section h2 {
        font-size: 2.2rem;
      }

      .jkuat-card {
        flex: 1 1 calc(50% - 15px);
      }

      .pilot-card {
        flex: 1 1 calc(50% - 15px);
        max-width: none;
      }

      .challenge-wrapper {
        grid-template-columns: 1fr;
      }

      .challenge-image {
        min-height: 200px;
      }

      .challenge-image img {
        min-height: 200px;
      }
    }

    @media (max-width: 768px) {
      :host {
        padding-top: 0;
      }

      .section-nav a {
        padding: 10px 14px;
        font-size: 0.6rem;
      }

      .partner-network-section { padding-top: 56px; }
      .partner-track a { grid-template-columns: 82px 150px; width: 270px; min-height: 122px; padding: 20px 22px; }
      .partner-track img, .partner-placeholder { width: 82px; height: 66px; }
      .innovation-highlight-section { padding: 68px 0; }
      .innovation-highlight-grid { grid-template-columns: 1fr; gap: 38px; }
      .innovation-highlight-copy { text-align: center; }
      .innovation-highlight-copy h3, .innovation-highlight-copy > p:not(.section-kicker) { margin-right: auto; margin-left: auto; }
      .innovation-link { justify-content: center; }
      .live-impact-section { padding: 68px 0; }
      .live-impact-grid { grid-template-columns: repeat(2, 1fr); }
      .live-impact-grid article:nth-child(2) { border-right: 0; }
      .live-impact-grid article:nth-child(-n + 2) { border-bottom: 1px solid rgba(255,253,247,.2); }
      .latest-feed-section .view-all-link { display: flex; justify-content: center; width: 100%; text-align: center; }

      .hero {
        min-height: 100vh;
        height: 100vh;
      }

      .hero-content-wrapper {
        padding: 40px 24px;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-content h1 {
        font-size: 2.2rem;
      }

      .hero-sub {
        font-size: 1rem;
      }

      .hero-highlight-title {
        font-size: 2.1rem;
      }

      .hero-description {
        font-size: 0.92rem;
      }

      .hero-buttons {
        flex-direction: column;
        width: 100%;
      }

      .hero-buttons .btn-primary,
      .hero-buttons .btn-secondary {
        width: 100%;
        justify-content: center;
      }

      .section-header h2 {
        font-size: 1.8rem;
      }

      .section-header p {
        font-size: 0.95rem;
      }

      .varieties-grid {
        grid-template-columns: 1fr;
        grid-template-rows: none;
        max-width: 420px;
        margin: 0 auto;
      }

      .variety-card-featured {
        grid-row: auto;
        min-height: 390px;
      }

      .variety-card-featured img {
        height: 210px;
      }

      .impact-grid {
        grid-template-columns: 1fr;
      }

      .home-team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }

      .challenge-section,
      .pilot-section,
      .jkuat-section,
      .activity-section,
      .cta-section {
        padding: 60px 0;
      }

      .challenge-text h2 {
        font-size: 1.8rem;
      }

      .challenge-text p {
        max-width: 100%;
      }

      .story-steps {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .monitor-panel {
        align-items: flex-start;
        flex-direction: column;
      }

      .monitor-list {
        justify-content: flex-start;
        max-width: none;
      }

      .solutions-list {
        grid-template-columns: 1fr;
      }

      .pilot-card {
        flex: 1 1 100%;
        max-width: 360px;
      }

      .jkuat-card {
        flex: 1 1 100%;
      }

      .counter-item {
        flex: 1 1 calc(50% - 1px);
        padding: 20px 16px;
      }

      .counter-number {
        font-size: 1.8rem;
      }

      .activity-grid {
        flex-direction: column;
        gap: 44px;
      }

      .activity-col {
        width: 100%;
      }

      .activity-item {
        flex-basis: min(320px, 82vw);
      }

      .activity-img {
        width: 100%;
        height: 180px;
      }

      .event-item {
        flex-basis: min(320px, 82vw);
      }

      .cta-section {
        padding: 60px 0;
      }

      .cta-section h2 {
        font-size: 1.8rem;
      }

      .cta-buttons {
        flex-direction: column;
        width: 100%;
      }

      .cta-buttons .btn-primary,
      .cta-buttons .btn-light {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 16px;
      }

      .featured-products-actions { align-items: center; flex-direction: row; flex-wrap: nowrap; gap: 8px; }
      .featured-products-section .bag-button { min-width: 0; flex: 0 0 auto; padding: 12px 13px; font-size: .76rem; white-space: nowrap; }
      .featured-products-section .catalog-link { min-width: 0; flex: 1 1 auto; justify-content: center; padding: 12px 10px; font-size: .72rem; white-space: nowrap; }
      .home-team-grid { grid-template-columns: 1fr; }

      .hero-content h1 {
        font-size: 1.8rem;
      }

      .hero-sub {
        font-size: 0.9rem;
      }

      .hero-description {
        font-size: 0.85rem;
      }

      .section-header h2 {
        font-size: 1.5rem;
      }

      .challenge-text h2 {
        font-size: 1.5rem;
      }

      .cta-section h2 {
        font-size: 1.5rem;
      }

      .card-body {
        padding: 20px;
      }

      .pilot-body {
        padding: 16px 18px 20px;
      }

      .hero-content-wrapper {
        padding: 30px 20px;
      }

      .btn-primary,
      .btn-secondary,
      .btn-light {
        padding: 12px 16px;
        font-size: 0.85rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
      .hero-slide-bg { transform: none; transition: none; }
    }
  `]
})
export class LegacyHomeComponent implements OnInit, OnDestroy {
  private readonly teamService = inject(TeamService);
  private readonly localHeroFallback = '/images/smartmushrooms/q.jpeg';
  protected readonly heroImages = signal<string[]>([this.localHeroFallback]);
  protected readonly heroIndex = signal(0);
  protected readonly activeHeroImage = computed(() => this.heroImages()[this.heroIndex()] || this.localHeroFallback);
  protected readonly heroFallbackImage = computed(() => this.heroImages()[0] || this.localHeroFallback);
  protected readonly partners = [
    { slug: 'eu', name: '', logo: '/images/logos/eu_emblem.svg' },
    { slug: 'bridge-ai', name: '', logo: '/images/logos/bridge_ai_logo.svg' },
    { slug: 'jkuat', name: '', logo: '/images/webimages/partners/jkuat-logo.png' },
    { slug: 'mush&', name: '', logo: '/images/logos/mush.jpeg' },
    { slug: 'koica', name: '', logo: '/images/logos/koica.jpeg' },
    { slug: 'jhub', name: '', logo: '/images/logos/jhub_logo.svg' }
  ];
  protected readonly marqueePartners = [...this.partners, ...this.partners];
  private rotation?: ReturnType<typeof setInterval>;
  private readonly handleResize = (): void => this.syncStickyOffset();
  private readonly handleScroll = (): void => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (hero) hero.style.setProperty('--hero-parallax', `${Math.min(window.scrollY * 0.16, 120)}px`);
  };
  protected heroTitle = APP.ACRONYM;
  protected heroDescription = APP.DESCRIPTION;
  protected latestActivities = signal<Activity[]>([]);
  protected upcomingEvents = signal<Event[]>([]);
  protected readonly team = signal<TeamMember[]>([]);
  protected readonly featuredProducts = SHOP_PRODUCTS.filter(product => [
    'jambo101-spawn',
    'mambo101-spawn',
    'fresh-mushroom-punnets',
    'mushroom-wine',
    'pumice-house-iot-kit'
  ].includes(product.id));
  protected readonly impactCounters = [
    { value: '0', label: 'Active grow houses' },
    { value: '0 kg', label: 'Spawn distributed' },
    { value: '0', label: 'Farmers trained' },
    { value: '0', label: 'Community partners' }
  ];
  private readonly cartService = inject(ShopCartService);
  protected readonly cartCount = this.cartService.cartCount;
  protected readonly latestFeed = computed<SmartMushroomFeedItem[]>(() => [
    ...this.latestActivities().map(activity => ({
      title: activity.title,
      date: activity.date,
      image: activity.featured_image,
      kind: 'activity' as const,
      slug: activity.slug,
      label: activity.wp_tag || activity.activity_type,
      summary: activity.summary
    })),
    ...this.upcomingEvents().map(event => ({
      title: event.title,
      date: event.date,
      image: event.featured_image,
      kind: 'event' as const,
      slug: event.slug,
      label: 'Event',
      summary: event.description
    }))
  ].sort((first, second) => second.date.localeCompare(first.date)));
  protected activitiesCount: number = 0;
  protected eventsCount: number = 0;
  protected partnersCount: number = 12;
  protected resourcesCount: number = 0;

  private readonly router = inject(Router);

  constructor(
    private activityService: ActivityService,
    private eventService: EventService,
    private cloudinaryService: CloudinaryService
  ) {}

  protected addToBag(product: ShopProduct): void {
    this.cartService.add(product);
  }

  protected isInCart(product: ShopProduct): boolean {
    return this.cartService.cart().some(item => item.id === product.id);
  }

  protected openBag(): void {
    this.router.navigate(['/shop'], { queryParams: { bag: 'open' } });
  }

  ngOnInit(): void {
    this.teamService.getVisibleTeamMembers().subscribe({ next: members => this.team.set(members), error: () => this.team.set([]) });
    this.loadData();
    this.loadHeroImages();
    this.syncStickyOffset();
    this.rotation = setInterval(() => {
      const imageCount = this.heroImages().length;
      if (imageCount > 0) {
        this.heroIndex.update(index => (index + 1) % imageCount);
      }
    }, 8000);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('load', this.handleResize);
    this.bindSectionNavigation();
  }

  ngOnDestroy(): void {
    if (this.rotation) clearInterval(this.rotation);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('load', this.handleResize);
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const nav = document.querySelector('.section-nav') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 92;
    const navHeight = nav ? nav.offsetHeight : 52;

    document.documentElement.style.setProperty('--site-header-offset', `${headerHeight}px`);
    document.documentElement.style.setProperty('--section-nav-height', `${navHeight}px`);
    document.documentElement.style.setProperty('scroll-padding-top', `${headerHeight + navHeight + 20}px`);
  }

  private preloadImages(): void {
    this.heroImages().slice(0, 3).forEach(source => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
    });
  }

  private loadHeroImages(): void {
    this.cloudinaryService.getActivityImages().subscribe({
      next: (images) => {
        const sources = images
          .map(image => image.secure_url)
          .filter(image => image.includes('/bridge-ai/activities/'))
          .filter((image, index, collection) => collection.indexOf(image) === index);
        this.heroImages.set([this.localHeroFallback, ...sources.filter(image => image !== this.localHeroFallback)]);
        this.heroIndex.set(0);
        this.preloadImages();
      },
      error: () => {
        this.heroImages.set([this.localHeroFallback]);
      }
    });
  }

  private bindSectionNavigation(): void {
    const navLinks = Array.from(document.querySelectorAll('.section-nav a')) as HTMLAnchorElement[];
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('data-section') || ''))
      .filter((section): section is HTMLElement => !!section);

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) {
          return;
        }

        const target = document.querySelector(targetId) as HTMLElement | null;
        if (!target) {
          return;
        }

        event.preventDefault();
        const header = document.querySelector('.site-header') as HTMLElement | null;
        const nav = document.querySelector('.section-nav') as HTMLElement | null;
        const offset = (header?.offsetHeight ?? 0) + (nav?.offsetHeight ?? 0) + 18;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetId}`);
      });
    });

    if (!sections.length || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const activeEntry = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => Math.abs(first.boundingClientRect.top - window.innerHeight * 0.45)
          - Math.abs(second.boundingClientRect.top - window.innerHeight * 0.45))[0];
      if (!activeEntry) {
        return;
      }

      const link = document.querySelector(`.section-nav a[data-section="${activeEntry.target.id}"]`) as HTMLAnchorElement | null;
      if (link) {
        navLinks.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
        const nav = document.querySelector('.section-nav') as HTMLElement | null;
        if (nav && nav.scrollWidth > nav.clientWidth) {
          nav.scrollTo({
            left: Math.max(0, link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2),
            behavior: 'smooth'
          });
        }
      }
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  }

  private loadData(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = (activities ?? []).filter(activity =>
          activity.evidence_status?.trim().toLowerCase() === 'published'
        );
        this.activitiesCount = published.length;
        this.latestActivities.set([...published].sort((first, second) => second.date.localeCompare(first.date)));
      },
      error: () => {
        this.latestActivities.set([]);
      }
    });

    this.eventService.getEvents().subscribe({
      next: (events) => {
        const availableEvents = events ?? [];
        const upcoming = [...availableEvents].sort((first, second) => second.date.localeCompare(first.date));
        this.eventsCount = availableEvents.length;
        this.upcomingEvents.set(upcoming);
      },
      error: () => {
        this.upcomingEvents.set([]);
      }
    });

    this.resourcesCount = 0;
  }
}
