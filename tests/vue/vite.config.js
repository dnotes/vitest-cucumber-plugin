import { defineConfig } from 'vitest/config'
import quickpickle from 'quickpickle';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    return {
        plugins: [vue(),quickpickle()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { },
            environment : 'jsdom',
        },
    }
});
