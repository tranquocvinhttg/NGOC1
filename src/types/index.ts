export interface Advisor {
  name: string;
  title: string;
  phone: string;
  rawPhone: string;
  hotline: string;
  email: string;
}

export interface WorkingHours {
  weekdays: string;
  weekend: string;
}

export interface BrandData {
  name: string;
  fullName: string;
  branchName: string;
  slogan: string;
  logoUrl: string;
  advisor: Advisor;
  workingHours: WorkingHours;
}

export interface NavigationItem {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
}

export interface GuideStep {
  step: number;
  title: string;
  text: string;
  imageUrl: string;
}

export interface GuideItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  videoUrl?: string;
  steps: GuideStep[];
}

export interface FaqData {
  title: string;
  question: string;
  promptFeedback: string;
  feedbackPositive: string;
  feedbackNegative: string;
  endConversation: string;
  guides: GuideItem[];
}

export interface AppDownloadFeature {
  title: string;
  description: string;
}

export interface AppDownloadData {
  title: string;
  subtitle: string;
  iosUrl: string;
  androidUrl: string;
  features: AppDownloadFeature[];
}

export interface FlappyGameData {
  id: string;
  name: string;
  subtitle: string;
  rules: string;
  winScore: number;
  voucherReward: string;
  motivationalQuotes: {
    tier1: string;
    tier2: string;
    tier3: string;
    tier4: string;
    tier5: string;
  };
  loseMessage: string;
  winTitle: string;
  winSubtitle: string;
  instructions: string;
}

export interface SnakeGameData {
  id: string;
  name: string;
  subtitle: string;
  rules: string[];
  milestone20: string;
  milestone40: string;
  loseUnder20: string;
  finish20to39: string;
  finish40Plus: string;
  receiptNote: string;
}

export interface PresetTerm {
  months: number;
  label: string;
  rate: number;
}

export interface SavingsData {
  title: string;
  subtitle: string;
  videoUrl: string;
  defaultAmount: number;
  minAmount: number;
  errorAmount: string;
  errorTerm: string;
  errorRate: string;
  presetTerms: PresetTerm[];
}

export interface LoanCycle {
  id: string;
  name: string;
  divisor: number;
  stepMonths: number;
}

export interface RoundingRule {
  id: string;
  name: string;
}

export interface LoansData {
  title: string;
  methodTitle: string;
  description: string;
  rules: string[];
  defaultLoanAmount: number;
  defaultMonths: number;
  defaultInterestRate: number;
  cycles: LoanCycle[];
  roundingRules: RoundingRule[];
}

export interface ProductItem {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  tags: string[];
}

export interface FeaturedProductsData {
  title: string;
  description: string;
  advisorContactPrompt: string;
  categories: string[];
  items: ProductItem[];
}

export interface BranchItem {
  id: number;
  stt: number;
  branch: string;
  room: string;
  address: string;
  imageUrl: string;
  cleanImageUrl: string;
  googleMapsUrl: string;
  hotline: string;
  rawHotline: string;
  isHeadquarter?: boolean;
}

export interface BranchesData {
  title: string;
  subtitle: string;
  workingHours: {
    title: string;
    details: string[];
  };
  items: BranchItem[];
}

export interface ContentData {
  brand: BrandData;
  navigation: NavigationItem[];
  faq: FaqData;
  appDownload: AppDownloadData;
  games: {
    flappy: FlappyGameData;
    snake: SnakeGameData;
  };
  savings: SavingsData;
  loans: LoansData;
  featuredProducts: FeaturedProductsData;
  branches: BranchesData;
}

export interface VoucherRecord {
  game: 'flappy' | 'snake';
  code: string;
  reward: string;
  score: number;
  timestamp: string;
}
