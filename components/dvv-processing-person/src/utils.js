const canonicalize = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(canonicalize);
    } else if (typeof obj === 'object' && obj !== null) {
        const sortedKeys = Object.keys(obj).sort();
        const result = {};
        for (const key of sortedKeys) {
            result[key] = canonicalize(obj[key]);
        }
        return result;
    } else {
        return obj;
    }
}

export const uniqueDeep = (array) => {
    const seen = new Set();
    return array.filter(item => {
        const canonicalItem = canonicalize(item);
        const key = typeof item === 'object' ? JSON.stringify(canonicalItem) : item;
        return seen.has(key) ? false : seen.add(key);
    });
}

export const renderLanguageOption = (obj) => {
    return obj ? obj['sv'] || obj['fi'] : null;
}

export const renderDate = (obj) => {
    if (!obj?.['arvo']) {
        return null;
    }

    switch (obj['tarkkuus']) {
        case 'KUUKAUSI':
        case 'VUOSI':
        case 'EI_TIEDOSSA':
            return null;

        case 'PAIVA':
            return obj['arvo'];
    }
}