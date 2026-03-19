<template>
  <div
    id="app"
    class="app-shell font-sans text-black bg-bg-color min-h-screen flex flex-col"
  >
    <page-header />
    <div class="main-content flex-auto pt-[calc(50px+2vh)]">
      <router-view />
    </div>
    <button
      v-show="showBackToTop"
      type="button"
      class="back-to-top-btn"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <i class="ph-bold ph-caret-up"></i>
    </button>
    <feedback-tab />
    <page-footer />
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
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
    const showBackToTop = ref(false);

    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 420;
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    onMounted(() => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: route.path,
        });
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      showBackToTop,
      scrollToTop,
    };
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
  --type-subtitle: 1.25rem;
  --type-body-lg: 1.05rem;
  --type-body: 1rem;
  --type-body-sm: 0.925rem;

  --leading-tight: 1;
  --leading-body: 1.6;
  --leading-body-relaxed: 1.68;
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
  line-height: 1.55;
}

.back-to-top-btn {
  position: fixed;
  right: 1.15rem;
  bottom: 1.15rem;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid rgba(189, 167, 191, 0.85);
  border-radius: 999px;
  background: rgba(250, 248, 250, 0.95);
  color: var(--primary-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 120;
  box-shadow: 0 6px 18px rgba(20, 30, 60, 0.12);
}

.back-to-top-btn:hover {
  background: #fff;
}
</style>
