import type { App, Plugin } from "vue";

import pinia from "./pinia";
import router from "./router";
import vuetify from "./vuetify";

const plugins: Plugin = {
    install(app: App, ...options: undefined[]): void
    {
        app.use(pinia);
        app.use(router);
        app.use(vuetify);
    }
};

export default plugins;
