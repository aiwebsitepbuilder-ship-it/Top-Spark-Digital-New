export type EnquiryStatus = 'New' | 'In Progress' | 'Contacted' | 'Closed';

export interface Enquiry {
  id: string;
  submittedAt: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  emailSent?: boolean;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  industry: string;
  title: string;
  challenge: string;
  approach: string;
  services: string[];
  execution: string;
  deliverables: string[];
  verifiedResults?: string;
  outcome: string;
  image: string;
  altText: string;
  status: 'published' | 'draft';
  sortOrder: number;
  seoTitle?: string;
  metaDescription?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  shortDescription: string;
  items: string[];
  businessNeeds: string;
  plainEnglishExplanation?: string;
  ctaText: string;
  featuredInHome: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  shortTagline: string;
  description: string;
  features: string[];
  image: string;
  ctaLabel: string;
  ctaDestination: string;
  status: 'published' | 'draft';
}

export interface ClientRecord {
  id: string;
  name: string;
  industry: string;
  sortOrder: number;
  published: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  designation: string;
  company: string;
  photoUrl?: string;
  published: boolean;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  published: boolean;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt?: string;
  status: 'draft' | 'published';
}

export interface SiteSettings {
  brandName: string;
  domain: string;
  officeAddress: string;
  phone: string;
  businessEmail: string;
  primaryPositioning: string;
  supportingPositioning: string;
  whatsappEnabled: boolean;
  blogPubliclyEnabled: boolean;
  socials: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface ContentDatabase {
  settings: SiteSettings;
  clients: ClientRecord[];
  services: ServiceItem[];
  caseStudies: CaseStudy[];
  products: ProductItem[];
  testimonials: TestimonialItem[];
  teamMembers: TeamMemberItem[];
  blogPosts: BlogPostItem[];
}
