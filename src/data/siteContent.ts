export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const navigation: SiteLink[] = [
  { label: 'Tools', href: '/tools' },
  { label: 'Services', href: '/services' },
  { label: 'Guides & writing', href: '/insights' },
  { label: 'Investing & Trading', href: '/learn' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const footerLinks: SiteLink[] = [
  ...navigation,
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
    label: 'Billing CSV · Local analysis · Live',
    description:
      'Upload a supported cloud billing CSV to see spending and cost drivers. Add an earlier bill to compare periods. Your records are processed in your browser.',
    href: 'https://guard.cloudandcapital.com',
    external: true,
  },
  {
    slug: 'market-tape',
    title: 'Market Tape',
    label: 'Interactive · Tool',
    description:
      'Explore rates, sectors, commodities, and market context in a research dashboard.',
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
    description: 'Bring analytical results into one traceable report while keeping their accounting boundaries explicit.',
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

export const marketsMimosasSeptember27 = {
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

export const marketsMimosasOctober11 = {
  title: 'The AI Memory Boom Reached the Raspberry Pi',
  topic: 'Markets & Mimosas',
  date: 'October 11, 2026',
  href: 'https://cloudandcapital.substack.com/p/the-ai-memory-boom-is-making-fortunes',
  description:
    'The shortage is real. The profits are enormous. The market question is how much of that good news investors have already paid for.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'A mimosa overlooking the coast at sunset',
  archiveImage: '/images/writing/markets-mimosas-hero.png',
  archiveImageAlt: 'Markets & Mimosas series artwork: a mimosa overlooking the coast at sunset',
};

export const marketsMimosasLatest = {
  title: 'Oil Went Up. Gold Went Down. Everybody Got Nervous.',
  topic: 'Markets & Mimosas',
  date: 'October 24, 2026',
  href: 'https://cloudandcapital.substack.com/p/oil-went-up-gold-went-down-everybody',
  description:
    'The market spent two weeks worrying about inflation, AI and where to hide.',
  image: '/images/writing/markets-mimosas-hero.png',
  imageAlt: 'A mimosa overlooking the coast at sunset',
  archiveImage: '/images/writing/markets-mimosas-hero.png',
  archiveImageAlt: 'Markets & Mimosas series artwork: a mimosa overlooking the coast at sunset',
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
    'Cloud & Capital covers markets and investing, AI, business costs, and technology economics. Markets & Mimosas follows the questions behind the headlines.',
  subscribeHref: 'https://cloudandcapital.substack.com',
  latestIssueHref: marketsMimosasLatest.href,
};

export const writing = [
  writingFeatured,
  marketsMimosasLatest,
  marketsMimosasOctober11,
  marketsMimosasSeptember27,
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

// Keep the featured essay while rotating the two recent reads by publication date.
// Adding a dated article to writing moves the former latest into the previous slot.
export function selectHomepageWriting(articles: typeof writing, featured = writingFeatured) {
  const recent = [...articles]
    .filter((article) => article.href !== featured.href)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return [featured, ...recent.slice(0, 2)];
}

export const homepageWriting = selectHomepageWriting(writing);

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
  heading: 'Hi, I’m Diana.',
  biography: [
    "I’m a mom, a lifelong internet nerd, and almost always in the middle of building something. I love a good rabbit hole, especially one that ends with something I can share.",
    "I earned my finance degree at Cal State Dominguez Hills, where I was selected to represent the university in the CFA Institute Research Challenge. I then worked in wealth management at Morgan Stanley.",
    "Today, I look at cloud, AI and software through a finance lens: what it costs, what you get, and whether it’s worth it. At Cloud & Capital, I build tools and automations, share how they work, and write Markets & Mimosas, my newsletter about money, markets and technology.",
    "Before finance, I worked in beauty and with animals, two of my other favorite things! I’m the daughter of Polish immigrants and grew up in LA’s South Bay, where I still live with my teenage son and our dog, Myszka.",
    "Have a look around. Try a tool, read something, or say hello.",
  ],
  credentials: [
    { category: 'BOOKKEEPING', detail: 'Intuit Certified Bookkeeping Professional' },
    { category: 'FINOPS', detail: 'FinOps Certified Practitioner · FinOps Certified FOCUS Analyst' },
    { category: 'CLOUD + AI', detail: 'AWS Certified Cloud Practitioner · Microsoft Azure AI Fundamentals' },
    { category: 'GOVERNANCE', detail: 'Stacklet FinOps Governance for Cloud & AI' },
    { category: 'BUILDING WITH AI', detail: 'Claude Code · OpenAI Codex' },
  ],
  recognition: 'PointFive Cloud Efficiency Hub',
  recognitionUrl:
    'https://hub.pointfive.co/inefficiencies/overcommitted-savings-plans-after-temporary-ai-inference-demand-spikes?cloud-services=aws-savings-plans',
};
