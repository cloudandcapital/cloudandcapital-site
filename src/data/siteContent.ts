export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const navigation: SiteLink[] = [
  { label: 'Tools', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const footerLinks: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/#about' },
  { label: 'Market Tape', href: 'https://market-tape.cloudandcapital.com', external: true },
  { label: 'Substack', href: 'https://cloudandcapital.substack.com', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dianalyst', external: true },
];

export const contactLink: SiteLink = {
  label: 'Contact',
  href: 'mailto:diana@cloudandcapital.com',
};

export const tools = [
  {
    slug: 'ai-cost-lens',
    title: 'AI Cost Lens',
    label: 'New · Open Source · Live',
    description:
      'Bring AI bills, usage, infrastructure, and human review into one comparison so you can see what a usable result really cost.',
    href: 'https://lens.cloudandcapital.com',
    external: true,
    sourceHref: 'https://github.com/cloudandcapital/ai-cost-lens',
  },
  {
    slug: 'cloud-cost-guard-lumen',
    title: 'Cloud Cost Guard + Lumen',
    label: 'Dashboard · AI Analyst · Live',
    description:
      'Investigate cloud, AI, and SaaS spend in one place. Lumen points to anomalies, cost drivers, forecasts, and the next question to ask.',
    href: 'https://guard.cloudandcapital.com',
    external: true,
  },
  {
    slug: 'market-tape',
    title: 'Market Tape',
    label: 'Interactive · Tool',
    description:
      'A live dashboard tracking 52 rates, sectors, commodities, and risk signals that affect technology and infrastructure spending.',
    href: 'https://market-tape.cloudandcapital.com',
    external: true,
  },
  {
    slug: 'signal-audit',
    title: 'Signal Audit',
    label: 'Interactive · Tool',
    description: 'A five-minute diagnostic showing where cost enters the decision chain before it reaches the invoice.',
    href: '/signal-audit',
  },
  {
    slug: 'interactive-lab',
    title: 'Interactive Lab',
    label: 'Interactive · Tool',
    description:
      'Turn one real question about cloud, AI, SaaS, or technology spend into a structured decision brief grounded in the context you provide.',
    href: '/interactive-lab',
  },
];

export const openSourceTools = [
  {
    title: 'FinOps Lite',
    description: 'Reconcile AWS Cost Explorer service and daily views into one dependable cost dataset for downstream analysis.',
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
    description: 'Compare AI cost per usable result across providers or routes while keeping financial evidence and savings gates explicit.',
    href: 'https://github.com/cloudandcapital/ai-cost-lens',
    external: true,
  },
  {
    title: 'SaaS Cost Analyzer',
    description: 'Review utilization, seat economics, ownership evidence, and renewal exposure without turning missing data into savings claims.',
    href: 'https://github.com/cloudandcapital/saas-cost-analyzer',
    external: true,
  },
  {
    title: 'Tech Spend Command Center',
    description: 'Validate five analytical results into one hash-locked trusted report without combining incompatible accounting boundaries.',
    href: 'https://github.com/cloudandcapital/tech-spend-command-center',
    external: true,
  },
];

export const featuredWriting = {
  title: 'Who Gets Stuck With the Bill?',
  topic: 'Markets & Mimosas',
  date: 'July 20, 2026',
  href: 'https://cloudandcapital.substack.com/p/who-gets-stuck-with-the-bill',
  description:
    'The AI buildout has become a negotiation over who carries utilization risk, and who keeps the right to walk away.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'Who Gets Stuck With the Bill? Markets & Mimosas',
  archiveImage: '/images/writing/who-gets-stuck-with-the-bill.png',
  archiveImageAlt: 'Who Gets Stuck With the Bill? published cover artwork',
};

export const marketsMimosasLatest = {
  title: 'The Grid Sent the Bill Back',
  topic: 'Markets & Mimosas',
  date: 'August 31, 2026',
  href: 'https://cloudandcapital.substack.com/p/the-grid-sent-the-bill-back',
  description:
    'AI demand is forcing utilities, regulators, and large customers to decide who pays for the grid built ahead of it.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'The Grid Sent the Bill Back Markets & Mimosas',
  archiveImage: '/images/writing/markets-mimosas-hero.png',
  archiveImageAlt: 'The Grid Sent the Bill Back Markets & Mimosas',
};

export const writingFeatured = {
  title: 'The Decision Layer',
  topic: 'The Decision Layer · Issue No. 1',
  date: 'August 14, 2026',
  href: 'https://cloudandcapital.substack.com/p/the-decision-layer',
  description: 'The choices that shape technology cost before the bill arrives.',
  image: '/images/writing/the-decision-layer.png',
  imageAlt: 'Editorial cover for The Decision Layer showing three architectural gates leading to a ledger',
  archiveImage: '/images/writing/the-decision-layer.png',
  archiveImageAlt: 'Editorial cover for The Decision Layer showing three architectural gates leading to a ledger',
};

export const newsletter = {
  label: 'Cloud & Capital · Substack',
  title: 'Money, markets, AI, and the business behind the numbers.',
  description:
    'Cloud & Capital covers markets and investing, practical AI, business costs, and technology economics. Markets & Mimosas is the recurring market column. Published twice monthly.',
  subscribeHref: 'https://cloudandcapital.substack.com',
  latestIssueHref: marketsMimosasLatest.href,
};

export const writing = [
  writingFeatured,
  marketsMimosasLatest,
  featuredWriting,
  {
    title: 'When Capital Becomes Compute',
    topic: 'AI Infrastructure',
    date: 'February 20, 2026',
    href: 'https://cloudandcapital.substack.com/p/when-capital-becomes-compute',
    description: 'How equity, infrastructure, and compute are reinforcing each other beneath the AI narrative.',
    archiveImage: '/images/writing/when-capital-becomes-compute.png',
    archiveImageAlt: 'When Capital Becomes Compute published cover artwork',
  },
  {
    title: 'Deploying Fast, Thinking Slow',
    topic: 'Cloud Economics',
    date: 'January 22, 2026',
    href: 'https://cloudandcapital.substack.com/p/deploying-fast-thinking-slow',
    description: 'Why cloud decisions get expensive when they outlive their context.',
    archiveImage: '/images/writing/deploying-fast-thinking-slow.png',
    archiveImageAlt: 'Deploying Fast, Thinking Slow published cover artwork',
  },
  {
    title: 'Why Even Well-Run Teams Still Struggle With Cloud Costs',
    topic: 'Cloud Economics',
    date: 'December 29, 2025',
    href: 'https://cloudandcapital.substack.com/p/why-even-well-run-teams-still-struggle',
    description: 'How timing, defaults, and reasonable decisions compound into cost problems.',
    archiveImage: '/images/writing/why-well-run-teams-struggle-with-cloud-costs.png',
    archiveImageAlt: 'Why Even Well-Run Teams Still Struggle With Cloud Costs published cover artwork',
  },
];

export const events = [
  {
    status: 'Past event',
    date: 'April 2026',
    volume: 'Vol. 01',
    title: 'Using AI to Put the Ops in FinOps',
    location: 'Common Space Brewery · Hawthorne, California',
    description:
      'Diana organized and hosted the first FinOps Weekly Los Angeles meetup, bringing finance, engineering, cloud, and FinOps practitioners together with speakers from Ulta Beauty and Wiv.ai.',
    sponsor: 'Sponsored by Wiv.ai',
    image: '/images/event-poster-vol01.png',
    imageAlt: 'Using AI to Put the Ops in FinOps poster',
  },
];

export const about = {
  name: 'Diana Molski',
  founderLabel: 'Founder, Cloud & Capital',
  heading: "Hi, I'm Diana.",
  biography: [
    'I started my career at Morgan Stanley and later traded equities. I earned my B.S. in Business Administration, Finance from California State University, Dominguez Hills.',
    'Today I work across forecasting, financial modeling, cost analysis, cloud and AI economics, and public tools. I am comfortable moving between a spreadsheet, a dataset, a dashboard, and a conversation with finance or technical teams.',
    'In April 2026, I organized and hosted the first FinOps Weekly Los Angeles meetup, bringing finance, engineering, cloud, and FinOps people into the same room.',
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
