import * as Gherkin from '@cucumber/gherkin';
import * as Messages from '@cucumber/messages';
import { fromPairs, pick } from "lodash-es";
import fg from 'fast-glob';
import path from 'path';
const uuidFn = Messages.IdGenerator.uuid();
const builder = new Gherkin.AstBuilder(uuidFn);
const gherkinMatcher = new Gherkin.GherkinClassicTokenMatcher();
const gherkinParser = new Gherkin.Parser(builder, gherkinMatcher);
const mdMatcher = new Gherkin.GherkinInMarkdownTokenMatcher();
const mdParser = new Gherkin.Parser(builder, mdMatcher);
export function renderGherkin(src, config, isMarkdown) {
    // Parse the raw file into a GherkinDocument
    const gherkinDocument = isMarkdown ? mdParser.parse(src) : gherkinParser.parse(src);
    // Exit if there's no feature or scenarios
    if (!gherkinDocument?.feature || !gherkinDocument.feature?.children?.length) {
        return '';
    }
    // Get the files to import from config.import
    let imports = '';
    const importFiles = fg.sync(config.import || [], { cwd: process.cwd() });
    imports = importFiles.map(file => `import '${path.resolve(process.cwd(), file)}';`).join('\n');
    return `// Generated by quickpickle
import { test, describe, beforeAll, afterAll } from 'vitest';
import {
  qp,
  applyBeforeAllHooks,
  applyBeforeHooks,
  applyAfterAllHooks,
  applyAfterHooks,
  getWorldConstructor,
} from 'quickpickle';
${imports}
let World = getWorldConstructor()
const worldConfig = {}

const common = {};

beforeAll(async () => {
  await applyBeforeAllHooks(common);
});

afterAll(async () => {
  await applyAfterAllHooks(common);
});

const afterScenario = async(state) => {
  await applyAfterHooks(state);
}
${renderFeature(gherkinDocument.feature, config)}
`;
}
export function renderFeature(feature, config) {
    // Get the feature tags
    let tags = feature.tags.map(t => t.name);
    // Get the background stes and all the scenarios
    let { backgroundSteps, children } = renderChildren(feature.children, config, tags);
    // Render the initScenario function, which will be called at the beginning of each scenario
    return `
const initScenario = async(scenario, tags) => {
  let state = new World(worldConfig);
  await state.init(worldConfig);
  state.common = common;
  state.info.feature = '${q(feature.keyword)}: ${q(feature.name)}';
  state.info.scenario = scenario;
  state.info.tags = [...tags];
  await applyBeforeHooks(state);
${backgroundSteps}
  return state;
}

describe('${q(feature.keyword)}: ${q(feature.name)}', () => {
${children}
});`;
}
function isRule(child) {
    return child.hasOwnProperty('rule');
}
function renderChildren(children, config, tags, sp = '  ') {
    const output = {
        backgroundSteps: '',
        children: '',
    };
    if (!children.length)
        return output;
    if (children[0].hasOwnProperty('background')) {
        output.backgroundSteps = renderSteps(children.shift().background.steps, config, sp);
    }
    for (let child of children) {
        if (isRule(child)) {
            output.children += renderRule(child, config, tags, sp);
        }
        else if (child.hasOwnProperty('scenario')) {
            output.children += renderScenario(child, config, tags, sp);
        }
    }
    return output;
}
function renderRule(child, config, tags, sp = '  ') {
    tags = [...tags, ...child.rule.tags.map(t => t.name)];
    let { backgroundSteps, children } = renderChildren(child.rule.children, config, tags, sp + '  ');
    return `
${sp}describe('${q(child.rule.keyword)}: ${q(child.rule.name)}', () => {

${sp}  const initRuleScenario = async (scenario, tags) => {
${sp}    let state = await initScenario(scenario, tags);
${sp}    state.info.rule = '${q(child.rule.name)}';
${backgroundSteps}
${sp}    return state;
${sp}  }

${children}

${sp}});
`;
}
function renderScenario(child, config, tags, sp = '  ') {
    let initFn = sp.length > 2 ? 'initRuleScenario' : 'initScenario';
    tags = [...tags, ...child.scenario.tags.map(t => t.name)];
    // For Scenario Outlines with examples
    if (child.scenario.examples?.[0]?.tableHeader && child.scenario.examples?.[0]?.tableBody) {
        let paramNames = child.scenario?.examples?.[0].tableHeader?.cells?.map(c => c.value) || [];
        let paramValues = child.scenario?.examples?.[0].tableBody.map((r) => {
            return fromPairs(r.cells.map((c, i) => [paramNames[i], c.value]));
        });
        function replaceParamNames(t, withBraces) {
            paramNames.forEach(p => {
                t = t.replace(new RegExp(`<${p}>`, 'g'), (withBraces ? `$\{${p}\}` : `$${p}`));
            });
            return t;
        }
        let describe = q(replaceParamNames(child.scenario?.name ?? ''));
        let name = replaceParamNames(child.scenario?.name ?? '', true).replace(/`/g, '\`');
        return `
${sp}test.for(${JSON.stringify(paramValues)})(
${sp}  '${q(child.scenario?.keyword || '')}: ${describe}',
${sp}  async ({ ${paramNames?.join(', ')} }) => {
${sp}    let state = await ${initFn}(\`${name}\`, ['${tags.join("', '") || ''}']);
${child.scenario?.steps.map((step, i) => {
            let text = step.text.replace(/`/g, '\\`');
            text = replaceParamNames(text, true);
            return `${sp}    await qp(\`${text}\`, state, ${step.location.line});`;
        }).join('\n')}
${sp}    await afterScenario(state);
${sp}  }
${sp});
`;
    }
    return `
${sp}test('${q(child.scenario.keyword)}: ${q(child.scenario.name)}', async () => {
${sp}  let state = await ${initFn}('${q(child.scenario.name)}', ['${tags.join("', '") || ''}']);
${renderSteps(child.scenario.steps, config, sp + '  ')}
${sp}  await afterScenario(state);
${sp}});
`;
}
function renderSteps(steps, config, sp = '  ') {
    return steps.map(step => {
        if (step.dataTable) {
            let data = JSON.stringify(step.dataTable.rows.map(r => {
                return r.cells.map(c => c.value);
            }));
            return `${sp}await qp('${q(step.text)}', state, ${step.location.line}, ${data});`;
        }
        else if (step.docString) {
            let data = JSON.stringify(pick(step.docString, ['content', 'mediaType']));
            return `${sp}await qp('${q(step.text)}', state, ${step.location.line}, ${data});`;
        }
        return `${sp}await qp('${q(step.text)}', state, ${step.location.line});`;
    }).join('\n');
}
const q = (t) => (t.replace(/'/g, "\\'"));
//# sourceMappingURL=render.js.map