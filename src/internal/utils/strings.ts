export function camelCase(value: string): string {
    const words = lowerSplit(value);
    const keepLow = words.shift();

    return words.reduce((prev, curr) => {
        return prev + capitalize(curr);
    }, keepLow);
}

export function pascalCase(value: string): string {
    const words = lowerSplit(value);

    return words.reduce((prev, curr) => {
        return prev + capitalize(curr);
    }, "");
}

function lowerSplit(value: string): string[] {
    const lowerCase = value.toLowerCase();
    return lowerCase.split(/[\s\-_]/);
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
