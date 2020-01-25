const generate = (() => {
    const USABLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

    return length => {
        return new Array(length).fill(null).map(() => {
            return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
        }).join("");
    }
})();

module.exports = generate;