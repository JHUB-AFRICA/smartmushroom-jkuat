import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../../../../services/team.service';
import { TeamMember } from '../../../core/models/team.model';

export interface ConsortiumPartner {
  slug: string;
  name: string;
  country: string;
  website: string;
  logo: string;
  description: string;
  role: string;
  grantNumber?: string;
}

export const CONSORTIUM_PARTNERS: ConsortiumPartner[] = [
  { slug: 'eurecat', name: 'Eurecat', country: 'Spain', website: 'https://eurecat.org/home/en/', logo: '/images/webimages/partners/EURECAT.jpeg', description: 'Eurecat is one of Europe’s leading technology centres for accelerating innovation through distinctive technological solutions that combine knowledge, social and environmental impact.', role: 'Eurecat coordinates BRIDGE-AI through its Applied Artificial Intelligence Unit, leading the development of advanced digital solutions for climate-smart agriculture in Africa.' },
  { slug: 'upm', name: 'Universidad Politécnica de Madrid', country: 'Spain', website: 'https://www.upm.es/internacional', logo: '/images/webimages/partners/Universidad Politécnica de Madrid.jpeg', description: 'Universidad Politécnica de Madrid is the largest Spanish technology university and a renowned European institution with strong research capacity across engineering and applied sciences.', role: 'UPM contributes scientific expertise and fine-tunes generative AI models for BRIDGE-AI use cases, while supporting training and long-term deployment across Africa.' },
  { slug: 'jkuat', name: 'Jomo Kenyatta University of Agriculture and Technology', country: 'Kenya', website: 'https://www.jkuat.ac.ke/', logo: '/images/webimages/partners/jkuat-logo.png', description: 'JKUAT is a premier public university in Kenya, renowned for excellence in science, engineering and technology education, with a strong commitment to practical solutions.', role: 'JKUAT serves as the implementing partner for the Smart Mushroom pilot, harnessing generative AI and IoT to build climate-resilient, youth-driven mushroom farming systems.' },
  { slug: 'jhub', name: 'JHUB Africa', country: 'Kenya', website: 'https://jhubafrica.com/', logo: '/images/logos/jhub_logo.svg', description: 'JHUB Africa is JKUAT’s digital innovation centre, supporting practical technology adoption, entrepreneurship and locally relevant digital solutions.', role: 'JHUB Africa supports Smart Mushroom Kenya through innovation, digital onboarding and the connection between the growing room, farmer dashboard and the people who use the system.' },
  { slug: 'mush&', name: 'Mush&', country: 'South Korea', website: 'https://mushn.co.kr/', logo: '/images/logos/mush.jpeg', description: 'Mush& is a biotechnology and food innovation company developing premium mycelium-based functional ingredients through controlled, closed-loop fermentation.', role: 'Mush& brings expertise in converting agricultural by-products into high-quality mycelium ingredients and translating fermentation technology into scalable food applications, creating a strong bridge between mushroom science, sustainability and future nutrition.' },
  { slug: 'eu', name: 'European Union', country: 'European Union', website: 'https://cordis.europa.eu/project/id/101299050', logo: '/images/logos/eu_emblem.svg', description: 'The European Union supports the Smart Mushroom Kenya Pilot through Horizon Europe, the European Union’s research and innovation programme for collaborative projects with societal impact.', role: 'The grant enables the pilot to develop practical climate-smart mushroom farming solutions, strengthen digital skills and connect research, innovation and farmer learning across the consortium.', grantNumber: 'No. 101299050' },
  { slug: 'bridge-ai', name: 'BRIDGE-AI', country: 'Kenya', website: 'https://bridge-ai.eu', logo: '/images/logos/bridge_ai_logo.svg', description: 'BRIDGE-AI brings generative AI, IoT sensing and digital skills into practical climate-smart agriculture.', role: 'The project coordinates research, technology development and local implementation across the consortium.' },
  { slug: 'gates-foundation', name: 'Bill & Melinda Gates Foundation', country: 'Global', website: 'https://www.gatesfoundation.org/', logo: '/images/logos/bill.jpeg', description: 'The Bill & Melinda Gates Foundation supports innovation for healthier, more productive lives and resilient food systems.', role: 'Its work aligns with inclusive, evidence-led agricultural innovation that reaches smallholder farmers.' },
  { slug: 'koica', name: 'KOICA', country: 'South Korea', website: 'https://www.koica.go.kr/', logo: '/images/logos/koica.jpeg', description: 'The Korea International Cooperation Agency supports sustainable development and inclusive digital cooperation around the world.', role: 'KOICA represents the value of international cooperation in turning practical technology into lasting development outcomes.' },
  { slug: 'gdih', name: 'gDIH', country: 'Africa', website: 'https://www.gdih.org/about-gdih/', logo: '/images/logos/gdih.jpeg', description: 'gDIH connects digital innovation, entrepreneurship and community-facing technology across Africa.', role: 'gDIH helps bridge emerging digital capabilities with the organisations and people who need them most.' },
  { slug: 'university-of-sousse', name: 'University of Sousse', country: 'Tunisia', website: 'https://www.uc.rnu.tn/', logo: '/images/webimages/partners/University of Sousse.jpeg', description: 'The University of Sousse is one of Tunisia’s leading public universities, bringing together expertise in engineering, computer science, artificial intelligence, agriculture and digital technologies.', role: 'The University of Sousse leads WP2 and coordinates requirements definition, stakeholder engagement, data collection and use-case preparation for the Tunisian pilot.' },
  { slug: 'moome', name: 'MooMe', country: 'Tunisia', website: 'https://moome.tn/', logo: '/images/webimages/partners/moome.png', description: 'MooMe, developed by STE LIFEYE SARL, is a mobile-first operating system for livestock that connects farmers, veterinarians and value-chain partners through shared digital records.', role: 'Within BRIDGE-AI, MooMe contributes to the co-design, implementation and validation of use cases, including AI-optimised, climate-resilient pasture management.' },
  { slug: 'agroinfotech', name: 'AgroInfoTech Labs Limited', country: 'Nigeria', website: 'https://agroinfotech.com.ng/', logo: '/images/webimages/partners/Agroinfotech.jpeg', description: 'AgroInfoTech Labs is a Nigerian research, innovation and venture design company developing resilient, trusted and inclusive digital food systems across Africa.', role: 'AgroInfoTech Labs serves as the Nigerian user-case provider for climate-smart maize production and contributes to validation of generative AI, Earth observation and decision-support systems.' },
  { slug: 'austria-card', name: 'Austria Card Plastikkarten und Ausweissysteme G.M.B.H.', country: 'Austria', website: 'https://www.austriacard.com/', logo: '/images/webimages/partners/Austria Card.jpeg', description: 'Austriacard is an innovative company specialising in embedded hardware security, information management and secure digital services.', role: 'Austria Card contributes secure digital solutions, scalable deployment and exploitation of AI-enabled infrastructures for reliable agricultural services.' },
  { slug: 'seamless', name: 'Seamless Middleware Technologies SL', country: 'Spain', website: 'https://www.seamware.eu/', logo: '/images/webimages/partners/Seamless.jpeg', description: 'Seamless Middleware Technologies, also known as SEAMWARE, specialises in technological integration, middleware solutions and connectivity between systems.', role: 'SEAMWARE supports BRIDGE-AI interoperability through context management, smart data models and semantic integration across distributed digital environments.' }
];

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-partners',
  styleUrl: './partners.css',
  templateUrl: './partners.html',
})
export class Partners {
  protected readonly partners = CONSORTIUM_PARTNERS.filter(partner => partner.slug === 'jkuat');
  protected readonly team = signal<TeamMember[]>([]);
  private readonly teamService = inject(TeamService);
  protected detailPartner: ConsortiumPartner | null = null;
  protected readonly activeRelated = 0;

  protected get relatedPartners(): ConsortiumPartner[] {
    return CONSORTIUM_PARTNERS.filter(partner => partner.slug !== this.detailPartner?.slug
      && (partner.slug === 'jkuat' || partner.slug === 'jhub' || partner.slug === 'mush&' || partner.slug === 'eu'));
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      const slug = params.get('slug') ? decodeURIComponent(params.get('slug')!) : null;
      this.detailPartner = CONSORTIUM_PARTNERS.find(partner => partner.slug === slug) ?? null;
    });
    this.teamService.getVisibleTeamMembers().subscribe({ next: members => this.team.set(members), error: () => this.team.set([]) });
  }
}
