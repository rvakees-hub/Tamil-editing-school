export interface Review {
  id: string;
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
}

export interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  thumbnail: string;
  duration: string;
}

export interface CurriculumModule {
  id: number;
  title: string;
  lessonCount: number;
  duration: string;
  lessons: string[];
}

export interface PricingTier {
  name: string;
  price: number;
  originalPrice: number;
  features: string[];
  isPopular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BentoFeature {
  title: string;
  description: string;
  icon: any; // Lucide icon type
  size: 'sm' | 'md' | 'lg';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: 'available' | 'coming_soon';
  accentColor: string;
}