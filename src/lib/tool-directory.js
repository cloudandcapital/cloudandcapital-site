// Filter the existing cards in place, keeping one copy of every tool.
export function initToolDirectory(root) {
  if (!root || root.dataset.directoryReady) return;
  const controls = root.querySelector('[data-tool-filters]');
  const status = root.querySelector('[data-tool-status]');
  const buttons = [...root.querySelectorAll('[data-tool-filter]')];
  const cards = [...root.querySelectorAll('[data-tool-item]')];
  if (!controls || !status || !buttons.length) return;

  function selectTopic(topic, label) {
    let ready = 0;
    let upcoming = 0;
    for (const card of cards) {
      const matches = topic === 'all' || card.dataset.toolTopics.split(' ').includes(topic);
      card.hidden = !matches;
      if (matches) {
        if (card.hasAttribute('data-tool-upcoming')) upcoming += 1;
        else ready += 1;
      }
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.toolFilter === topic));
    }
    const count = `${ready} ${ready === 1 ? 'tool' : 'tools'} to try${upcoming ? ` · ${upcoming} coming soon` : ''}`;
    status.textContent = topic === 'all' ? count : `${label}: ${count}`;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      selectTopic(button.dataset.toolFilter, button.querySelector('span').textContent);
    });
  }
  root.dataset.directoryReady = 'true';
  controls.hidden = false;
  selectTopic('all', 'View all');
}
