import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaults } from 'lodash-es';
import { tagsFunction } from './tags';
import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks, } from './hooks';
import { renderGherkin } from './render';
const featureRegex = /\.feature(?:\.md)?$/;
export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };
export { setWorldConstructor, getWorldConstructor } from './world';
export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, };
export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;
export const qp = (step, state, line, data) => {
    const stepDefinitionMatch = findStepDefinitionMatch(step);
    return stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
};
export const quickpickle = function () {
    let config;
    return {
        name: 'quickpickle-transform',
        configResolved: (resolvedConfig) => {
            config = defaults({ root: resolvedConfig.root, language: 'en' }, get(resolvedConfig, 'test.cucumber'));
            config.tagsFunction = tagsFunction(get(config, 'tags'));
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