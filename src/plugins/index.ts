import type { App, Plugin } from "vue";

import pinia from "./pinia";
import router from "./router";
import vuert from "./vuert";
import vuetify from "./vuetify";

import errorHandler from "./errors-handler";

const plugins: Plugin = {
    install(app: App, ...options: undefined[]): void
    {
        app.use(pinia);
        app.use(router);
        app.use(vuert);
        app.use(vuetify);

        app.use(errorHandler);
    }
};

export default plugins;
