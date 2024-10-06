import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

export default defineConfig(({ mode }) => {
    return {
        plugins: [vitestCucumberPlugin()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { },
        },
    }
});
