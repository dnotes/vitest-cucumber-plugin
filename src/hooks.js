import _ from 'lodash/fp.js';
import { tagsFunction } from './tags.js';

const allHooks = {
    beforeAll : [],
    before : [],
    beforeStep : [],
    afterAll : [],
    after : [],
    afterStep : [],
};

const hookNames = {
    beforeAll : 'BeforeAll',
    before : 'Before',
    beforeStep : 'BeforeStep',
    afterAll : 'AfterAll',
    after : 'After',
    afterStep : 'AfterStep',
}


const applyHooks = async (hooksName,state,tags) => {
    const hooks = allHooks[hooksName];
    for (let i = 0; i < hooks.length; i++) {
        let hook = hooks[i];
        const result = hook.tagsFunction(tags);
        if (result) {
            const origState = state;
            state = await hook.f(state);
        }
    }
    return state;
};

const addHook = (hooksName,opts,f) => {
    if (_.isFunction(opts)) {
        opts = { name : '', f : opts };
    } else if (_.isString(opts)) {
        opts = { name : opts, f };
    } else if (_.isObject(opts)) {
        opts.f = f;
    } else {
        throw new Error('Unknown options argument: '+JSON.stringify(opts));
    }

    opts = _.set('tagsFunction',tagsFunction(opts.tags),opts);

    allHooks[hooksName] = _.concat(allHooks[hooksName],opts);
};

export const BeforeAll = (opts,f) => { addHook('beforeAll',opts,f) };
export const applyBeforeAllHooks = (state,tags) => applyHooks('beforeAll',state,tags);

export const Before = (opts,f) => { addHook('before',opts,f) };
export const applyBeforeHooks = (state,tags) => applyHooks('before',state,tags);

export const BeforeStep = (opts,f) => { addHook('beforeStep',opts,f) };
export const applyBeforeStepHooks = (state,tags) => applyHooks('beforeStep',state,tags);

export const AfterAll = (opts,f) => { addHook('afterAll',opts,f) };
export const applyAfterAllHooks = (state,tags) => applyHooks('afterAll',state,tags);

export const After = (opts,f) => { addHook('after',opts,f) };
export const applyAfterHooks = (state,tags) => applyHooks('after',state,tags);

export const AfterStep = (opts,f) => { addHook('afterStep',opts,f) };
export const applyAfterStepHooks = (state,tags) => applyHooks('afterStep',state,tags);
