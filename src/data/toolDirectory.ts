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
  imageLabel?: string;
  imageWidth: number;
  imageHeight: number;
  companion?: { label: string; href: string };
  availability?: 'review';
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
    description: 'Compare AI tools or review the spending you can account for.',
    bring: 'Monthly tool costs and a small sample of your work, or a bill and usage records.',
    result: 'Cost per usable result or an AI spending breakdown, with assumptions made clear.',
    action: 'Open AI Cost Lens', href: releasedTool('ai-cost-lens').href, external: true,
    destination: 'ai_cost_lens', source: 'work_flagship', tone: 'sage',
    image: '/images/ai-cost-lens-welcome-preview.jpg',
    imageAlt: 'AI Cost Lens welcome screen with a glass lens illustration and two choices: Compare two options or Review my AI spending',
    imageWidth: 1160, imageHeight: 605, imageLabel: 'Start here',
    companion: { label: 'Walk through an example', href: '/insights/using-ai-cost-lens' },
  },
  {
    slug: 'cloud-cost-guard', topics: ['tech-spending'], name: 'Cloud Cost Guard', kind: 'Cloud bills',
    description: 'See where your cloud spending went and what changed between bills.',
    bring: 'A supported FOCUS CSV, Google Cost table CSV, or the billing template. Add an earlier bill to compare.',
    result: 'Cost drivers, a spending breakdown, and questions to investigate.',
    action: 'Review my cloud bill', href: releasedTool('cloud-cost-guard-lumen').href, external: true,
    destination: 'cloud_cost_guard', source: 'work_decision_tools', tone: 'rose',
    image: '/images/cloud-cost-guard-overview-preview.jpg',
    imageAlt: 'Cloud Cost Guard service-charge pie chart from its built-in example bill',
    imageWidth: 1363, imageHeight: 936, imageLabel: 'Example billing records',
    companion: { label: 'How to review your own bill', href: '/insights/using-cloud-cost-guard' },
  },
  {
    slug: 'software-renewal-tracker', topics: ['tech-spending'], name: 'Software Renewal Tracker', kind: 'Software subscriptions',
    description: 'Keep software charges, renewal dates, and cancellation deadlines together.',
    bring: 'Your subscriptions, charges, and dates.',
    result: 'Upcoming payments and a clearer time to review each subscription.',
    action: 'Open the renewal tracker', href: '/tools/software-renewal-tracker', external: false,
    destination: 'software_renewal_tracker', source: 'work_decision_tools', tone: 'sand',
    image: '/images/software-renewal-overview-preview.jpg',
    imageAlt: 'Software Renewal Tracker calendar walkthrough showing a subscription, notice deadline, renewal date and calendar download',
    imageWidth: 1363, imageHeight: 936, imageLabel: 'Example data',
    companion: { label: 'How to use this tracker', href: '/insights/using-the-renewal-tracker' },
  },
  {
    slug: 'market-tape', topics: ['money-investing', 'tech-spending'], name: 'Market Tape', kind: 'Market dashboard',
    description: 'Explore market trends alongside cloud and AI spending context.',
    bring: 'No upload needed. Check the snapshot date.',
    result: 'Dated market signals, sector scores, and source-linked infrastructure context.',
    action: 'Open Market Tape', href: releasedTool('market-tape').href, external: true,
    destination: 'market_tape', source: 'work_market_context', tone: 'sage',
    image: '/images/market-tape-snapshot-review.jpg',
    imageAlt: 'An actual Market Tape snapshot showing market internals, price-change periods, and momentum scores',
    imageWidth: 1104, imageHeight: 551,
    companion: { label: 'Read the snapshot with me', href: '/insights/using-market-tape' },
  },
  {
    slug: 'signal-audit', topics: ['tech-spending'], name: 'Signal Audit', kind: '12 question check',
    description: 'Find where technology spending information gets stuck and what to check first.',
    bring: 'One team, product, or part of a business, and 12 answers.',
    result: 'A first step, why it was suggested, who to involve, and what to check.',
    action: 'Start Signal Audit', href: releasedTool('signal-audit').href, external: false,
    destination: 'signal_audit', source: 'work_decision_tools', tone: 'sage',
    image: '/images/signal-audit-result-review.jpg',
    imageAlt: 'An actual Signal Audit example with 78 out of 100 for understanding spending and 28 out of 100 for using it in decisions',
    imageWidth: 1080, imageHeight: 555, imageLabel: 'Example answers',
    companion: { label: 'Use the result with me', href: '/insights/using-signal-audit' },
  },
];

export const upcomingTools: {
  slug: string;
  name: string;
  topics: ToolTopic[];
  description: string;
  next?: boolean;
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
    next: true,
    topics: ['ai-automation'],
    description: 'A guided setup for a personal AI agent, with its own animal character. Choose a task, connect the tools it needs, and learn how to check its work.',
    preview: ['Less admin.', 'More you.'], tone: 'rose',
  },
];
