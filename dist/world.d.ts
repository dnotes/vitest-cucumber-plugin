export interface QuickPickleWorldInterface {
    info: {
        feature: string;
        scenario: string;
        tags: string[];
        rule?: string;
        step?: string;
    };
    common: {
        [key: string]: any;
    };
    init: () => Promise<void>;
}
export declare class QuickPickleWorld implements QuickPickleWorldInterface {
    info: QuickPickleWorldInterface['info'];
    common: QuickPickleWorldInterface['common'];
    init(): Promise<void>;
}
export declare function getWorldConstructor(): typeof QuickPickleWorld;
export declare function setWorldConstructor(constructor: new () => QuickPickleWorldInterface): void;
