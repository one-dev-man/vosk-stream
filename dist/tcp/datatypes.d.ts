/// <reference types="node" />
declare type DATA_TYPE_ = {
    id: number;
    event: string;
    parse: (data: any) => any;
    pack: (input: any) => any;
    checkInput: (input: any) => any;
};
declare const DATA_TYPES: {
    BUFFER: {
        id: number;
        event: string;
        parse: (data: Buffer) => Buffer;
        pack: (input: Buffer) => Buffer;
        checkInput: (input: any) => boolean;
    };
    STRING: {
        id: number;
        event: string;
        parse(data: Buffer): string;
        pack(input: string): Buffer;
        checkInput(input: any): boolean;
    };
    JSON: {
        id: number;
        event: string;
        parse(data: Buffer): any;
        pack(input: object): Buffer;
        checkInput(input: any): boolean;
    };
    getById(id: number | null): DATA_TYPE_ | null;
    getByInput(input: any): DATA_TYPE_ | null;
};
export default DATA_TYPES;
