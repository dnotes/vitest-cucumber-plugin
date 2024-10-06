export class DocString extends String {
    constructor(content, mediaType = '') {
        super(content);
        this.mediaType = mediaType;
    }
    toString() {
        return this.valueOf();
    }
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return Number(this.valueOf());
        }
        return this.valueOf();
    }
}
//# sourceMappingURL=doc_string.js.map