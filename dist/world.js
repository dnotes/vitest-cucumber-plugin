export class QuickPickleWorld {
    constructor() {
        this.info = {
            feature: '',
            scenario: '',
            tags: [],
            rule: '',
            step: '',
        };
        this.common = {};
    }
    async init() { }
}
let worldConstructor = QuickPickleWorld;
export function getWorldConstructor() {
    return worldConstructor;
}
export function setWorldConstructor(constructor) {
    worldConstructor = constructor;
}
//# sourceMappingURL=world.js.map