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

const featureRegex = /\.feature(?:\.md)?$/;

export { BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep };

export { setWorldConstructor, getWorldConstructor } from './world';

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
  // Add any specific configuration options here
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

export const qp = (step: string, state: any, line: number, data?: any): any => {
  const stepDefinitionMatch = findStepDefinitionMatch(step);
  return stepDefinitionMatch.stepDefinition.f(state, ...stepDefinitionMatch.parameters, data);
};

interface PluginConfig {
  root: string;
  language: string;
  tagsFunction: (tags: string[]) => boolean;
  [key: string]: any;
}

interface ResolvedConfig {
  root: string;
  test?: {
    cucumber?: Partial<PluginConfig>;
  };
}

export const quickpickle = function() {
  let config: PluginConfig;

  return {
    name: 'quickpickle-transform',
    configResolved: (resolvedConfig: ResolvedConfig) => {
      config = defaults(
        { root: resolvedConfig.root, language: 'en' },
        get(resolvedConfig, 'test.cucumber')
      ) as PluginConfig;

      config.tagsFunction = tagsFunction(get(config, 'tags'));
    },
    transform: async (src: string, id: string): Promise<string | undefined> => {
      if (featureRegex.test(id)) {
        return renderGherkin(src, config, id.match(/\.md$/) ? true : false)
      }
    }
  };
}

export default quickpickle;
