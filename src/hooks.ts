import { isFunction, isString, isObject, concat } from 'lodash-es'
import { tagsFunction } from './tags';

interface Hook {
    name: string;
    f: (state: any) => Promise<any> | any;
    tagsFunction: (tags: string[]) => boolean;
    tags?: string;
}

interface HookCollection {
    [key: string]: Hook[];
}

const allHooks: HookCollection = {
    beforeAll: [],
    before: [],
    beforeStep: [],
    afterAll: [],
    after: [],
    afterStep: [],
};

const hookNames: { [key: string]: string } = {
    beforeAll: 'BeforeAll',
    before: 'Before',
    beforeStep: 'BeforeStep',
    afterAll: 'AfterAll',
    after: 'After',
    afterStep: 'AfterStep',
};

const applyHooks = async (hooksName: string, state: any, tags: string[]): Promise<any> => {
    const hooks = allHooks[hooksName];
    for (let i = 0; i < hooks.length; i++) {
        let hook = hooks[i];
        const result = hook.tagsFunction(tags);
        if (result) {
            state = await hook.f(state);
        }
    }
    return state;
};

const addHook = (hooksName: string, opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => {
    let hookOpts: Hook;

    if (isFunction(opts)) {
        hookOpts = { name: '', f: opts, tagsFunction: () => true };
    } else if (isString(opts)) {
        hookOpts = { name: opts, f: f!, tagsFunction: () => true };
    } else if (isObject(opts)) {
        hookOpts = opts as Hook;
        hookOpts.f = f!;
    } else {
        throw new Error('Unknown options argument: ' + JSON.stringify(opts));
    }

    hookOpts.tagsFunction = tagsFunction(hookOpts.tags);

    allHooks[hooksName] = concat(allHooks[hooksName], hookOpts);
};

export const BeforeAll = (opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => { addHook('beforeAll', opts, f) };
export const applyBeforeAllHooks = (state: any, tags: string[]): Promise<any> => applyHooks('beforeAll', state, tags);

export const Before = (opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => { addHook('before', opts, f) };
export const applyBeforeHooks = (state: any, tags: string[]): Promise<any> => applyHooks('before', state, tags);

export const BeforeStep = (opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => { addHook('beforeStep', opts, f) };
export const applyBeforeStepHooks = (state: any, tags: string[]): Promise<any> => applyHooks('beforeStep', state, tags);

export const AfterAll = (opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => { addHook('afterAll', opts, f) };
export const applyAfterAllHooks = (state: any, tags: string[]): Promise<any> => applyHooks('afterAll', state, tags);

export const After = (opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => { addHook('after', opts, f) };
export const applyAfterHooks = (state: any, tags: string[]): Promise<any> => applyHooks('after', state, tags);

export const AfterStep = (opts: string | Hook | ((state: any) => any), f?: (state: any) => any): void => { addHook('afterStep', opts, f) };
export const applyAfterStepHooks = (state: any, tags: string[]): Promise<any> => applyHooks('afterStep', state, tags);
