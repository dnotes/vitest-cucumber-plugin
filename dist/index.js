import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaults } from 'lodash-es';
import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks, } from './hooks';
import { renderGherkin } from './render';
import { DataTable } from '@cucumber/cucumber';
import { DocString } from './models/doc_string';
export { setWorldConstructor, getWorldConstructor } from './world';
export { DocString, DataTable };
const featureRegex = /\.feature(?:\.md)?$/;
export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };
export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, };
export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;
export const qp = async (step, state, line, data) => {
    const stepDefinitionMatch = findStepDefinitionMatch(step);
    // Set the state info
    state.info.step = step;
    state.info.line = line;
    // Sort out the DataTable or DocString
    if (Array.isArray(data)) {
        data = new DataTable(data);
    }
    else if (data?.hasOwnProperty('content')) {
        data = new DocString(data.content, data.mediaType);
    }
    try {
        applyBeforeStepHooks(state);
        await stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
        applyAfterStepHooks(state);
    }
    catch (e) {
        e.message = `${step} (#${line})\n${e.message}`;
        throw e;
    }
};
const defaultConfig = {
    import: ['features/*.steps.{ts,js,mjs}']
};
export const quickpickle = function () {
    let config;
    return {
        name: 'quickpickle-transform',
        configResolved: (resolvedConfig) => {
            config = defaults(defaultConfig, get(resolvedConfig, 'test.cucumber'));
        },
        transform: async (src, id) => {
            if (featureRegex.test(id)) {
                return renderGherkin(src, config, id.match(/\.md$/) ? true : false);
            }
        }
    };
};
export default quickpickle;
//# sourceMappingURL=index.js.map