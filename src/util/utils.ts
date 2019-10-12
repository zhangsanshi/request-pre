export function resolvePath(url: string, path?: {[key: string]: string|number}): string {
    if (path)
        return url.replace(/\{(.*?)\}/g, (a, b): string => (path[b] || a) + '');
    return url;
}