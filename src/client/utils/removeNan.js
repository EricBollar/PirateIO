export function removeNan(str) {
    if (str.includes("NaN")) {
        return str.substring(0, str.length - 3);
    }
    return str;
}