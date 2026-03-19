// import { createApp } from "vue";
// import "intro.js";
// import "intro.js/introjs.css";
// import App from "./App.vue";
// import router from "./router";
// // import VueIntro from "vue-introjs";
// // import VueResource from "vue-resource";
// // import VueResponsive from "vue-responsive";
// // import VueD3 from "vue-d3";
// import store from "./store";
// import "../static/lodash.min.js";
// import "@fortawesome/fontawesome-svg-core/styles.css";

// const app = createApp(App);

// app.use(VueIntro);
// app.use(VueResource);
// app.use(VueD3);
// app.use(VueResponsive);

// app.config.productionTip = false;

// app.use(store);
// app.use(router);
// app.mount("#app");

// store.dispatch("getQueryResults");
// store.dispatch("initializeBookmarks");

import "intro.js/introjs.css";
import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueGtag from "vue-gtag";
import "../public/static/lodash.min.js";
import "./assets/tailwind.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretDown,
  faCaretUp,
  faUnlock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

library.add(faCaretDown, faCaretUp, faUnlock, faInfoCircle);

const app = createApp(App);

app.config.globalProperties.$axios = axios;

import introJs from "intro.js";

app.config.globalProperties.$introJs = introJs;

app.directive("responsiveness", {
  mounted() {},
});

const isProd = process.env.NODE_ENV === "production";
app.use(
  VueGtag,
  {
    enabled: isProd,
    property: {
      id: isProd ? "G-236LCTC9R4" : "",
    },
  },
  router
);

app.use(router);
app.use(store);

app.mount("#app");

// First check if we need to refresh the cache
store.dispatch("checkAndClearDailyCache").then((cacheCleared) => {
  // Always load the schema regardless of cache state
  store.dispatch("loadSchema").then(() => {
    store.dispatch("getQueryResults");
    store.dispatch("initializeBookmarks");

    // If cache wasn't cleared, we need to load the existing cached data
    if (!cacheCleared) {
      store.dispatch("loadCachedGlossaryArticles");
      store.dispatch("loadCachedData");
    }

    // Always fetch glossary articles to ensure they're up to date
    store.dispatch("fetchAndCacheGlossaryArticles").catch(err => {
      console.warn("Failed to fetch glossary articles in background:", err);
    });
  });
});

// import "intro.js/intro.js";
// import "intro.js/introjs.css";
// import { createApp } from "vue";
// import VueIntro from "vue-introjs";
// import VueResource from "vue-resource";
// import VueResponsive from "vue-responsive";
// import VueD3 from "vue-d3";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";
// import "../static/lodash.min.js";
// import "@fortawesome/fontawesome-svg-core/styles.css";

// const app = createApp(App);

// app.use(VueIntro);
// app.use(VueResource);
// app.use(VueD3);

// app.directive("responsiveness", VueResponsive);

// app.config.productionTip = false;

// app.use(router);
// app.use(store);

// app.mount("#app");

// // Dispatch actions after the app is mounted
// store.dispatch("getQueryResults");
// store.dispatch("initializeBookmarks");
