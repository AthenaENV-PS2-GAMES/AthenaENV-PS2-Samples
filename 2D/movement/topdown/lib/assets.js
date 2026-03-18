const imageCache = new Map();
const soundCache = new Map();
const fontCache = new Map();

const cacheMutex = new Mutex();

export default class Assets {
    static image(path, options = {}) {
        cacheMutex.lock();
        if (imageCache.has(path)) {
            const cached = imageCache.get(path);
            cacheMutex.unlock();
            return cached.asset;
        }

        const img = new Image(path);
        if (Object.keys(options).length > 0) {
            if (options.optimize) img.optimize();
            if (options.animConfig && Object.keys(options.animConfig).length > 0)
                Object.assign(img, options.animConfig);
        }
        img.lock();
        imageCache.set(path, { asset: img, ref: 1 });
        cacheMutex.unlock();
        return img;
    }

    static sound(path) {
        cacheMutex.lock();
        if (soundCache.has(path)) {
            ++soundCache.get(path).ref;
            const asset = soundCache.get(path).asset;
            cacheMutex.unlock();
            return asset;
        }

        const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        let asset;
        if (ext === 'adp') {
            asset = Sound.Sfx(path);
        } else if (ext === 'ogg' || ext === 'wav') {
            asset = Sound.Stream(path);
        } else {
            cacheMutex.unlock();
            throw new Error(`[Assets] Unknown sound extension: ${ext} (${path})`);
        }

        soundCache.set(path, { asset, ref: 1 });
        cacheMutex.unlock();
        return asset;
    }

    static font(path) {
        cacheMutex.lock();
        if (fontCache.has(path)) {
            ++fontCache.get(path).ref;
            const asset = fontCache.get(path).asset;
            cacheMutex.unlock();
            return asset;
        }
        const fnt = new Font(path);
        fontCache.set(path, { asset: fnt, ref: 1 });
        cacheMutex.unlock();
        return fnt;
    }

    static preload(manifest, onDone) {
        const thread = new Thread(() => {
            for (const item of manifest) {
                if (item.type === 'image')      Assets.image(item.path, item.options || {});
                else if (item.type === 'sound') Assets.sound(item.path);
                else if (item.type === 'font')  Assets.font(item.path);
            }
            if (typeof onDone === 'function') onDone();
        }, "Assets: Preloader");

        thread.start();
        return thread;
    }

    static free(path) {
        cacheMutex.lock();
        [imageCache, soundCache, fontCache].forEach(cache => {
            const entry = cache.get(path);
            if (entry && --entry.ref <= 0) {
                if (entry.asset.locked && entry.asset.locked()) entry.asset.unlock();
                entry.asset.free();
                cache.delete(path);
            }
        });
        cacheMutex.unlock();
    }

    static freePattern(regex) {
        const keys = [...imageCache.keys(), ...soundCache.keys(), ...fontCache.keys()];
        keys.forEach(k => { if (regex.test(k)) Assets.free(k); });
    }

    static stats() {
        return {
            images: imageCache.size,
            sounds: soundCache.size,
            fonts: fontCache.size
        };
    }
}
