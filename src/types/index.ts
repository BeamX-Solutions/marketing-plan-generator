export interface User {
  id: string;
  email: string;
  businessName?: string;
  industry?: string;
  profileData?: Record<string, string | number | boolean>;
  subscriptionStatus: string;
  marketingConsent: boolean;
}

export interface BusinessContext {
  industry: string;
  businessModel: 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace';
  companySize: string;
  yearsInOperation: string;
  geographicScope: string;
  primaryChallenges: string[];
  marketingMaturity: 'beginner' | 'intermediate' | 'advanced';
  marketingBudget: string;
  timeAvailability: string;
  businessGoals: string[];
}

export interface TargetMarketData {
  demographics: {
    age?: string;
    income?: string;
    location?: string;
  };
  psychographics: {
    goals?: string;
    values?: string[];
    interests?: string[];
  };
  painPoints: string[];
  customerSources: string[];
  buyingBehavior: {
    decisionProcess?: string;
    timeline?: string;
    factors?: string[];
  };
  decisionProcess: {
    steps?: string[];
    timeline?: string;
    influencers?: string[];
  };
  budgetConstraints: {
    range?: string;
    sensitivity?: string;
    factors?: string[];
  };
  communicationChannels: string[];
  testimonials: string[];
}

export interface ValuePropositionData {
  coreProblem: string;
  uniqueAdvantages: string[];
  tangibleBenefits: string[];
  emotionalBenefits: string[];
  proofPoints: string[];
  brandPersonality: string[];
  keyMessages: string[];
  differentiation: string[];
  successStories: string[];
}

export interface MediaChannelsData {
  currentChannels: {
    channel: string;
    effectiveness: number;
    budget?: number;
  }[];
  digitalPreferences: {
    channels: string[];
    budget?: number;
    experience?: string;
  };
  traditionalMarketing: {
    channels: string[];
    effectiveness?: number;
  };
  contentCreation: {
    types: string[];
    frequency?: string;
    resources?: string[];
  };
  socialMedia: {
    platforms: string[];
    engagement?: string;
    strategy?: string;
  };
  paidAdvertising: {
    platforms: string[];
    budget?: number;
    experience?: string;
  };
  publicRelations: {
    activities: string[];
    contacts?: string[];
  };
  partnerships: {
    types: string[];
    current?: string[];
  };
  eventMarketing: {
    types: string[];
    frequency?: string;
  };
}

export interface LeadCaptureData {
  currentMethods: {
    methods: string[];
    effectiveness?: number;
  };
  websiteOptimization: {
    conversionRate?: number;
    improvements?: string[];
  };
  leadMagnets: {
    current: string[];
    planned?: string[];
  };
  contactCollection: {
    methods: string[];
    tools?: string[];
  };
  landingPages: {
    count?: number;
    conversionRate?: number;
  };
  callToActions: {
    types: string[];
    effectiveness?: number;
  };
  formOptimization: {
    fields: string[];
    conversionRate?: number;
  };
  leadQuality: {
    scoring?: string;
    qualification?: string[];
  };
  tracking: {
    tools: string[];
    metrics?: string[];
  };
}

export interface LeadNurturingData {
  followUpProcesses: {
    timeline: string;
    methods: string[];
    automation?: boolean;
  };
  emailMarketing: {
    frequency: string;
    types: string[];
    automation?: boolean;
  };
  crmUsage: {
    system?: string;
    features: string[];
  };
  contentMarketing: {
    types: string[];
    frequency?: string;
  };
  education: {
    methods: string[];
    topics?: string[];
  };
  relationshipBuilding: {
    strategies: string[];
    touchpoints?: string[];
  };
  personalization: {
    level: string;
    methods?: string[];
  };
  automation: {
    tools: string[];
    workflows?: string[];
  };
  community: {
    platforms: string[];
    engagement?: string;
  };
}

export interface SalesConversionData {
  salesProcess: {
    steps: string[];
    timeline?: string;
  };
  salesCycle: {
    length: string;
    stages?: string[];
  };
  decisionMakers: {
    roles: string[];
    influence?: string[];
  };
  commonObjections: string[];
  pricingStrategy: {
    model: string;
    tiers?: string[];
    negotiation?: boolean;
  };
  proposals: {
    format: string;
    components?: string[];
  };
  contracts: {
    process: string;
    terms?: string[];
  };
  salesTeam: {
    size?: number;
    roles?: string[];
  };
  metrics: {
    conversionRate?: number;
    averageDealSize?: number;
  };
}

export interface CustomerExperienceData {
  deliveryMethod: {
    process: string;
    timeline?: string;
  };
  qualityAssurance: {
    measures: string[];
    standards?: string[];
  };
  onboarding: {
    process: string;
    duration?: string;
  };
  support: {
    channels: string[];
    hours?: string;
  };
  feedbackCollection: {
    methods: string[];
    frequency?: string;
  };
  problemResolution: {
    process: string;
    timeline?: string;
  };
  successMetrics: {
    kpis: string[];
    targets?: Record<string, number>;
  };
  optimization: {
    methods: string[];
    frequency?: string;
  };
  training: {
    provided: boolean;
    methods?: string[];
  };
}

export interface LifetimeValueData {
  retention: {
    rate?: number;
    strategies: string[];
  };
  upselling: {
    opportunities: string[];
    success?: number;
  };
  subscriptionModel: {
    hasSubscription: boolean;
    renewalRate?: number;
  };
  loyaltyPrograms: {
    programs: string[];
    participation?: number;
  };
  pricingOptimization: {
    strategies: string[];
    testing?: boolean;
  };
  expansion: {
    opportunities: string[];
    revenue?: number;
  };
  journeyOptimization: {
    touchpoints: string[];
    improvements?: string[];
  };
  renewals: {
    rate?: number;
    process?: string;
  };
  revenueOptimization: {
    strategies: string[];
    impact?: number;
  };
}

export interface ReferralSystemData {
  currentSources: {
    percentage?: number;
    sources: string[];
  };
  advocacyPrograms: {
    programs: string[];
    participation?: number;
  };
  incentives: {
    types: string[];
    effectiveness?: number;
  };
  partnerships: {
    partners: string[];
    referrals?: number;
  };
  wordOfMouth: {
    strategies: string[];
    tracking?: boolean;
  };
  successStories: {
    collection: string[];
    usage?: string[];
  };
  communityBuilding: {
    platforms: string[];
    engagement?: string;
  };
  influencers: {
    relationships: string[];
    impact?: string;
  };
  socialProof: {
    types: string[];
    placement?: string[];
  };
}

export interface QuestionnaireResponses {
  // Square 1: Target Market
  targetMarket: TargetMarketData;
  
  // Square 2: Value Proposition
  valueProposition: ValuePropositionData;
  
  // Square 3: Media Channels
  mediaChannels: MediaChannelsData;
  
  // Square 4: Lead Capture
  leadCapture: LeadCaptureData;
  
  // Square 5: Lead Nurturing
  leadNurturing: LeadNurturingData;
  
  // Square 6: Sales Conversion
  salesConversion: SalesConversionData;
  
  // Square 7: Customer Experience
  customerExperience: CustomerExperienceData;
  
  // Square 8: Lifetime Value
  lifetimeValue: LifetimeValueData;
  
  // Square 9: Referral System
  referralSystem: ReferralSystemData;
}

export interface ClaudeAnalysis {
  businessModelAssessment: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketOpportunity: {
    size: string;
    growth: string;
    trends: string[];
    barriers: string[];
  };
  competitivePositioning: {
    competitors: string[];
    advantages: string[];
    differentiators: string[];
  };
  customerAvatarRefinement: {
    primaryAvatar: {
      demographics: Record<string, string>;
      psychographics: Record<string, string>;
      painPoints: string[];
    };
    secondaryAvatars?: Array<{
      demographics: Record<string, string>;
      psychographics: Record<string, string>;
      painPoints: string[];
    }>;
  };
  strategicRecommendations: string[];
  riskFactors: string[];
  growthPotential: {
    shortTerm: string;
    longTerm: string;
    scalability: string;
    investmentNeeded: string;
  };
}

export interface GeneratedContent {
  onePagePlan: {
    before: {
      targetMarket: string;
      message: string;
      media: string[];
    };
    during: {
      leadCapture: string;
      leadNurture: string;
      salesConversion: string;
    };
    after: {
      deliverExperience: string;
      lifetimeValue: string;
      referrals: string;
    };
  };
  implementationGuide: {
    executiveSummary: string;
    actionPlans: {
      phase1: string;
      phase2: string;
      phase3: string;
    };
    timeline: string;
    resources: string;
    kpis: string;
    templates: string;
  };
  strategicInsights: {
    strengths: string[];
    opportunities: string[];
    positioning: string;
    competitiveAdvantage: string;
    growthPotential: string;
    risks: string[];
    investments: string[];
    roi: string;
  };
}

export interface PlanMetadata {
  totalProcessingTime?: number;
  generatedAt?: string;
  version?: string;
  error?: string;
  failedAt?: string;
}

export interface Plan {
  id: string;
  userId: string;
  businessContext: BusinessContext;
  questionnaireResponses: QuestionnaireResponses;
  claudeAnalysis?: ClaudeAnalysis;
  generatedContent?: GeneratedContent;
  planMetadata?: PlanMetadata;
  status: 'in_progress' | 'analyzing' | 'generating' | 'completed' | 'failed';
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  user?: User;
}

export interface ClaudeInteractionData {
  businessContext?: BusinessContext;
  responses?: QuestionnaireResponses;
  analysis?: ClaudeAnalysis;
  filename?: string;
  fileSize?: number;
  error?: string;
  emailSent?: boolean;
  recipientEmail?: string;
  success?: boolean;
  message?: string;
}

export interface ClaudeResponseData {
  tracked?: boolean;
  timestamp?: string;
  success?: boolean;
  sentAt?: string;
  emailType?: string;
  downloadedAt?: string;
  errorAt?: string;
}

export interface ClaudeInteraction {
  id: string;
  planId: string;
  interactionType: string;
  promptData: ClaudeInteractionData;
  claudeResponse: ClaudeResponseData;
  tokensUsed?: number;
  processingTimeMs?: number;
  createdAt: string;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  commonChallenges: string[];
  keyMetrics: string[];
  marketingChannels: string[];
}

export interface Question {
  id: string;
  square: number;
  text: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'range';
  options?: string[];
  required: boolean;
  helpText?: string;
  placeholder?: string;
  validation?: Record<string, string | number | boolean>;
  conditional?: {
    field: string;
    operator: 'equals' | 'includes' | 'greater_than' | 'less_than';
    value: string | number | boolean;
  };
}