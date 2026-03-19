<template>
  <div id="textsearch" class="search-box" ref="root">
    <div class="search-container flex items-center gap-3">
      <div class="search-input-wrapper flex-1">
        <input
          v-model="textSearch"
          @input="handleInput"
          @keydown.enter="handleEnterKey"
          @focus="handleFocus"
          type="text"
          class="search-input"
          placeholder="Search articles by keywords, journals, or tags..."
          aria-label="Search the Gender Violence Database"
        />
        <button
          v-if="textSearch.length > 0"
          @click="clearSearch"
          class="clear-search-btn"
          type="button"
          aria-label="Clear search"
        >
          ×
        </button>
      </div>

      <button
        @click="viewBookmarks"
        class="bookmark-btn flex items-center gap-2 px-4 py-3 rounded-full bg-white border border-[#BDA7BF]/20 shadow-sm hover:bg-[#FAF8FA] transition-all group relative"
        title="View Bookmarks"
      >
        <i
          class="ph-bold ph-bookmark-simple text-xl text-primary-color group-hover:scale-110 transition-transform"
        ></i>
        <span class="text-sm font-medium text-dark-bg hidden md:inline"
          >View Bookmarks</span
        >
        <span
          v-if="numBookmarks > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white"
        >
          {{ numBookmarks }}
        </span>
      </button>
    </div>

    <div
      class="search-suggestions"
      v-if="showSuggestions && suggestions.length > 0"
    >
      <div class="suggestions-header">Suggestions</div>
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="suggestion-item"
        type="button"
        @click="selectSuggestion(suggestion)"
      >
        <span
          class="suggestion-type"
          :class="`suggestion-type-${suggestion.type.toLowerCase()}`"
          >{{ suggestion.type }}</span
        >
        <span class="suggestion-text">{{ suggestion.text }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "TextSearch",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const textSearch = ref("");
    const showSuggestions = ref(false);
    const suggestions = ref([]);
    const debounceTimeout = ref(null);
    const searchDebounceTimeout = ref(null);
    const skipNextHandleInput = ref(false);
    const root = ref(null);

    const numBookmarks = computed(() => store.getters.numBookmarks);

    const handleClickOutside = (event) => {
      if (root.value && !root.value.contains(event.target)) {
        showSuggestions.value = false;
      }
    };

    onMounted(() => {
      const urlText = route.query.text || "";
      if (urlText) {
        textSearch.value = urlText;
      }
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    const viewBookmarks = () => {
      router.push("/bookmarks");
    };

    const handleInput = () => {
      if (skipNextHandleInput.value) {
        skipNextHandleInput.value = false;
        return;
      }

      clearTimeout(searchDebounceTimeout.value);

      if (textSearch.value.trim() === "") {
        store.dispatch("clearTextSearchOnly");
        showSuggestions.value = false;
        suggestions.value = [];
      } else {
        searchDebounceTimeout.value = setTimeout(() => {
          const input = textSearch.value.toLowerCase();
          const isJournalSearch =
            input.startsWith("journal:") ||
            input.includes("journal of") ||
            input.includes("international journal") ||
            input.includes("american journal") ||
            input.includes("review of") ||
            input.includes("quarterly") ||
            input.includes("annual review");

          if (isJournalSearch) {
            let journalName = textSearch.value;
            if (input.startsWith("journal:")) {
              journalName = textSearch.value.substring(8).trim();
              textSearch.value = "";
              store.dispatch("addJournal", journalName);
            } else {
              store.dispatch("updateSearchQuery", textSearch.value);
            }
          } else {
            store.dispatch("updateSearchQuery", textSearch.value);
          }
        }, 400);

        generateSuggestions();
      }
    };

    const handleFocus = () => {
      if (suggestions.value.length > 0) {
        showSuggestions.value = true;
      }
    };

    const generateSuggestions = () => {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = setTimeout(async () => {
        const input = textSearch.value.toLowerCase();
        if (input.length < 2) {
          showSuggestions.value = false;
          return;
        }

        const newSuggestions = [];
        const tags = store.getters.schemataglist || [];
        const matchingTags = tags
          .filter((tag) => tag.label && tag.label.toLowerCase().includes(input))
          .slice(0, 5);

        if (matchingTags.length > 0) {
          newSuggestions.push({
            id: `keyword-${input}`,
            type: "Keyword",
            text: input,
            data: { text: input },
          });
        }

        matchingTags.forEach((tag) => {
          newSuggestions.push({
            id: `tag-${tag.tagname}`,
            type: "Tag",
            text: tag.label,
            data: tag,
          });
        });

        try {
          const matchingJournals = await store.dispatch(
            "fetchJournalSuggestions",
            input,
          );
          matchingJournals.slice(0, 5).forEach((journal) => {
            newSuggestions.push({
              id: `journal-${journal}`,
              type: "Journal",
              text: journal,
              data: { name: journal },
            });
          });
        } catch (error) {
          console.error("Error fetching journal suggestions:", error);
        }

        suggestions.value = newSuggestions;
        showSuggestions.value = newSuggestions.length > 0;
      }, 250);
    };

    const selectSuggestion = (suggestion) => {
      showSuggestions.value = false;
      suggestions.value = [];

      if (suggestion.type === "Keyword") {
        textSearch.value = suggestion.text;
        store.dispatch("updateSearchQuery", suggestion.text);
      } else if (suggestion.type === "Tag") {
        store.dispatch("addTag", suggestion.data);
        skipNextHandleInput.value = true;
      } else if (suggestion.type === "Journal") {
        store.dispatch("addJournal", suggestion.data.name);
        skipNextHandleInput.value = true;
      }
    };

    const clearSearch = () => {
      textSearch.value = "";
      store.dispatch("clearTextSearchOnly");
      showSuggestions.value = false;
      suggestions.value = [];
    };

    const handleEnterKey = () => {
      showSuggestions.value = false;
      suggestions.value = [];
    };

    const hideSuggestions = () => {
      showSuggestions.value = false;
    };

    return {
      textSearch,
      showSuggestions,
      suggestions,
      handleInput,
      handleEnterKey,
      hideSuggestions,
      clearSearch,
      selectSuggestion,
      handleFocus,
      viewBookmarks,
      numBookmarks,
      root,
    };
  },
};
</script>

<style scoped>
.search-box {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #bda7bf;
  border-radius: var(--radius-full);
  padding: var(--spacing-1) var(--spacing-2) var(--spacing-1) var(--spacing-4);
  box-shadow: none;
  min-height: 46px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--type-body);
  font-family: var(--font-family-primary);
  color: #5b2960;
  padding: var(--spacing-2) 0;
  min-width: 0;
}

.search-input::placeholder {
  color: #7a6a7c;
  opacity: 1;
}

.search-input-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(136, 63, 143, 0.12);
}

.clear-search-btn {
  border: 1px solid rgba(189, 167, 191, 0.65);
  background: #f5f1f5;
  color: #5b2960;
  border-radius: var(--radius-full);
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background var(--transition-base);
  flex-shrink: 0;
}

.clear-search-btn:hover {
  background: #eee7ee;
}

.search-suggestions {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-xl);
  box-shadow: 0 24px 45px rgba(20, 30, 60, 0.12);
  border: 1px solid rgba(90, 54, 107, 0.08);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  z-index: var(--z-tooltip);
}

.suggestions-header {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  border: none;
  background: rgba(90, 54, 107, 0.04);
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-base),
    transform var(--transition-base);
}

.suggestion-item:hover {
  background: rgba(90, 54, 107, 0.08);
  transform: translateY(-1px);
}

.suggestion-type {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600);
}

.suggestion-type-journal {
  color: var(--color-accent-600);
}

.suggestion-text {
  font-size: var(--type-body-sm);
  color: var(--color-text-primary);
  line-height: 1.45;
}

@media (max-width: 768px) {
  .search-suggestions {
    padding: var(--spacing-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clear-search-btn,
  .suggestion-item {
    transition: none;
  }
}
</style>
