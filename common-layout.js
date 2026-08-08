(function () {
  async function loadPart(id, file) {
    const target = document.getElementById(id);
    if (!target) return;
    try {
      const response = await fetch(file, { cache: 'no-cache' });
      if (!response.ok) throw new Error(file + ' could not be loaded');
      target.innerHTML = await response.text();
    } catch (error) {
      console.error('[SBFC layout]', error);
    }
  }
  document.addEventListener('DOMContentLoaded', async function () {
    await loadPart('common-header', 'header.html');
    await loadPart('common-footer', 'footer.html');
  });
})();
