export type Industry = '餐饮' | '教育' | '医疗' | '美业';

export type UserRole = 'merchant' | 'consultant' | 'provider' | 'admin';

export interface Product {
  id: string;
  name: string;
  logo: string;
  providerId: string;
  providerName: string;
  industry: Industry;
  rating: number;
  reviewCount: number;
  priceMin: number;
  priceMax: number;
  priceUnit: string;
  description: string;
  highlights: string[];
  afterSaleScope: string[];
  features: ProductFeature[];
  pricingPlans: PricingPlan[];
  reviews: Review[];
  cases: CaseStudy[];
  tags: string[];
  createdAt: string;
}

export interface ProductFeature {
  category: string;
  name: string;
  hasFeature: boolean;
  description?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  unit: string;
  features: string[];
  recommended: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface CaseStudy {
  id: string;
  productId: string;
  title: string;
  clientName: string;
  industry: Industry;
  description: string;
  results: string[];
  image: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  productCount: number;
  rating: number;
  establishedYear: number;
}

export interface Consultant {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  experienceYears: number;
  bio: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  industry?: Industry;
  storeCount?: number;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export type AppointmentType = 'demo' | 'consultation';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  productId?: string;
  productName?: string;
  consultantId?: string;
  consultantName?: string;
  type: AppointmentType;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export type CommunicationType = 'note' | 'call' | 'email' | 'meeting';

export interface Communication {
  id: string;
  appointmentId: string;
  userId: string;
  consultantId: string;
  content: string;
  type: CommunicationType;
  createdAt: string;
}

export interface QuestionnaireResult {
  id: string;
  userId?: string;
  industry: Industry;
  storeCount: number;
  budget: number;
  coreNeeds: string[];
  matchedProducts: MatchedProduct[];
  createdAt: string;
}

export interface MatchedProduct {
  productId: string;
  matchScore: number;
  matchReasons: string[];
}

export interface FilterOptions {
  industry?: Industry;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  features?: string[];
  afterSaleScope?: string[];
  sortBy?: 'rating' | 'price-asc' | 'price-desc' | 'reviewCount';
  search?: string;
}

export interface DashboardStats {
  totalFavorites: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalReviews: number;
}

export interface ProviderStats {
  totalProducts: number;
  totalInquiries: number;
  pendingInquiries: number;
  totalCases: number;
  avgRating: number;
  totalViews: number;
}
