import { addStepDefinition, findStepDefinitionMatch } from './steps';
import { get, defaults } from 'lodash-es';
import { tagsFunction } from './tags';
import {
  BeforeAll, applyBeforeAllHooks,
  Before, applyBeforeHooks,
  AfterAll, applyAfterAllHooks,
  After, applyAfterHooks,
  BeforeStep, applyBeforeStepHooks,
  AfterStep, applyAfterStepHooks,
} from './hooks';
import { renderGherkin } from './render';

export { setWorldConstructor, getWorldConstructor } from './world';

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

export type QuickPickleConfig = {

  /**
   * The files to be imported for each Feature file.
   * All step definitions, hooks, world constructor, etc. must be listed.
   * The value can be a glob pattern or an array of glob patterns.
   */
  import: string|string[]

};

interface Step {
  text: string;
  dataTable?: any;
  docString?: {
    text: string;
  };
  type: {
    type: 'given' | 'when' | 'then';
    name: string;
  };
}

interface StepDefinitionMatch {
  stepDefinition: {
    f: (state: any, ...args: any[]) => any;
  };
  parameters: any[];
}

export const qp = async (step: string, state: any, line: number, data?: any): Promise<any> => {
  const stepDefinitionMatch = findStepDefinitionMatch(step);
  state.info.step = step
  state.info.line = line
  applyBeforeStepHooks(state);
  await stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
  applyAfterStepHooks(state);
};

const defaultConfig: QuickPickleConfig = {
  import: ['features/*.steps.{ts,js,mjs}']
}

interface ResolvedConfig {
  test?: {
    cucumber?: Partial<QuickPickleConfig>;
  };
}

export const quickpickle = function() {
  let config: QuickPickleConfig;

  return {
    name: 'quickpickle-transform',
    configResolved: (resolvedConfig: ResolvedConfig) => {
      config = defaults(
        defaultConfig,
        get(resolvedConfig, 'test.cucumber')
      ) as QuickPickleConfig;
    },
    transform: async (src: string, id: string): Promise<string | undefined> => {
      if (featureRegex.test(id)) {
        return renderGherkin(src, config, id.match(/\.md$/) ? true : false)
      }
    }
  };
}

export default quickpickle;
