export const isObject = (obj) => obj !== null && typeof obj === 'object';

export const isNonEmptyObject = (obj) => isObject(obj) && !Array.isArray(obj) && Object.keys(obj).length > 0;

export function isJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

export const isArray = (arr) => Array.isArray(arr);