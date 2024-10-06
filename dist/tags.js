import parse from '@cucumber/tag-expressions';
const parseTagsExpression = (tagsExpression) => {
    try {
        const parsedExpression = parse(tagsExpression);
        return parsedExpression;
    }
    catch (error) {
        throw new Error(`Failed to parse tag expression: ${error.message}`);
    }
};
export const tagsFunction = (tagsExpression) => {
    if (!tagsExpression) {
        return (tags) => true;
    }
    const parsedTagsExpression = parseTagsExpression(tagsExpression);
    return (tags) => {
        const result = parsedTagsExpression.evaluate(tags);
        return result;
    };
};
//# sourceMappingURL=tags.js.map