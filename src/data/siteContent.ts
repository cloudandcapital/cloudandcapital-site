export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const navigation: SiteLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/#about' },
];

export const footerLinks: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/#about' },
  { label: 'Market Tape', href: 'https://market-tape.cloudandcapital.com', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dianalyst', external: true },
];

export const contactLink: SiteLink = {
  label: 'Contact',
  href: 'mailto:diana@cloudandcapital.com',
};

export const tools = [
  {
    slug: 'cloud-cost-guard-lumen',
    title: 'Cloud Cost Guard + Lumen',
    label: 'Dashboard · AI Analyst · Live',
    description:
      'Cloud, AI, and SaaS spend in one dashboard. Lumen surfaces anomalies, cost drivers, forecasts, and investigation paths in plain English.',
    href: 'https://guard.cloudandcapital.com',
    external: true,
  },
  {
    slug: 'market-tape',
    title: 'Market Tape',
    label: 'Interactive · Tool',
    description:
      'A live market dashboard tracking the rates, sectors, commodities, and risk signals shaping technology capital and infrastructure decisions.',
    href: 'https://market-tape.cloudandcapital.com',
    external: true,
  },
  {
    slug: 'signal-audit',
    title: 'Signal Audit',
    label: 'Interactive · Tool',
    description: 'A five minute diagnostic showing where cost enters the decision chain before it reaches the invoice.',
    href: '/signal-audit',
  },
  {
    slug: 'interactive-lab',
    title: 'Interactive Lab',
    label: 'Interactive · Tool',
    description:
      'Model GPU commitments, SaaS renewals, and build versus buy decisions from finance, FinOps, and engineering perspectives.',
    href: '/interactive-lab',
  },
];

export const openSourceTools = [
  {
    title: 'FinOps Lite',
    description: 'Analyze AWS, Azure, and GCP spend in one working view, with FOCUS 1.0 export for FinOps workflows.',
    href: 'https://github.com/cloudandcapital/finops-lite',
    external: true,
  },
  {
    title: 'FinOps Watchdog',
    description: 'Flag material service-level spend changes with baseline-aware detection and less alert noise.',
    href: 'https://github.com/cloudandcapital/finops-watchdog',
    external: true,
  },
  {
    title: 'Recovery Economics',
    description: 'Compare recovery cost, time, and operating tradeoffs through a FinOps decision-stress model.',
    href: 'https://github.com/cloudandcapital/recovery-economics',
    external: true,
  },
  {
    title: 'AI Cost Lens',
    description: 'Track AI and LLM spend across usage sources, with FOCUS 1.0 compliant output.',
    href: 'https://github.com/cloudandcapital/ai-cost-lens',
    external: true,
  },
  {
    title: 'SaaS Cost Analyzer',
    description: 'Track license utilization, per-seat cost analysis, and renewal forecasting for finance teams.',
    href: 'https://github.com/cloudandcapital/saas-cost-analyzer',
    external: true,
  },
  {
    title: 'Tech Spend Command Center',
    description: 'Bring cloud, SaaS, and AI spend into one executive operating view.',
    href: 'https://github.com/cloudandcapital/tech-spend-command-center',
    external: true,
  },
];

export const featuredWriting = {
  title: 'Who Gets Stuck With the Bill?',
  topic: 'Markets & Mimosas',
  date: 'Jul 20, 2026',
  href: 'https://cloudandcapital.substack.com/p/who-gets-stuck-with-the-bill',
  description:
    'The AI buildout has become a negotiation over who carries utilization risk, and who keeps the right to walk away.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'Who Gets Stuck With the Bill? Markets & Mimosas',
};

export const writingFeatured = {
  title: 'There Was No Opting Out',
  topic: 'Markets & Mimosas',
  date: 'Aug 02, 2026',
  href: 'https://cloudandcapital.substack.com/p/there-was-no-opting-out',
  description: 'Microsoft paid through capex. CoreWeave paid through debt. Apple paid through the supply chain.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'There Was No Opting Out Markets & Mimosas',
};

export const newsletter = {
  label: 'Cloud & Capital · Substack',
  title: 'Markets, AI spend, and what the bill is actually telling you.',
  description:
    'Markets & Mimosas is the Cloud & Capital newsletter on markets, AI infrastructure, cloud spend, and the decisions behind the bill. Published every other Friday.',
  subscribeHref: 'https://cloudandcapital.substack.com',
  latestIssueHref: writingFeatured.href,
};

export const writing = [
  writingFeatured,
  featuredWriting,
  {
    title: 'When Capital Becomes Compute',
    topic: 'Capital Layer',
    href: 'https://cloudandcapital.substack.com/p/when-capital-becomes-compute',
    description: 'How capital turns into infrastructure in the AI era, and why the financial models have not caught up.',
  },
  {
    title: 'Deploying Fast, Thinking Slow',
    topic: 'Deployment Rhythm',
    href: 'https://cloudandcapital.substack.com/p/deploying-fast-thinking-slow',
    description: 'Why shipping fast has a way of becoming tomorrow’s bill.',
  },
];

export const events = [
  {
    status: 'Upcoming',
    date: 'August 27, 2026',
    volume: 'Vol. 02',
    title: 'Shifting FinOps Left All the Way to the AI Code Generator',
    speaker: 'Hassan Khajeh Hosseini',
    speakerRole: 'CEO, Infracost · FinOps Foundation Governing Board Member',
    location: 'Location TBA',
    description:
      'Learn how engineering teams can bring cloud cost awareness earlier into the development lifecycle and build more cost efficient software from the start.',
    registrationUrl: 'https://luma.com/b128j01h',
    sponsor: 'Sponsored by Infracost',
  },
  {
    status: 'Past event',
    date: 'April 9, 2026',
    volume: 'Vol. 01',
    title: 'Using AI to Put the Ops in FinOps',
    location: 'Common Space Brewery · South Bay',
    description:
      'Our first LA FinOps Meetup brought finance, engineering, and cloud practitioners together for an informal evening on FinOps, AI, and the operating work behind modern technology spend.',
    sponsor: 'Sponsored by Wiv.ai',
    image: '/images/event-poster-vol01.png',
    imageAlt: 'Using AI to Put the Ops in FinOps poster',
  },
];

export const about = {
  name: 'Diana Molski',
  founderLabel: 'Founder, Cloud & Capital',
  heading: 'Finance native. Systems builder.',
  biography: [
    'My background is in finance, including Morgan Stanley and equity trading. Today I apply that risk and allocation lens to cloud, SaaS, and AI infrastructure spend.',
    'Through Cloud & Capital, I build open source FinOps tools, decision systems, and research for the point where finance and engineering meet. The goal is to make the economic consequence visible while there is still time to change the decision.',
    'I also serve as the Los Angeles regional leader for FinOps Weekly, helping bring practitioners across finance, engineering, and cloud together around the operating reality behind the bill.',
  ],
  credentials: [
    'FinOps Certified Practitioner',
    'FinOps Certified FOCUS Analyst',
    'AWS Certified Cloud Practitioner',
    'Microsoft Azure AI Fundamentals',
    'Stacklet FinOps Governance for Cloud & AI',
  ],
  recognition: 'Contributor, PointFive Cloud Efficiency Hub',
  recognitionUrl:
    'https://hub.pointfive.co/inefficiencies/overcommitted-savings-plans-after-temporary-ai-inference-demand-spikes?cloud-services=aws-savings-plans',
};
