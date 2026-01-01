import { Clapperboard, MonitorPlay, Scissors, Wand2, Music, Layers, Palette, Laptop, Download, MessageCircle, Upload, GraduationCap } from 'lucide-react';
import { CurriculumModule, FAQItem, Review, VideoTestimonial, BentoFeature, Course } from './types';

// Changed from Tickers to Editing Software/Terms
export const SCROLL_ITEMS = [
  { text: 'Adobe Premiere Pro', type: 'software' },
  { text: 'DaVinci Resolve', type: 'software' },
  { text: 'After Effects', type: 'software' },
  { text: 'Color Grading', type: 'skill' },
  { text: 'Sound Design', type: 'skill' },
  { text: 'Storytelling', type: 'skill' },
  { text: 'Final Cut Pro', type: 'software' },
  { text: 'Visual Effects', type: 'skill' },
  { text: 'Freelancing', type: 'career' },
];

export const COURSES: Course[] = [
  {
    id: 'capcut',
    title: 'CapCut Mastery',
    description: 'Master viral editing on your phone. Create reels that get millions of views using just your smartphone.',
    image: 'https://res.cloudinary.com/duhqg4u4k/image/upload/v1767289284/1_foeoqt.png',
    tags: ['Mobile Editing', 'Reels', 'Shorts'],
    status: 'available',
    accentColor: 'teal'
  },
  {
    id: 'video-editing',
    title: 'Pro Video Editing',
    description: 'The complete industry standard curriculum. Premiere Pro & DaVinci Resolve for serious filmmakers.',
    image: 'https://res.cloudinary.com/duhqg4u4k/image/upload/v1767289279/2_kt1ah8.png',
    tags: ['Premiere Pro', 'After Effects'],
    status: 'coming_soon',
    accentColor: 'purple'
  },
  {
    id: 'ai-filmmaking',
    title: 'AI Filmmaking',
    description: 'Future-proof your creative career by mastering the AI, Generate cinematic video, using tools like Sora, Runway, and Midjourney.',
    image: 'https://res.cloudinary.com/duhqg4u4k/image/upload/v1767289470/Untitled_design_3_wqfnxx.png',
    tags: ['Sora', 'Midjourney', 'Runway'],
    status: 'coming_soon',
    accentColor: 'orange'
  }
];

export const TRUSTED_CREATORS = [
  {
    name: "IMAN GADZHI",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043613/editing%20school/2_bjdjn0.png",
    stats: [
      { platform: 'youtube', value: '5.4M' },
      { platform: 'tiktok', value: '3.7M' }
    ]
  },
  {
    name: "WENDYSKIN",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043609/editing%20school/1_sag9mt.png",
    stats: [
      { platform: 'instagram', value: '663K' },
      { platform: 'youtube', value: '3.4M' },
      { platform: 'tiktok', value: '1.1M' }
    ]
  },
  {
    name: "ALI ABDAAL",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043609/editing%20school/8_d5wxcq.png",
    stats: [
      { platform: 'instagram', value: '538K' },
      { platform: 'youtube', value: '4.05M' }
    ]
  },
  {
    name: "JUN YUH",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043606/editing%20school/5_fazblr.png",
    stats: [
      { platform: 'instagram', value: '5.5M' },
      { platform: 'youtube', value: '719K' },
      { platform: 'tiktok', value: '2.4M' }
    ]
  },
  {
    name: "KINOBODY",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043604/editing%20school/3_q6lopb.png",
    stats: [
      { platform: 'instagram', value: '1.5M' },
      { platform: 'youtube', value: '753K' },
      { platform: 'tiktok', value: '1.5M' }
    ]
  },
  {
    name: "MORIBYAN",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043595/editing%20school/4_omxdfc.png",
    stats: [
      { platform: 'instagram', value: '2.5M' },
      { platform: 'youtube', value: '1.2M' }
    ]
  },
  {
    name: "JAY SHETTY",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043594/editing%20school/7_tofhkl.png",
    stats: [
      { platform: 'instagram', value: '12M' },
      { platform: 'youtube', value: '4.8M' }
    ]
  },
  {
    name: "CHRIS HERIA",
    image: "https://res.cloudinary.com/duhqg4u4k/image/upload/v1767043592/editing%20school/6_jyfokc.png",
    stats: [
      { platform: 'youtube', value: '9.8M' },
      { platform: 'instagram', value: '1.4M' }
    ]
  }
];

export const HOW_IT_WORKS = [
  {
    id: 1,
    title: "Access Course Assets",
    description: "Download 500GB+ of raw footage, music stems, and project files used in real movies.",
    icon: Download,
    accent: "cyan"
  },
  {
    id: 2,
    title: "Watch & Practice",
    description: "Follow along with Karthik as he breaks down complex edits, color grading, and sound mixing.",
    icon: Scissors,
    accent: "teal"
  },
  {
    id: 3,
    title: "Get Expert Feedback",
    description: "Submit your edits for review. We give detailed breakdown on pacing, cuts, and story.",
    icon: MessageCircle,
    accent: "sky"
  },
  {
    id: 4,
    title: "Launch Your Career",
    description: "Build a killer portfolio and get placed in top media houses or start freelancing.",
    icon: GraduationCap,
    accent: "blue"
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Arun Kumar',
    image: 'https://picsum.photos/100/100?random=1',
    rating: 5,
    text: "The Tamil explanation of Color Grading in DaVinci Resolve was a game changer. I'm now editing for two YouTube channels!",
    date: '2 days ago'
  },
  {
    id: '2',
    name: 'Priya Rajan',
    image: 'https://picsum.photos/100/100?random=2',
    rating: 5,
    text: "Karthik anna teaches practical editing, not just tools. The storytelling module helped me land my first wedding film project.",
    date: '1 week ago'
  },
  {
    id: '3',
    name: 'Siva Ganesan',
    image: 'https://picsum.photos/100/100?random=3',
    rating: 5,
    text: "Best editing course in Tamil. Finally understood J-cuts, L-cuts and pacing. Worth every rupee.",
    date: '2 weeks ago'
  },
];

export const TESTIMONIALS: VideoTestimonial[] = [
  {
    id: '1',
    name: 'Vijay S.',
    location: 'Chennai',
    quote: 'Started earning ₹30k/month freelancing after this course.',
    thumbnail: 'https://picsum.photos/600/400?random=4',
    duration: '2:14'
  },
  {
    id: '2',
    name: 'Deepa M.',
    location: 'Coimbatore',
    quote: 'From zero knowledge to editing my own short films in 3 months.',
    thumbnail: 'https://picsum.photos/600/400?random=5',
    duration: '3:45'
  },
  {
    id: '3',
    name: 'Karthik R.',
    location: 'Madurai',
    quote: 'The section on Audio Mixing changed how I edit videos forever.',
    thumbnail: 'https://picsum.photos/600/400?random=6',
    duration: '1:58'
  }
];

export const CURRICULUM: CurriculumModule[] = [
  {
    id: 1,
    title: 'Fundamentals of Editing & Storytelling',
    lessonCount: 6,
    duration: '3 Hours',
    lessons: ['The Grammar of Editing', 'Understanding Frame Rates & Resolutions', 'Project Organization', 'The Art of the Cut', 'Story Arc Basics']
  },
  {
    id: 2,
    title: 'Premiere Pro Mastery',
    lessonCount: 12,
    duration: '6 Hours',
    lessons: ['Interface Deep Dive', 'Timeline Workflow', 'Multi-Cam Editing', 'Keyframing & Animation', 'Essential Graphics Panel', 'Export Settings']
  },
  {
    id: 3,
    title: 'Cinematic Color Grading (DaVinci)',
    lessonCount: 8,
    duration: '5 Hours',
    lessons: ['Color Correction vs Grading', 'Reading Scopes', 'Teal & Orange Look', 'Matching Skin Tones', 'Creating LUTs', 'Node Based Workflow']
  },
  {
    id: 4,
    title: 'Audio Engineering for Video',
    lessonCount: 5,
    duration: '3 Hours',
    lessons: ['Audio Syncing', 'Noise Reduction', 'EQ & Compression Basics', 'Sound Design & Foley', 'Mixing Music & Voice']
  },
  {
    id: 5,
    title: 'Career & Freelancing',
    lessonCount: 4,
    duration: '2 Hours',
    lessons: ['Building a Portfolio', 'Finding Clients (Upwork/Fiverr)', 'Pricing Your Work', 'Client Communication in Tamil/English']
  }
];

export const FEATURES: BentoFeature[] = [
  {
    title: 'Premiere & DaVinci',
    description: 'Master industry-standard software used in Kollywood and Hollywood.',
    icon: Laptop,
    size: 'lg'
  },
  {
    title: 'Storytelling',
    description: 'Learn the "Why" behind every cut, not just the "How".',
    icon: Clapperboard,
    size: 'md'
  },
  {
    title: 'Color Grading',
    description: 'Make your footage look cinematic with professional grading techniques.',
    icon: Palette,
    size: 'md'
  },
  {
    title: 'Sound Design',
    description: 'Elevate your visuals with immersive audio mixing.',
    icon: Music,
    size: 'sm'
  },
  {
    title: 'Motion Graphics',
    description: 'Create titles and intros using After Effects basics.',
    icon: Wand2,
    size: 'sm'
  },
  {
    title: 'Live Review',
    description: 'Weekly live sessions where we review your edits.',
    icon: MonitorPlay,
    size: 'md'
  },
  {
    title: 'Editor Community',
    description: 'Join 2,000+ Tamil creators and collaborate.',
    icon: Layers,
    size: 'lg'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Do I need a powerful PC to start?",
    answer: "Not necessarily. We teach you proxy workflows that allow you to edit 4K footage even on mid-range laptops."
  },
  {
    question: "Is this course entirely in Tamil?",
    answer: "Yes! The entire instruction is in simple, easy-to-understand Tamil, while using the English technical terms for software interfaces."
  },
  {
    question: "I am a complete beginner. Is this for me?",
    answer: "Absolutely. We start from installing the software and guide you step-by-step to professional level editing."
  },
  {
    question: "Can I get a job after this course?",
    answer: "The course covers freelancing and portfolio building. Many of our students work as freelance editors for YouTubers or in media production houses."
  }
];