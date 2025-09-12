class LanguageManager {
    constructor(defaultLang = 'ar') {
        this.currentLang = localStorage.getItem('language') || defaultLang;
        this.translations = { ar: {}, en: {}, fr: {} };
        this._defaultsCaptured = false;
    }

    _isPlainObject(v) {
        return Object.prototype.toString.call(v) === '[object Object]';
    }

    _deepMerge(target, source) {
        const out = { ...target };
        for (const k of Object.keys(source || {})) {
            if (this._isPlainObject(source[k]) && this._isPlainObject(out[k])) {
                out[k] = this._deepMerge(out[k], source[k]);
            } else {
                out[k] = source[k];
            }
        }
        return out;
    }

    getNestedValue(obj, key) {
        return key.split('.').reduce((o, k) => {
            if (o && typeof o === 'object' && k in o) {
                return o[k];
            }
            return undefined;
        }, obj);
    }


    _captureArabicDefaults() {
        if (this._defaultsCaptured) return;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            let val;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                val = el.placeholder || '';
            } else {
                val = (el.textContent || '').trim();
            }
            el.dataset.original = val;
            const parts = key.split('.');
            let cursor = this.translations.ar;
            for (let i = 0; i < parts.length; i++) {
                const p = parts[i];
                if (i === parts.length - 1) {
                    cursor[p] = val;
                } else {
                    cursor[p] = cursor[p] || {};
                    cursor = cursor[p];
                }
            }
        });
        this._defaultsCaptured = true;
    }

    async loadTranslations(modules = ['header', 'footer', 'cart', 'index', 'products', 'product-details', 'checkout', 'about', 'contact', 'privacy', 'terms']) {
        this._captureArabicDefaults();

        const loadLangForModule = async (module, lang) => {
            const url = `./translations/${module}/${module}-${lang}.json`;
            try {
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) {
                    console.warn(`⚠️ ${url} not found (${res.status}).`);
                    return {};
                }
                const text = await res.text();
                if (!text.trim()) return {};
                return JSON.parse(text);
            } catch (e) {
                console.warn(`⚠️ Failed to load ${url}:`, e);
                return {};
            }
        };

        let enAll = {};
        let frAll = {};
        for (const m of modules) {
            const [enJson, frJson] = await Promise.all([
                loadLangForModule(m, 'en'),
                loadLangForModule(m, 'fr'),
            ]);
            enAll = this._deepMerge(enAll, enJson);
            frAll = this._deepMerge(frAll, frJson);
        }
        this.translations.en = enAll;
        this.translations.fr = frAll;
    }

    setLanguage(lang) {
        if (!['ar', 'en', 'fr'].includes(lang)) return;
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyDirection();
        this.updateContent();

        document.dispatchEvent(new Event('languageChanged'));
    }

    applyDirection() {
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
    }

    updateContent() {
        const isAR = this.currentLang === 'ar';
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');

            let value;
            if (isAR) {
                value = el.dataset.original ?? '';
            } else {
                value = this.getNestedValue(this.translations[this.currentLang], key);
            }
            if (typeof value === 'undefined') {
                return;
            }

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.textContent = value;
            }
        });

        const pageTitle = this.getNestedValue(this.translations[this.currentLang], 'page.title');
        if (pageTitle && !isAR) {
            document.title = pageTitle;
        } else if (isAR && this._defaultsCaptured) {
        }
    }
}

// === INIT ===
document.addEventListener('DOMContentLoaded', async () => {
    window.languageManager = new LanguageManager();

    await languageManager.loadTranslations(['header', 'footer', 'cart', 'index', 'products', 'product-details', 'checkout', 'about', 'contact', 'privacy', 'terms']);

    languageManager.applyDirection();
    languageManager.updateContent();

    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            languageManager.setLanguage(lang);
        });
    });
});
