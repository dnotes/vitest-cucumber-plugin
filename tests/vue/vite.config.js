import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    return {
        plugins: [vue(),vitestCucumberPlugin()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { },
            environment : 'jsdom',
        },
    }
});
