export declare class DocString extends String {
    mediaType: string;
    constructor(content: string, mediaType?: string);
    toString(): string;
    [Symbol.toPrimitive](hint: string): string | number;
}
