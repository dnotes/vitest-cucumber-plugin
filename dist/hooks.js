import { isFunction, isString, isObject, concat } from 'lodash-es';
import { tagsFunction } from './tags';
const allHooks = {
    beforeAll: [],
    before: [],
    beforeStep: [],
    afterAll: [],
    after: [],
    afterStep: [],
};
const hookNames = {
    beforeAll: 'BeforeAll',
    before: 'Before',
    beforeStep: 'BeforeStep',
    afterAll: 'AfterAll',
    after: 'After',
    afterStep: 'AfterStep',
};
const applyHooks = async (hooksName, state, tags) => {
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
const addHook = (hooksName, opts, f) => {
    let hookOpts;
    if (isFunction(opts)) {
        hookOpts = { name: '', f: opts, tagsFunction: () => true };
    }
    else if (isString(opts)) {
        hookOpts = { name: opts, f: f, tagsFunction: () => true };
    }
    else if (isObject(opts)) {
        hookOpts = opts;
        hookOpts.f = f;
    }
    else {
        throw new Error('Unknown options argument: ' + JSON.stringify(opts));
    }
    hookOpts.tagsFunction = tagsFunction(hookOpts.tags);
    allHooks[hooksName] = concat(allHooks[hooksName], hookOpts);
};
export const BeforeAll = (opts, f) => { addHook('beforeAll', opts, f); };
export const applyBeforeAllHooks = (state, tags) => applyHooks('beforeAll', state, tags);
export const Before = (opts, f) => { addHook('before', opts, f); };
export const applyBeforeHooks = (state, tags) => applyHooks('before', state, tags);
export const BeforeStep = (opts, f) => { addHook('beforeStep', opts, f); };
export const applyBeforeStepHooks = (state, tags) => applyHooks('beforeStep', state, tags);
export const AfterAll = (opts, f) => { addHook('afterAll', opts, f); };
export const applyAfterAllHooks = (state, tags) => applyHooks('afterAll', state, tags);
export const After = (opts, f) => { addHook('after', opts, f); };
export const applyAfterHooks = (state, tags) => applyHooks('after', state, tags);
export const AfterStep = (opts, f) => { addHook('afterStep', opts, f); };
export const applyAfterStepHooks = (state, tags) => applyHooks('afterStep', state, tags);
//# sourceMappingURL=hooks.js.map