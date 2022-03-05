type DATA_TYPE_ = {
    id: number,
    event: string,
    parse: (data: any) => any,
    pack: (input: any) => any,
    checkInput: (input: any) => any
}

const DATA_TYPES = {
    BUFFER: {
        id: 0,
        event: "buffer",
        parse: (data: Buffer) => { return data; },
        pack: (input: Buffer) => { return pack(DATA_TYPES.BUFFER.id, input); },
        checkInput: (input: any) => { return input.constructor.name.toUpperCase() == "BUFFER"; }
    },
    STRING: {
        id: 1,
        event: "string",
        parse(data: Buffer) { return data.toString("utf-8"); },
        pack(input: string) { return pack(DATA_TYPES.STRING.id, Buffer.from(input, "utf8")); },
        checkInput(input: any) { return input.constructor.name.toUpperCase() == "STRING"; }
    },
    JSON: {
        id: 2,
        event: "json",
        parse(data: Buffer) { return JSON.parse(data.toString("utf-8")); },
        pack(input: object) { return pack(DATA_TYPES.JSON.id, Buffer.from(JSON.stringify(input), "utf8")); },
        checkInput(input: any) { return (input instanceof Object) && !(input instanceof Array); }
    },

    getById(id: number | null): DATA_TYPE_ | null {
        if(id) {
            let kdt = Object.keys(DATA_TYPES).filter(k => { return !(DATA_TYPES[k] instanceof Function); });
            for(let i = 0; i < kdt.length; ++i) {
                let dt = DATA_TYPES[kdt[i]];
                if(id == dt.id) return dt;
            }
        }
        return null;
    },

    getByInput(input: any): DATA_TYPE_ | null {
        if(input) {
            let kdt = Object.keys(DATA_TYPES).filter(k => { return !(DATA_TYPES[k] instanceof Function); });
            for(let i = 0; i < kdt.length; ++i) {
                let dt = DATA_TYPES[kdt[i]];
                if(dt.checkInput(input)) return dt;
            }
        }
        return null;
    }
}

function pack(id: number, input: Buffer) {
    let r = Buffer.from([id, 0, 0, 0, 0]);
    r.writeInt32BE(input.length, 1);
    return Buffer.concat([r, input]);
}

export default DATA_TYPES;