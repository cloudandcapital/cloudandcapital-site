// Selected public posts, verified on October 18, 2026.
// These local covers keep the section useful without third-party feed scripts.
// Automatic feed refresh can replace this source after account authorization.
export const instagramProfile = 'https://www.instagram.com/cloud.and.capital/';
export const instagramPosts = [
  { id: 'DbuPFlGzoNQ', path: 'p', type: 'Post', alt: 'Cloud & Capital introduction on Instagram', width: 515, height: 640 },
  { id: 'DcoHL1sT5bI', path: 'p', type: 'Post', alt: 'Cloud & Capital trading humor post on Instagram', width: 480, height: 640 },
  { id: 'DenIYgNEkNw', path: 'p', type: 'Carousel', alt: 'Cloud & Capital market carousel published October 17, 2026', width: 507, height: 640 },
  { id: 'DekrJJrTYq3', path: 'reel', type: 'Reel', alt: 'Cloud & Capital Reel published October 16, 2026', width: 360, height: 640 },
  { id: 'DekFpClGQyf', path: 'p', type: 'Carousel', alt: 'Cloud & Capital carousel published October 16, 2026', width: 517, height: 640 },
  { id: 'DehuCm5vUxu', path: 'reel', type: 'Reel', alt: 'Cloud & Capital Reel published October 15, 2026', width: 360, height: 640 },
].map(post => ({ ...post, href: `${instagramProfile}${post.path}/${post.id}/`, image: `/images/instagram/${post.id}.jpg` }));
