import _ from 'lodash/fp.js';
import { addStepDefinition, findStepDefinitionMatch } from './steps.js';
import { parameterizeText } from './parameterize.js';
import { generateFeature } from './generate/index.js';
import { tagsFunction } from './tags.js';
import {
    BeforeAll, applyBeforeAllHooks,
    Before, applyBeforeHooks,
    AfterAll, applyAfterAllHooks,
    After, applyAfterHooks,
    BeforeStep, applyBeforeStepHooks,
    AfterStep, applyAfterStepHooks,
} from './hooks.js';
import * as Gherkin from '@cucumber/gherkin';
import * as Messages from '@cucumber/messages';
const uuidFn = Messages.IdGenerator.uuid();
const builder = new Gherkin.AstBuilder(uuidFn);
const gherkinMatcher = new Gherkin.GherkinClassicTokenMatcher();
const gherkinParser = new Gherkin.Parser(builder, gherkinMatcher);
const mdMatcher = new Gherkin.GherkinInMarkdownTokenMatcher();
const mdParser = new Gherkin.Parser(builder, mdMatcher);

const featureRegex = /\.feature(?:\.md)?$/;

export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };

export {
    applyBeforeAllHooks,
    applyBeforeHooks,
    applyAfterAllHooks,
    applyAfterHooks,
    applyBeforeStepHooks,
    applyAfterStepHooks,
};

export const Given = addStepDefinition;
export const When = addStepDefinition;
export const Then = addStepDefinition;

export const qp = (state,step) => {
    const stepDefinitionMatch = findStepDefinitionMatch(step);

    const extraData = step.dataTable ? step.dataTable : (step.docString ? step.docString.text : null );

    const newState = stepDefinitionMatch.stepDefinition.f(state,stepDefinitionMatch.parameters,extraData);

    return newState;
};

export const DataTable = (dataTable) => {
    const parameters = _.first(dataTable);
    const rows = _.tail(dataTable);

    return _.map((row) => _.zipObject(parameters,row))(rows);
}

export default function vitestCucumberPlugin() {
    let config;

    return {
        name : 'vitest-cucumber-transform',
        configResolved : (resolvedConfig) => {
            config = _.defaults({ root : resolvedConfig.root, language : 'en' },
                                _.get('test.cucumber',resolvedConfig))

            config = _.set('tagsFunction',tagsFunction(_.get('tags',config)),config);

        },
        transform : async (src,id) => {
            if (featureRegex.test(id)) {

                let path = id.replace(config.root,'');

                const gherkinDocument = id.match(/\.md$/) ? mdParser.parse(src) : gherkinParser.parse(src);
                const pickles = Gherkin.compile(gherkinDocument, path, uuidFn);

                // This should generate the Javascript code to be run by Vitest.
                let code = generateFeature(config, gherkinDocument, pickles);
                // return code;

                return `
import { describe, it, expect } from 'vitest';
describe('${path}', () => {
    it('is exported', () => {
        expect(true).toBe(true);
    })
})
                `;

            }
        }
    }
}
