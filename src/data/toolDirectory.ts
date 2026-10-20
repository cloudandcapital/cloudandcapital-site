import { tools } from './siteContent.ts';

export type DirectoryTool = {
  slug: string;
  topics: ToolTopic[];
  name: string;
  kind: string;
  description: string;
  bring: string;
  result: string;
  action: string;
  href: string;
  external: boolean;
  destination: string;
  source: string;
  tone: 'sage' | 'rose' | 'sand';
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  companion?: { label: string; href: string };
};

export type ToolTopic = 'tech-spending' | 'money-investing' | 'ai-automation';

export const toolTopics: { id: ToolTopic; label: string; tone: DirectoryTool['tone'] }[] = [
  { id: 'tech-spending', label: 'Tech spending', tone: 'sage' },
  { id: 'money-investing', label: 'Money & investing', tone: 'sand' },
  { id: 'ai-automation', label: 'AI & automation', tone: 'rose' },
];

function releasedTool(slug: string) {
  const tool = tools.find(item => item.slug === slug);
  if (!tool) throw new Error(`Missing tool destination: ${slug}`);
  return tool;
}

export const directoryTools: DirectoryTool[] = [
  {
    slug: 'ai-cost-lens', topics: ['tech-spending', 'ai-automation'], name: 'AI Cost Lens', kind: 'AI costs',
    description: 'Estimate an AI task, review a bill, or compare the cost of a usable result.',
    bring: 'A prompt, a price estimate, or your bill and usage records.',
    result: 'An estimate or cost breakdown, with the assumptions made clear.',
    action: 'Open AI Cost Lens', href: releasedTool('ai-cost-lens').href, external: true,
    destination: 'ai_cost_lens', source: 'work_flagship', tone: 'sage',
    image: '/images/ai-cost-lens-anatomy-preview.jpg',
    imageAlt: 'AI Cost Lens comparing model, infrastructure and human review costs for two AI routes',
    imageWidth: 1315, imageHeight: 492,
  },
  {
    slug: 'cloud-cost-guard', topics: ['tech-spending'], name: 'Cloud Cost Guard', kind: 'Cloud bills',
    description: 'See where your cloud spending went and what changed between bills.',
    bring: 'A supported billing CSV. Add an earlier bill to compare.',
    result: 'Cost drivers, a spending breakdown, and questions to investigate.',
    action: 'Review my cloud bill', href: releasedTool('cloud-cost-guard-lumen').href, external: true,
    destination: 'cloud_cost_guard', source: 'work_decision_tools', tone: 'rose',
    image: '/images/cloud-cost-guard-summary-preview.jpg',
    imageAlt: 'Cloud Cost Guard dashboard showing an illustrative spending breakdown and cost drivers',
    imageWidth: 1216, imageHeight: 474,
  },
  {
    slug: 'software-renewal-tracker', topics: ['tech-spending'], name: 'Software Renewal Tracker', kind: 'Software subscriptions',
    description: 'Keep software charges, renewal dates, and cancellation deadlines together.',
    bring: 'Your subscriptions, charges, and dates.',
    result: 'Upcoming payments and a clearer time to review each subscription.',
    action: 'Open the renewal tracker', href: '/tools/software-renewal-tracker', external: false,
    destination: 'software_renewal_tracker', source: 'work_decision_tools', tone: 'sand',
    image: '/images/software-renewal-project-desk.jpg',
    imageAlt: 'Software Renewal Tracker showing the Project desk subscription, charge and renewal date',
    imageWidth: 1168, imageHeight: 455,
    companion: { label: 'Get the renewal worksheet', href: '/resources/software-renewal' },
  },
  {
    slug: 'market-tape', topics: ['money-investing'], name: 'Market Tape', kind: 'Market dashboard',
    description: 'Explore market moves across rates, sectors, and commodities.',
    bring: 'No upload needed. Start with the dashboard.',
    result: 'Market context to explore alongside your own research.',
    action: 'Open Market Tape', href: releasedTool('market-tape').href, external: true,
    destination: 'market_tape', source: 'work_market_context', tone: 'sage',
    image: '/images/market-tape-internals-momentum.jpg',
    imageAlt: 'Market Tape dashboard showing market internals and momentum',
    imageWidth: 1104, imageHeight: 430,
  },
  {
    slug: 'signal-audit', topics: ['tech-spending'], name: 'Signal Audit', kind: '12 question diagnostic',
    description: 'See where technology cost information gets stuck between data and a decision.',
    bring: 'A scope and answers to 12 short questions.',
    result: 'A profile of the gaps and a priority to work on.',
    action: 'Start Signal Audit', href: releasedTool('signal-audit').href, external: false,
    destination: 'signal_audit', source: 'work_decision_tools', tone: 'sage',
    image: '/images/signal-audit-directory-preview.jpg',
    imageAlt: 'Signal Audit asking which part of a business or technology team to assess',
    imageWidth: 1080, imageHeight: 390,
  },
  {
    slug: 'interactive-lab', topics: ['tech-spending', 'ai-automation'], name: 'Interactive Lab', kind: 'AI decision guide',
    description: 'Work through a cloud, AI, or software decision before you commit.',
    bring: 'Your question and context, or start with an example.',
    result: 'A brief separating facts, assumptions, options, and next steps.',
    action: 'Open Interactive Lab', href: releasedTool('interactive-lab').href, external: false,
    destination: 'interactive_lab', source: 'work_decision_tools', tone: 'rose',
    image: '/images/interactive-lab-directory-preview.jpg',
    imageAlt: 'Interactive Lab with its SaaS renewal starter example in the decision field',
    imageWidth: 488, imageHeight: 305,
  },
];

export const upcomingTools: {
  slug: string;
  name: string;
  topics: ToolTopic[];
  description: string;
  preview: [string, string];
  tone: 'sage' | 'rose' | 'sand';
}[] = [
  {
    slug: 'monthly-money-planner',
    name: 'Monthly Money Planner',
    topics: ['money-investing'],
    description: 'A place to plan your monthly budget, spending, and saving.',
    preview: ['Make room.', 'Make a plan.'], tone: 'sage',
  },
  {
    slug: 'business-cash-flow-planner',
    name: 'Business Cash Flow Planner',
    topics: ['money-investing'],
    description: 'Map money coming in and going out, and plan your business cash buffer.',
    preview: ['Cash in.', 'Cash out.'], tone: 'sand',
  },
  {
    slug: 'worth-it-calculator',
    name: 'Worth It Calculator',
    topics: ['money-investing', 'tech-spending'],
    description: 'Compare what something costs with the time it could save you.',
    preview: ['Time saved.', 'Money spent.'], tone: 'rose',
  },
  {
    slug: 'personal-ai-helper',
    name: 'Your own AI helper',
    topics: ['ai-automation'],
    description: 'An animal-inspired AI assistant, with a walkthrough to help you set it up.',
    preview: ['Less admin.', 'More you.'], tone: 'rose',
  },
];
