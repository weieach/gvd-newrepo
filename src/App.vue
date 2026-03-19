<template>
  <div
    id="app"
    class="app-shell font-sans text-black bg-bg-color min-h-screen flex flex-col"
  >
    <page-header />
    <div class="main-content flex-auto pt-[calc(50px+2vh)]">
      <router-view />
    </div>
    <feedback-tab />
    <page-footer />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import FeedbackTab from "./components/FeedbackTab.vue";
import PageFooter from "./components/PageFooter.vue";
import PageHeader from "./components/PageHeader.vue";

export default {
  name: "App",
  components: {
    FeedbackTab,
    PageFooter,
    PageHeader,
  },
  setup() {
    const route = useRoute();

    onMounted(() => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: route.path,
        });
      }
    });
  },
};
</script>

<style>
@import "./assets/legacy-design-system.css";

/* Global Variables from Reference */
:root {
  /* color */
  --bg-color: #faf8fa;
  --primary-color: #883f8f;
  --border-color: #bda7bf;
  --border-color-light: #ebe4ea;
  --dark-bg: #5a285f;
  --cerulean: #0f8da5;

  /* font size */
  --title-lg: 2.625rem;
  --title-md: 1.875rem;
  --title-md-rg: 1.6rem;
  --title-rg: 1.25rem;
  --title-sm: 1rem;

  /* shared type scale for active pages */
  --type-page-title: clamp(2rem, 1.7rem + 1.35vw, 2.625rem);
  --type-section-title: clamp(1.5rem, 1.35rem + 0.55vw, 1.875rem);
  --type-subtitle: 1.2rem;
  --type-body-lg: 1rem;
  --type-body: 0.96rem;
  --type-body-sm: 0.925rem;

  --leading-tight: 1;
  --leading-heading: 1.3;
  --leading-body: 1.31;
  --leading-body-relaxed: 1.45;

  /* Layout */
  --nav-height: 80px;

  /* Search bar tokens */
  --search-radius: 16px;
  --search-border: 0.8px solid #bea7c0;
  --search-padding-inline: 1rem;
}

/* Global Reset/Defaults matching reference */
html {
  color-scheme: light;
}

body {
  font-family: "geist", system-ui, sans-serif;
  font-size: var(--type-body);
  line-height: var(--leading-body);
  margin: 0;
  background-color: var(--bg-color);
  color: black;
}

p {
  color: black;
  margin: 0;
  line-height: var(--leading-body);
}

a {
  color: black;
  text-decoration: none;
  font-weight: 450;
}

h1,
h2,
h3,
h4 {
  color: black;
  font-family: "larken", serif;
  line-height: var(--leading-tight);
  margin: 0;
}

input,
select,
textarea,
button {
  font: inherit;
}

input[type="checkbox"] {
  accent-color: var(--cerulean);
}

.page-title {
  font-family: "larken", serif;
  font-size: var(--type-page-title);
  font-weight: 500;
  line-height: var(--leading-tight);
  letter-spacing: 0;
  margin: 0;
}

.section-title {
  font-family: "larken", serif;
  font-size: var(--type-section-title);
  font-weight: 500;
  line-height: var(--leading-tight);
  margin: 0;
}

.body-copy-lg {
  font-size: var(--type-body-lg);
  line-height: var(--leading-body-tight);
}

.body-copy {
  font-size: var(--type-body);
  line-height: var(--leading-body);
}

.body-copy-sm {
  font-size: var(--type-body-sm);
  line-height: 1.4;
}

.secondary-btn {
  background: rgba(90, 54, 107, 0.06);
  color: var(--primary-color);
  border: none;
  border-radius: var(--search-radius);
  font-size: var(--type-body-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-out;
}

.secondary-btn:hover {
  background: rgba(90, 54, 107, 0.11);
}

</style>
