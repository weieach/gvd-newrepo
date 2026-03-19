<template>
  <div
    id="search"
    class="pagecomponent search-page pt-[calc(25px+5vh-2rem)] max-w-[1600px] mx-auto pb-20 flex items-start relative gap-8 lg:gap-12 px-5 md:px-8 lg:px-11 flex-col lg:flex-row"
  >
    <aside
      class="sidebar lg:sticky lg:top-[calc(108px+5vh)] w-full lg:w-[430px] self-start shrink-0 lg:h-[calc(100vh-(100px+5vh))] flex flex-col gap-4 pb-3 mb-3"
      aria-label="Browse taxonomy filters"
    >
      <h1
        id="search-title"
        class="page-title text-black"
      >
        Browse
      </h1>
      <schema class="schema"></schema>
    </aside>

    <section class="results-panel flex-1 min-w-0" aria-live="polite">
      <div class="search-control-panel">
        <div class="results-top-row">
          <div class="query-tools">
            <text-search />
            <journal-display />
          </div>
        </div>

        <result-counter class="result-counter"></result-counter>
      </div>

      <result-list class="results"></result-list>
    </section>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import Schema from "./Schema.vue";
import ResultList from "./ResultList.vue";
import ResultCounter from "./ResultCounter.vue";
import TextSearch from "./TextSearch.vue";
import JournalDisplay from "./JournalDisplay.vue";
import QueryBuilder from "./QueryBuilder.vue";
import PageHeader from "./PageHeader.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "Search",
  components: {
    PageHeader,
    Schema,
    ResultList,
    ResultCounter,
    TextSearch,
    JournalDisplay,
    QueryBuilder,
  },
  data() {
    return {
      allCollapsed: false,
    };
  },
  computed: {
    openAccessChecked() {
      return this.$store.state.openAccessFilter;
    },
    ...mapState(["query"]),
    formattedArticles() {
      const total = this.$store.getters.hasresponse
        ? this.$store.state.queryresponse.body.response.numFound
        : null;
      const fallback = 15000;
      const value = total || fallback;
      return value.toLocaleString();
    },
    formattedTopics() {
      const list = this.$store.getters.schemataglist || [];
      return list.length ? list.length.toLocaleString() : "N/A";
    },
  },
  methods: {
    ...mapActions(["updateQuery", "getQueryResults"]),
    toggleOpenAccess() {
      this.$store.dispatch("toggleOpenAccessFilter");
      this.$store.dispatch("updateVisibleArticles");
    },
    initializeQueryFromRoute() {
      const tags = this.$route.query.tags
        ? this.$route.query.tags.split(",").map((tagname) => ({
            tagname,
            label: this.$store.getters.getTagLabel(tagname) || tagname,
          }))
        : [];
      const querytext = this.$route.query.text || "";
      const journalSearch = this.$route.query.journal || "";
      const journalSearches = this.$route.query.journals
        ? this.$route.query.journals.split(",")
        : [];

      this.updateQuery({ tags, querytext, journalSearch, journalSearches });
    },
    updateURL(query) {
      const tagNames = query.tags.map((tag) => tag.tagname).join(",");

      const textMatchesTag =
        query.querytext &&
        query.tags.some(
          (tag) =>
            tag.tagname.toLowerCase() === query.querytext.toLowerCase() ||
            tag.label.toLowerCase() === query.querytext.toLowerCase(),
        );

      const journalsParam =
        query.journalSearches && query.journalSearches.length > 0
          ? query.journalSearches.join(",")
          : undefined;

      this.$router.push({
        path: "/search",
        query: {
          tags: tagNames || undefined,
          text:
            query.querytext && !textMatchesTag ? query.querytext : undefined,
          journal: query.journalSearch || undefined,
          journals: journalsParam,
        },
      });
    },
  },
  created() {
    this.initializeQueryFromRoute();
  },
  watch: {
    query: {
      handler(newQuery) {
        this.updateURL(newQuery);
        this.getQueryResults();
      },
      deep: true,
    },
    $route: {
      handler: "initializeQueryFromRoute",
      immediate: true,
    },
  },
  mounted() {
    this.initializeQueryFromRoute();
  },
};
</script>

<style scoped>
.search-page {
  background: transparent;
}

.sidebar {
  background: transparent;
  border: none;
  padding: 0;
  max-height: calc(100vh - (108px + 5vh));
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(136, 63, 143, 0.2) transparent;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(136, 63, 143, 0.2);
  border-radius: 999px;
}

.sidebar:hover::-webkit-scrollbar-thumb,
.sidebar:focus-within::-webkit-scrollbar-thumb {
  background-color: rgba(136, 63, 143, 0.35);
}

.results-panel {
  max-width: 1120px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.results-top-row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.query-tools {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.hero-support {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-primary-600);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-stat {
  background: rgba(90, 54, 107, 0.08);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
}

.search-control-panel {
  position: sticky;
  top: var(--nav-height);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  background: #FAF8FA;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3) 0;
  padding-top: 2.5rem;
  /* box-shadow: 0 4px 24px rgba(20, 30, 60, 0.07); */
}

.result-counter {
  /* visual container handled by .search-control-panel */
}

.results {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

@media (min-width: 1024px) and (max-width: 1400px) {
  .sidebar {
    width: 390px;
  }
}

@media (max-width: 1023px) {
  .sidebar {
    position: static;
    max-height: none;
    width: 100%;
  }

  .results-panel {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .results-panel {
    gap: var(--spacing-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .results-panel,
  .sidebar {
    transition: none;
  }
}

.sidebar :deep(#schema) {
  width: 100% !important;
  max-width: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
