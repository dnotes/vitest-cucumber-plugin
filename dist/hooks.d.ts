interface Hook {
    name: string;
    f: (state: any) => Promise<any> | any;
    tagsFunction: (tags: string[]) => boolean;
    tags?: string;
}
export declare const BeforeAll: (opts: string | Hook | ((state: any) => any), f?: (state: any) => any) => void;
export declare const applyBeforeAllHooks: (state: any) => Promise<any>;
export declare const Before: (opts: string | Hook | ((state: any) => any), f?: (state: any) => any) => void;
export declare const applyBeforeHooks: (state: any) => Promise<any>;
export declare const BeforeStep: (opts: string | Hook | ((state: any) => any), f?: (state: any) => any) => void;
export declare const applyBeforeStepHooks: (state: any) => Promise<any>;
export declare const AfterAll: (opts: string | Hook | ((state: any) => any), f?: (state: any) => any) => void;
export declare const applyAfterAllHooks: (state: any) => Promise<any>;
export declare const After: (opts: string | Hook | ((state: any) => any), f?: (state: any) => any) => void;
export declare const applyAfterHooks: (state: any) => Promise<any>;
export declare const AfterStep: (opts: string | Hook | ((state: any) => any), f?: (state: any) => any) => void;
export declare const applyAfterStepHooks: (state: any) => Promise<any>;
export {};
