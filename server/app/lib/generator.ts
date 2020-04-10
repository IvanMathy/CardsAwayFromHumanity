export function randomCode(length: number) {
    var out = ""
    for (var i = 0; i++ < length;) {
        var charCode = Math.floor(Math.random() * (90 - 65) + 65);
        out += String.fromCharCode(charCode);
    }
    return out
}