import _ from 'lodash/fp.js';
import { log } from '../logger.js';
import { glob } from 'glob';

const findJsFiles = async () => glob('features/**/*.js');

export const generateFeature = async (config,gherkinDocument,pickles) => {
    const name = feature.name;
    const statements = feature.statements;

    const testStatements = _.reduce((testStatements,statement) => {
        if (feature.background) {
            statement = _.set('background',feature.background,statement);
        }

        statement = _.set('tags',_.concat(feature.tags,statement.tags),statement);

        if (statement.type.type === 'example') {
            return testStatements + generateExample(config,statement);
        } else if (statement.type.type === 'scenarioOutline') {
            return testStatements + generateScenarioOutline(config,statement);
        } else if (statement.type.type === 'rule') {
            return testStatements + generateRule(config,statement);
        }
    },'')(statements);

    const skip = shouldSkip(config,feature.tags) ? '.skip' : '';
    const configStr = JSON.stringify(config);
    const tagsStr = JSON.stringify(feature.tags);

    const jsFilesImportReducer = (imports,file) => {
        file = file.slice('features/'.length);
        return imports+`
import './${file}';`;
    };
    const jsFiles = await findJsFiles();
    const jsFilesImport = _.reduce(jsFilesImportReducer,'',jsFiles);

    const code = `import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import {
    Test,
    applyBeforeAllHooks,
    applyBeforeHooks,
    applyBeforeStepHooks,
    applyAfterAllHooks,
    applyAfterHooks,
    applyAfterStepHooks,
} from 'vitest-cucumber-plugin';
import { readdir } from 'node:fs/promises';
import { log, logConfig } from 'vitest-cucumber-plugin';${jsFilesImport}

logConfig(${JSON.stringify(config.log)});

var state = {};

beforeAll(async () => {
    state = await applyBeforeAllHooks(state,${tagsStr});
});

afterAll(async () => {
    state = await applyAfterAllHooks(state,${tagsStr});
});

// tags : ${tagsStr}
describe${skip}('${escape(feature.type.name)}: ${escape(name)}', () => {
${testStatements}});
`;

    return code;
}

export const escape = (str) => str.replace(/'/g,"\\'");

export const shouldSkip = (config,tags) => {
    const result = !config.tagsFunction(tags);
    log.debug(`shouldSkip? ${result} tags: ${JSON.stringify(tags)}`);
    return result;
}

export const generateRule = (config,rule) => {
    log.debug(`generateRule config: ${JSON.stringify(config)} rule: ${JSON.stringify(rule)}`);

    const examplesCode = _.reduce((examplesCode,example) => {
        return examplesCode + generateExample(config,example);
    },'')(rule.examples);

    const skip = shouldSkip(config,rule.tags) ? '.skip' : '';
    const tagsStr = JSON.stringify(rule.tags);

    const code = `  // tags : ${tagsStr}
  describe${skip}('${escape(rule.type.name)}: ${escape(rule.name)}', () => {
${examplesCode}});
`;

    return code;
}

const createParameterMap = (parameters,values) => {
    const parameterMap = _.reduce((parameterMap,value) => {
        return {
            map : _.set(parameters[parameterMap.index],value,parameterMap.map),
            index : parameterMap.index + 1
        };
    },{ map : {}, index : 0 })(values);

    return parameterMap.map;
}

const generateAllTests = (steps,parameters,parameterValues,tags) => {
    const allTests = _.reduce((allTests,values) => {
        const parameterMap = createParameterMap(parameters,values);
        log.debug(`parameterMap : ${JSON.stringify(parameterMap)}`);

        const tests = generateTests(steps,parameterMap,tags,'    ');

        return { tests : allTests.tests + `
      describe('${allTests.index}',() => {${tests}
      });`, index : allTests.index + 1 };
    },{ tests : '', index : 0})(parameterValues);

    return allTests.tests;
}

export const generateExamples = (config,steps,examplesStatement) => {
    log.debug(`generateExamples steps:${JSON.stringify(steps)} examples: ${JSON.stringify(examplesStatement)}`);

    const parameters = _.head(examplesStatement.dataTable);
    const parameterValues = _.tail(examplesStatement.dataTable);

    log.debug(`generateExamples parameters:${JSON.stringify(parameters)} parameterValues: ${JSON.stringify(parameterValues)}`);

    const skip = shouldSkip(config,examplesStatement.tags) ? '.skip' : '';

    const allTests = generateAllTests(steps,parameters,parameterValues,examplesStatement.tags);
    const code = `
    // tags : ${JSON.stringify(examplesStatement.tags)}
    describe${skip}('${escape(examplesStatement.type.name)}: ${escape(examplesStatement.name)}', () => {${allTests}
    });`;
    return code;
}

export const generateExample = (config,example) => {
    log.debug(`generateExample config: ${JSON.stringify(config)} example: ${JSON.stringify(example)}`);
    var tests = '';

    const steps = _.has('background.steps',example) ? _.concat(example.background.steps,example.steps) : example.steps;

    tests += generateTests(steps,{},example.tags);

    const skip = shouldSkip(config,example.tags) ? '.skip' : '';

    const code = `  // tags : ${JSON.stringify(example.tags)}
  describe${skip}('${escape(example.type.name)}: ${escape(example.name)}', () => {${tests}
  });
`;
    return code;
}

export const generateScenarioOutline = (config,scenarioOutline) => {
    const examplesStatements = _.reduce((examplesStatements,examplesStatement) => {
        examplesStatement = _.set('tags',_.concat(scenarioOutline.tags,examplesStatement.tags),examplesStatement);

        return examplesStatements + generateExamples(config,scenarioOutline.steps,examplesStatement);
    },'')(scenarioOutline.examples);

    const skip = shouldSkip(config,scenarioOutline.tags) ? '.skip' : '';

    const code = `  // tags : ${JSON.stringify(scenarioOutline.tags)}
  describe${skip}('${escape(scenarioOutline.type.name)}: ${escape(scenarioOutline.name)}', () => {
${examplesStatements}
  });
`;

    return code;
}

export const generateTests = (steps,parameterMap,tags,extraIndent) => {
    log.debug(`generateTests steps : ${JSON.stringify(steps)}`);
    const tagsStr = JSON.stringify(tags);
    const indent = extraIndent ? extraIndent : '';
    let tests = `
${indent}    beforeAll(async () => { state = await applyBeforeHooks(state,${tagsStr}); });
${indent}    beforeEach(async () => { state = await applyBeforeStepHooks(state,${tagsStr}); });
${indent}    afterAll(async () => { state = await applyAfterHooks(state,${tagsStr}); });
${indent}    afterEach(async () => { state = await applyAfterStepHooks(state,${tagsStr}); });
`;

    _.forEach((step) => {
        const parameterizedText = ( parameterMap ? parameterizeText(step.text,parameterMap) : step.text);
        const name = parameterizedText;
        const parameterizedStep = _.set('text',parameterizedText,step);

        const stepString = JSON.stringify(parameterizedStep);
        tests = tests+`
${indent}    test('${escape(step.type.name)} ${escape(name)}', () => { state = Test(state,${stepString}); });`;
    },steps);

    return tests;
};

export const parameterizeText = (text,parameterMap) => {
    return _.reduce((text,parameter) => {
        return text.replaceAll('<'+parameter+'>',parameterMap[parameter]);
    },text)(_.keys(parameterMap));
};
