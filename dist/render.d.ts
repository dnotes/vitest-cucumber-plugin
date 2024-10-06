import type { Feature } from "@cucumber/messages";
import type { QuickPickleConfig } from '.';
export declare function renderGherkin(src: string, config: QuickPickleConfig, isMarkdown?: boolean): string;
export declare function renderFeature(feature: Feature, config: QuickPickleConfig): string;
