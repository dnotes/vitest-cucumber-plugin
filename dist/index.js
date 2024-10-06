import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaults } from 'lodash-es';
import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks, } from './hooks';
import { renderGherkin } from './render';
export { setWorldConstructor, getWorldConstructor } from './world';
const featureRegex = /\.feature(?:\.md)?$/;
export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };
export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, };
export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;
export const qp = async (step, state, line, data) => {
    const stepDefinitionMatch = findStepDefinitionMatch(step);
    state.info.step = step;
    state.info.line = line;
    applyBeforeStepHooks(state);
    await stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
    applyAfterStepHooks(state);
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