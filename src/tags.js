import _ from 'lodash/fp.js';
import parse from '@cucumber/tag-expressions';
import { log } from './logger.js';

const parseTagsExpression = (tagsExpression) => {
    try {
        const parsedExpression = parse(tagsExpression);
        log.debug({ expression: tagsExpression }, 'Parsed tag expression');
        return parsedExpression;
    } catch (error) {
        log.error({ error, expression: tagsExpression }, 'Failed to parse tag expression');
        throw new Error(`Failed to parse tag expression: ${error.message}`);
    }
}

export const tagsFunction = (tagsExpression) => {
    if (!tagsExpression) {
        return (tags) => true;
    }

    const parsedTagsExpression = parseTagsExpression(tagsExpression);

    return (tags) => {
        const result = parsedTagsExpression.evaluate(tags);
        log.debug({ tags, expression: tagsExpression, result }, 'Evaluated tag expression');
        return result;
    };
}
