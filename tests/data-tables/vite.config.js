import { defineConfig } from 'vitest/config'
import quickpickle from 'quickpickle';

export default defineConfig(({ mode }) => {
    return {
        plugins: [quickpickle()],
        test: {
            include : [ '**/*.feature' ],
            cucumber : { },
        },
    }
});
