(function () {
  var images = [
    'images/skyline/sky1.jpg',
    'images/skyline/sky2.jpg',
    'images/skyline/sky3.jpg',
    'images/skyline/sky4.jpg',
    'images/skyline/sky5.jpg',
    'images/skyline/sky6.jpg'
  ];
  var root = new URL("../", document.currentScript.src);
  images = images.map(function (path) { return new URL(path, root).href; });
  var interval = 10000; // milliseconds between rotations
  var fadeDuration = 1500; // milliseconds for crossfade
  var current = 0;
  var el = document.getElementById('div2');
  if (!el) return;

  // Skip rotation on mobile (matches CSS breakpoint)
  if (window.innerWidth <= 820 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Preload all images
  for (var i = 0; i < images.length; i++) {
    var img = new Image();
    img.src = images[i];
  }

  // Remove the static background-image from the element
  el.style.backgroundImage = 'none';

  // Create two layers for crossfading
  function makeLayer() {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.backgroundSize = '100% 100%';
    div.style.backgroundPosition = 'left top';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.transition = 'opacity ' + fadeDuration + 'ms ease';
    div.style.zIndex = '0';
    el.appendChild(div);
    return div;
  }

  var layerA = makeLayer();
  var layerB = makeLayer();

  // Start with the first image visible
  layerA.style.backgroundImage = 'url(' + images[0] + ')';
  layerA.style.opacity = '1';
  layerB.style.opacity = '0';

  var showingA = true;

  setInterval(function () {
    if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    current = (current + 1) % images.length;
    if (showingA) {
      layerB.style.backgroundImage = 'url(' + images[current] + ')';
      layerB.style.opacity = '1';
      layerA.style.opacity = '0';
    } else {
      layerA.style.backgroundImage = 'url(' + images[current] + ')';
      layerA.style.opacity = '1';
      layerB.style.opacity = '0';
    }
    showingA = !showingA;
  }, interval);
})();
