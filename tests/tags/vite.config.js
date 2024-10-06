import { defineConfig } from 'vitest/config'
import quickpickle from 'quickpickle';

export default defineConfig({
    plugins: [quickpickle()],
    test: {
        include : [ '**/*.feature' ],
        cucumber : {
            tags : "not (@skip or @yuck) or (@yuck and @goodstuff)",
        },
    },
})
