const CACHE = "WORKER-CACHE";

self.addEventListener('install', function(evt) {
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    update(evt.request).then(function() {
        evt.respondWith(fromCache(evt.request));
    });
});

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            '/',
            '/index.html',
            '/assets/Bezier.js',
            '/assets/Browser.js',
            '/assets/CircularBuffer.js',
            '/assets/Debug.js',
            '/assets/Draw.js',
            '/assets/DrawTip.js',
            '/assets/Menu.js',
            '/assets/Path.js',
            '/assets/Pointer.js',
            '/assets/PointerInput.js',
            '/assets/Stroke.js',
            '/assets/StrokePoint.js',
            '/assets/Surface.js',
            '/assets/TouchInput.js',
            '/assets/eraser.svg',
            '/assets/highlighter.svg',
            '/assets/pen.svg',
            '/assets/pencil.svg',
            '/assets/radial-quad.svg',
            '/assets/redo.svg',
            '/assets/save.svg',
            '/assets/script.js',
            '/assets/style.css',
            '/assets/trash.svg',
            '/assets/undo.svg',
        ]);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function() {
                return response;
            });
        });
    });
}
