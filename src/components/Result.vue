<template>
  <li class="result-card" :class="{ open: !localCollapsed }">
    <div class="card-header">
      <bookmark-button
        :doc="doc"
        class="bookmark-toggle"
        @bookmark-updated="handleBookmarkUpdate"
      />
      <div class="title-block">
        <div v-if="doc.publicationTitle" class="journal-title">
          {{ doc.publicationTitle }}
        </div>
        <h3 class="result-title">
          <a v-if="doc.url" :href="doc.url" target="_blank" rel="noopener">
            {{ doc.title }}
          </a>
          <a v-else-if="doc.DOI" :href="doiurl" target="_blank" rel="noopener">
            {{ doc.title }}
          </a>
          <span v-else>{{ doc.title }}</span>
        </h3>
        <div class="result-meta">
          <span v-if="doc.date" class="publication-date">{{ doc.date }}</span>
          <span v-if="displayAuthors" class="authors">{{ displayAuthors }}</span>
        </div>
      </div>
      <button
        class="toggle-more"
        type="button"
        @click="toggleIndividualCollapsed"
      >
        <span v-if="localCollapsed">Details</span>
        <span v-else>Hide</span>
        <font-awesome-icon
          :icon="['fas', localCollapsed ? 'caret-down' : 'caret-up']"
        />
      </button>
    </div>

    <div class="card-tags" v-if="doc.tags && doc.tags.length">
      <result-tag
        v-for="tagname in doc.tags"
        :tagname="tagname"
        :key="doc.key + tagname"
      />
    </div>

    <div class="card-footer" :class="{ 'card-footer--has-content': isOpenAccess }">
      <span v-if="isOpenAccess" class="access-pill">
        <font-awesome-icon :icon="['fas', 'unlock']" class="access-icon" />
        <a
          v-if="openAccessUrl"
          :href="openAccessUrl"
          target="_blank"
          rel="noopener"
          >Open access</a
        >
        <span v-else>Open access</span>
      </span>
      <button
        class="toggle-more mobile"
        type="button"
        @click="toggleIndividualCollapsed"
      >
        <span v-if="localCollapsed">Details</span>
        <span v-else>Hide</span>
        <font-awesome-icon
          :icon="['fas', localCollapsed ? 'caret-down' : 'caret-up']"
        />
      </button>
    </div>

    <div
      class="card-body transition-all duration-500 ease-in-out overflow-hidden"
      :class="localCollapsed ? 'max-h-24' : 'max-h-[1000px]'"
    >
      <p
        v-if="doc.abstractNote"
        class="abstract"
        :class="{ 'line-clamp-3': localCollapsed }"
      >
        {{ doc.abstractNote }}
      </p>
    </div>
  </li>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { defineComponent, ref, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import BookmarkButton from "./BookmarkButton.vue";
import ResultTag from "./ResultTag.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

export default defineComponent({
  name: "Result",
  props: {
    doc: { type: Object, required: true },
    index: { type: Number, required: true },
    collapsed: { type: Boolean, default: true },
  },
  components: {
    ResultTag,
    FontAwesomeIcon,
    BookmarkButton,
  },
  setup(props) {
    const store = useStore();
    const localCollapsed = ref(props.collapsed);

    const toggleIndividualCollapsed = () => {
      localCollapsed.value = !localCollapsed.value;
    };

    watchEffect(() => {
      localCollapsed.value = props.collapsed;
    });

    const handleBookmarkUpdate = () => {
      store.dispatch("loadBookmarks");
    };

    const doiurl = computed(() => {
      return props.doc.DOI ? `https://doi.org/${props.doc.DOI}` : "";
    });

    const isOpenAccess = computed(() => {
      return store.getters.isDocumentOpenAccess(props.doc);
    });

    const openAccessUrl = computed(() => {
      if (props.doc.url_for_pdf) {
        return props.doc.url_for_pdf;
      }
      if (
        props.doc.url &&
        store.getters.isOpenAccessJournal(props.doc.publicationTitle)
      ) {
        return props.doc.url;
      }
      return null;
    });

    const displayAuthors = computed(() => {
      if (!Array.isArray(props.doc.creators) || props.doc.creators.length === 0) {
        return "";
      }
      const authorNames = props.doc.creators
        .map((creator) => {
          if (typeof creator === "string") return creator.trim();
          if (creator && typeof creator === "object") {
            const combined = `${creator.firstName || ""} ${creator.lastName || ""}`.trim();
            return combined || creator.name || "";
          }
          return "";
        })
        .filter(Boolean);

      if (authorNames.length === 0) return "";

      const firstThree = authorNames.slice(0, 3).join(", ");
      return authorNames.length > 3 ? `${firstThree}, et al.` : firstThree;
    });

    return {
      localCollapsed,
      toggleIndividualCollapsed,
      handleBookmarkUpdate,
      doiurl,
      isOpenAccess,
      openAccessUrl,
      displayAuthors,
    };
  },
});
</script>

<style scoped>
.result-card {
  --bookmark-col: 2rem;
  --header-gap: var(--spacing-4);
  list-style: none;
  border: 1px solid rgba(90, 54, 107, 0.08);
  border-radius: var(--search-radius);
  padding: var(--spacing-5) var(--spacing-5);
  padding-left: 1rem;
  padding-bottom: 1.7rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 45px rgba(20, 30, 60, 0.02);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.result-card.open {
  box-shadow: 0 30px 54px rgba(20, 30, 60, 0.12);
}

.card-header {
  display: grid;
  grid-template-columns: var(--bookmark-col) minmax(0, 1fr) auto;
  gap: calc(var(--header-gap) * 0.9);
  align-items: flex-start;
}

.bookmark-toggle {
  width: var(--bookmark-col);
  display: inline-flex;
  justify-content: center;
  margin-top: var(--spacing-1);
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.journal-title {
  margin: 0;
  margin-top: 0.2rem;
  font-size: var(--type-body-sm);
  font-weight: var(--font-weight-semibold);
  color: #000;
  line-height: 1.35;
}

.result-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 500;
  color: #000;
  line-height: 1.28;
}

.result-title a {
  color: #000;
  text-decoration: none;
}

.result-title a:hover {
  text-decoration: underline;
}

.result-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-1);
  font-size: var(--type-body-sm);
  color: #111827;
  line-height: 1.5;
}

.toggle-more {
  border: none;
  background: transparent;
  color: var(--color-primary-600);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  transition: color var(--transition-base), transform var(--transition-base);
}

.toggle-more:hover {
  background: transparent;
  color: var(--color-primary-700);
  transform: translateY(-1px);
}

.toggle-more.mobile {
  display: none;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  padding-left: calc(var(--bookmark-col) + var(--header-gap));
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-3);
  padding-left: calc(var(--bookmark-col) + var(--header-gap));
}

/* On desktop the mobile toggle is invisible — hide the footer from
   the flex flow entirely so it doesn't create a phantom double gap. */
@media (min-width: 769px) {
  .card-footer:not(.card-footer--has-content) {
    display: none;
  }
}

.access-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  background: rgba(76, 175, 80, 0.12);
  color: var(--color-success);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.access-pill a {
  color: inherit;
  text-decoration: none;
}

.access-icon {
  font-size: 0.8rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding-left: calc(var(--bookmark-col) + var(--header-gap));
}

.abstract {
  margin: 0;
  color: rgba(17, 24, 39, 0.58);
  font-size: var(--type-body-sm);
  line-height: var(--leading-body);
  text-align: left;
}

@media (max-width: 768px) {
  .result-card {
    padding: var(--spacing-5);
    gap: var(--spacing-3);
  }

  .card-header {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }

  .toggle-more {
    display: none;
  }

  .toggle-more.mobile {
    display: inline-flex;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .result-card,
  .toggle-more,
  .result-expand-enter-active,
  .result-expand-leave-active {
    transition: none;
  }
}
</style>
