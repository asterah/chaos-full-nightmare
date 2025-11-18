// --- From types.ts ---
var CardType;
(function (CardType) {
    CardType["BASIC"] = "basic";
    CardType["UNIQUE"] = "unique";
    CardType["NEUTRAL"] = "neutral";
    CardType["MONSTER"] = "monster";
    CardType["FORBIDDEN"] = "forbidden";
})(CardType || (CardType = {}));

var CardState;
(function (CardState) {
    CardState["NONE"] = "none";
    CardState["EPIPHANY"] = "epiphany";
    CardState["DIVINE_EPIPHANY"] = "divine_epiphany";
})(CardState || (CardState = {}));

var CardEffect;
(function (CardEffect) {
    CardEffect["UNIQUE"] = "unique";
    CardEffect["REMOVE"] = "remove";
})(CardEffect || (CardEffect = {}));