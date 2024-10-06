import _ from 'lodash/fp';
import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { tagsFunction } from './tags';
import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks, } from './hooks';
import * as Gherkin from '@cucumber/gherkin';
import * as Messages from '@cucumber/messages';
import { renderFeature } from './generate';
const uuidFn = Messages.IdGenerator.uuid();
const builder = new Gherkin.AstBuilder(uuidFn);
const gherkinMatcher = new Gherkin.GherkinClassicTokenMatcher();
const gherkinParser = new Gherkin.Parser(builder, gherkinMatcher);
const mdMatcher = new Gherkin.GherkinInMarkdownTokenMatcher();
const mdParser = new Gherkin.Parser(builder, mdMatcher);
const featureRegex = /\.feature(?:\.md)?$/;
export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };
export { applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, };
export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;
export const qp = (step, state, line, data) => {
    const stepObj = {
        text: step,
        type: {
            type: 'given', // Default type, you might want to determine this dynamically
            name: 'Given'
        }
    };
    const stepDefinitionMatch = findStepDefinitionMatch(stepObj);
    return stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
};
export const quickpickle = function () {
    let config;
    return {
        name: 'vitest-cucumber-transform',
        configResolved: (resolvedConfig) => {
            config = _.defaults({ root: resolvedConfig.root, language: 'en' }, _.get('test.cucumber', resolvedConfig));
            config.tagsFunction = tagsFunction(_.get('tags', config));
        },
        transform: async (src, id) => {
            if (featureRegex.test(id)) {
                const gherkinDocument = id.match(/\.md$/) ? mdParser.parse(src) : gherkinParser.parse(src);
                return renderFeature(gherkinDocument, config);
            }
        }
    };
};
export default quickpickle;
//# sourceMappingURL=index.js.map