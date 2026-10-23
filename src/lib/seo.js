// Describe the business using facts visitors can also read on the site.
const routeNames = {
  '/services': 'Business services',
  '/services/examples': 'Example reviews',
  '/learn': 'Investing & trading lessons',
  '/tools': 'Free tools',
  '/tools/software-renewal-tracker': 'Software Renewal Tracker',
  '/resources/software-renewal': 'Software renewal checklist',
  '/insights': 'Guides & writing',
  '/insights/using-ai-cost-lens': 'How to use AI Cost Lens',
  '/insights/using-the-renewal-tracker': 'How to use the Software Renewal Tracker',
  '/insights/is-this-software-worth-it': 'Is this software worth what we are paying?',
  '/signal-audit': 'Technology Cost Signal Audit',
  '/interactive-lab': 'Interactive Lab',
};

export function canonicalPath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

export function createSiteGraph({ siteUrl, pathname, title, description, entities = [] }) {
  const path = canonicalPath(pathname);
  const home = new URL('/', siteUrl).href;
  const url = new URL(path, siteUrl).href;
  const organization = { '@id': `${home}#organization` };
  const person = { '@id': `${home}#diana` };
  const graph = [
    {
      '@type': 'Organization', ...organization,
      name: 'Cloud & Capital', url: home,
      description: 'Cloud, AI and software cost analysis, workflow reviews, and custom tools and automations for business owners and teams. Free tools and writing about money, markets, and technology.',
      founder: person, email: 'diana@cloudandcapital.com',
      sameAs: ['https://github.com/cloudandcapital', 'https://cloudandcapital.substack.com', 'https://www.instagram.com/cloud.and.capital/'],
    },
    {
      '@type': 'Person', ...person,
      name: 'Diana Molski', url: `${home}#about`,
      image: new URL('/images/diana-molski-portrait.png', home).href,
      jobTitle: 'Founder, Cloud & Capital',
    },
    {
      '@type': 'WebSite', '@id': `${home}#website`,
      name: 'Cloud & Capital', url: home, publisher: organization,
      inLanguage: 'en',
    },
    {
      '@type': 'WebPage', '@id': `${url}#webpage`,
      url, name: title, description,
      isPartOf: { '@id': `${home}#website` }, about: organization,
      inLanguage: 'en',
      ...(routeNames[path] ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      ...(entities[0]?.['@id'] ? { mainEntity: { '@id': entities[0]['@id'] } } : {}),
    },
  ];

  if (routeNames[path]) {
    const crumbs = [{ name: 'Cloud & Capital', item: home }];
    const parent = path.slice(0, path.lastIndexOf('/'));
    if (routeNames[parent]) crumbs.push({ name: routeNames[parent], item: new URL(parent, home).href });
    crumbs.push({ name: routeNames[path], item: url });
    graph.push({
      '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': [...graph, ...entities] };
}

// JSON-LD is emitted as raw script content; escape HTML-sensitive characters.
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
