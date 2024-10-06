# Contributing Guide

## Testing

```
$ npm test
```

Running this does a "npm install" followed by a "npm test" in each of the directories found in the [tests](tests)
directory.  The test suite fails if either of these commands returns with a non-zero exit code.

## Gherkin parser

This plugin uses the official [gherkin](https://github.com/cucumber/gherkin) parser to parse the feature files.
