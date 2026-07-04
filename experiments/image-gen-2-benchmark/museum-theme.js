// Shared grid-density toggle for image-gen-2-benchmark pages.
// Persists in localStorage under 'gallery-density' (same key as the main archive).
(function () {
  var btn = document.getElementById('density-toggle');
  function set(cols, persist) {
    document.body.dataset.density = cols;
    if (btn) btn.textContent = 'Grid: ' + cols + ' columns';
    if (persist) { try { localStorage.setItem('gallery-density', cols); } catch (e) {} }
  }
  var density = '3';
  try { density = localStorage.getItem('gallery-density') || '3'; } catch (e) {}
  set(density === '2' ? '2' : '3', false);
  if (btn) btn.addEventListener('click', function () {
    set(document.body.dataset.density === '3' ? '2' : '3', true);
  });
})();
