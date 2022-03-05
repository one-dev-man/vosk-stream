"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DATA_TYPES = {
    BUFFER: {
        id: 0,
        event: "buffer",
        parse: (data) => { return data; },
        pack: (input) => { return pack(DATA_TYPES.BUFFER.id, input); },
        checkInput: (input) => { return input.constructor.name.toUpperCase() == "BUFFER"; }
    },
    STRING: {
        id: 1,
        event: "string",
        parse(data) { return data.toString("utf-8"); },
        pack(input) { return pack(DATA_TYPES.STRING.id, Buffer.from(input, "utf8")); },
        checkInput(input) { return input.constructor.name.toUpperCase() == "STRING"; }
    },
    JSON: {
        id: 2,
        event: "json",
        parse(data) { return JSON.parse(data.toString("utf-8")); },
        pack(input) { return pack(DATA_TYPES.JSON.id, Buffer.from(JSON.stringify(input), "utf8")); },
        checkInput(input) { return (input instanceof Object) && !(input instanceof Array); }
    },
    getById(id) {
        if (id) {
            let kdt = Object.keys(DATA_TYPES).filter(k => { return !(DATA_TYPES[k] instanceof Function); });
            for (let i = 0; i < kdt.length; ++i) {
                let dt = DATA_TYPES[kdt[i]];
                if (id == dt.id)
                    return dt;
            }
        }
        return null;
    },
    getByInput(input) {
        if (input) {
            let kdt = Object.keys(DATA_TYPES).filter(k => { return !(DATA_TYPES[k] instanceof Function); });
            for (let i = 0; i < kdt.length; ++i) {
                let dt = DATA_TYPES[kdt[i]];
                if (dt.checkInput(input))
                    return dt;
            }
        }
        return null;
    }
};
function pack(id, input) {
    let r = Buffer.from([id, 0, 0, 0, 0]);
    r.writeInt32BE(input.length, 1);
    return Buffer.concat([r, input]);
}
exports.default = DATA_TYPES;
//# sourceMappingURL=datatypes.js.map