export function camelCase(value: string): string {
    const lowerCase = value.toLowerCase();
    const words = lowerCase.split(/[\s\-_]/);
    const keepLow = words.shift();

    return words.reduce((prev, curr) => {
        return prev + capitalize(curr);
    }, keepLow);
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
