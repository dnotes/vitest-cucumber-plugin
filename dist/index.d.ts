import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks } from './hooks';
export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };
export { setWorldConstructor, getWorldConstructor } from './world';
export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, };
export declare const Given: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export declare const When: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export declare const Then: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export type QuickPickleConfig = {};
export declare const qp: (step: string, state: any, line: number, data?: any) => any;
interface PluginConfig {
    root: string;
    language: string;
    tagsFunction: (tags: string[]) => boolean;
    [key: string]: any;
}
interface ResolvedConfig {
    root: string;
    test?: {
        cucumber?: Partial<PluginConfig>;
    };
}
export declare const quickpickle: () => {
    name: string;
    configResolved: (resolvedConfig: ResolvedConfig) => void;
    transform: (src: string, id: string) => Promise<string | undefined>;
};
export default quickpickle;
