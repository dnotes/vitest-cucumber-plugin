import { defineConfig } from 'vitest/config'
import quickpickle from 'quickpickle';

export default defineConfig(({ mode }) => {
    const level = (mode === 'test-debug') ? 'info' : 'warn';
    return {
        plugins: [quickpickle()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { language : 'no' },
        },
    }
});
