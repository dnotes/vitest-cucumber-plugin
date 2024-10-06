import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks } from './hooks';
import { DataTable } from '@cucumber/cucumber';
import { DocString } from './models/doc_string';
export { setWorldConstructor, getWorldConstructor } from './world';
export { DocString, DataTable };
export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };
export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, };
export declare const Given: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export declare const When: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export declare const Then: (expression: string, f: (state: any, ...args: any[]) => any) => void;
export type QuickPickleConfig = {
    /**
     * The files to be imported for each Feature file.
     * All step definitions, hooks, world constructor, etc. must be listed.
     * The value can be a glob pattern or an array of glob patterns.
     */
    import: string | string[];
};
export declare const qp: (step: string, state: any, line: number, data?: any) => Promise<any>;
interface ResolvedConfig {
    test?: {
        cucumber?: Partial<QuickPickleConfig>;
    };
}
export declare const quickpickle: () => {
    name: string;
    configResolved: (resolvedConfig: ResolvedConfig) => void;
    transform: (src: string, id: string) => Promise<string | undefined>;
};
export default quickpickle;
