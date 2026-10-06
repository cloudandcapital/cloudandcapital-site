export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const navigation: SiteLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Tools', href: '/tools' },
  { label: 'Writing', href: '/#writing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const footerLinks: SiteLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Tools', href: '/#tools' },
  { label: 'Writing', href: '/#writing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Substack', href: 'https://cloudandcapital.substack.com', external: true },
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
      'Estimate a route from published prices, review a bill with the usage you have, and calculate cost per ready result when you can verify outcomes.',
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
    description: 'Review AI price scenarios and bills; compare cost per ready result when matched usage and outcome evidence is available.',
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
  title: 'The Nasdaq Hit a Record. Your Account Might Not Agree.',
  topic: 'Markets & Mimosas',
  date: 'September 27, 2026',
  href: 'https://cloudandcapital.substack.com/p/the-nasdaq-hit-a-record-your-account',
  description:
    'The Nasdaq hit a record while smaller stocks fell. I looked at who was actually rising, what oil and rates were doing, and how the AI buildout is being paid for.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'Markets & Mimosas illustration',
  archiveImage: '/images/writing/markets-mimosas-hero.png',
  archiveImageAlt: 'Markets & Mimosas artwork',
};

export const writingFeatured = {
  title: 'The Decision Layer',
  topic: 'The Decision Layer · Issue No. 1',
  date: 'August 14, 2026',
  href: 'https://cloudandcapital.substack.com/p/the-decision-layer',
  description: 'Technology costs take shape long before the bill arrives: in what gets built, what gets locked in, and what quietly becomes the default.',
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
  headingLead: 'Hi, I’m Diana.',
  headingMiddle: 'I like a good',
  headingItalic: 'money question.',
  biography: [
    'I started out as a beauty advisor, then worked in pet salons. I began following the markets in 2020, earned a finance degree, and later worked in wealth management at Morgan Stanley.',
    'These days I build free tools and write about markets, money, and what I’m learning. Some questions turn into articles. Others turn into tools people can actually use.',
  ],
  credentials: [
    { category: 'FINOPS', detail: 'FinOps Certified Practitioner · FinOps Certified FOCUS Analyst' },
    { category: 'CLOUD + AI', detail: 'AWS Certified Cloud Practitioner · Microsoft Azure AI Fundamentals' },
    { category: 'GOVERNANCE', detail: 'Stacklet FinOps Governance for Cloud & AI' },
    { category: 'AI BUILDING', detail: 'Claude Partner Badge · Claude Code' },
  ],
  recognition: 'PointFive Cloud Efficiency Hub',
  recognitionUrl:
    'https://hub.pointfive.co/inefficiencies/overcommitted-savings-plans-after-temporary-ai-inference-demand-spikes?cloud-services=aws-savings-plans',
};
