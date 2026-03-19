<template>
  <div class="journal-facets mt-6">
    <div
      class="blocklabel flex items-center justify-between mb-3 cursor-pointer"
      @click="isExpanded = !isExpanded"
    >
      <div class="font-serif font-medium text-lg">Filter by Journals</div>
      <i
        :class="isExpanded ? 'ph-bold ph-caret-down' : 'ph-bold ph-caret-right'"
      ></i>
    </div>

    <div v-if="isExpanded" class="journal-list-container">
      <div class="journal-controls">
        <div class="journal-controls-row">
          <input
            v-model="filterText"
            type="text"
            placeholder="Filter journals..."
            class="journal-filter-input"
          />
          <select
            id="journal-sort"
            v-model="sortMode"
            class="journal-sort-select secondary-btn"
            aria-label="Sort journals"
          >
            <option value="alpha">A-Z</option>
            <option value="count">Count</option>
          </select>
        </div>
      </div>

      <div
        :class="
          isScrollable
            ? 'max-h-[420px] overflow-y-auto pr-2'
            : 'overflow-visible pr-0'
        "
      >
        <div
          v-if="sortedJournals.length === 0"
          class="text-sm text-gray-500 italic"
        >
          No journals found.
        </div>

        <div
          v-for="journal in displayedJournals"
          :key="journal.name"
          class="journal-item flex items-center justify-between px-2 hover:bg-gray-100 py-1 rounded cursor-pointer"
          @click="toggleJournal(journal.name)"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <input
              type="checkbox"
              :checked="isJournalSelected(journal.name)"
              class="form-checkbox text-primary-color rounded-sm"
              @click.stop="toggleJournal(journal.name)"
            />
            <span class="text-base" :title="journal.name">{{
              truncateName(journal.name)
            }}</span>
          </div>
          <span class="text-xs text-gray-500">({{ journal.count }})</span>
        </div>

        <button
          v-if="hasMoreJournals && !filterText"
          @click="showMore = !showMore"
          class="text-xs text-primary-color mt-2 hover:underline w-full text-left pl-2 pt-3"
        >
          {{ showMore ? "See less" : "See more" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "JournalFacets",
  data() {
    return {
      isExpanded: window.innerWidth >= 1024,
      filterText: "",
      sortMode: "alpha",
      showMore: false,
      initialLimit: 14,
    };
  },
  computed: {
    ...mapState({
      selectedJournals: (state) => state.query.journalSearches || [],
    }),
    ...mapGetters(["journalFacets"]),

    allJournals() {
      const facets = this.journalFacets || {};
      return Object.entries(facets).map(([name, count]) => ({
        name,
        count,
      }));
    },

    sortedJournals() {
      let journals = this.allJournals;

      if (this.filterText) {
        const lowerFilter = this.filterText.toLowerCase();
        journals = journals.filter((j) =>
          j.name.toLowerCase().includes(lowerFilter),
        );
      }

      if (this.sortMode === "count") {
        journals = [...journals].sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return a.name.localeCompare(b.name);
        });
      } else {
        journals = [...journals].sort((a, b) => a.name.localeCompare(b.name));
      }

      return journals;
    },

    displayedJournals() {
      if (this.filterText || this.showMore) {
        return this.sortedJournals;
      }
      return this.sortedJournals.slice(0, this.initialLimit);
    },

    hasMoreJournals() {
      return this.sortedJournals.length > this.initialLimit;
    },
    isScrollable() {
      return !!this.filterText || this.showMore;
    },
  },
  mounted() {
    if (Object.keys(this.journalFacets).length === 0) {
      this.$store.dispatch("loadJournalList");
    }
  },
  methods: {
    isJournalSelected(name) {
      return this.selectedJournals.includes(name);
    },
    toggleJournal(name) {
      if (this.isJournalSelected(name)) {
        this.$store.dispatch("removeJournal", name);
      } else {
        this.$store.dispatch("addJournal", name);
      }
    },
    truncateName(name, max = 35) {
      return name.length > max ? name.slice(0, max) + "…" : name;
    },
  },
};
</script>

<style scoped>
.journal-filter-input {
  width: 100%;
  min-height: 46px;
  padding: 0.5rem var(--search-padding-inline);
  border: var(--search-border);
  border-radius: var(--search-radius);
  font-size: 0.95rem;
  color: #5b2960;
  outline: none;
  background: #fff;
}

.journal-filter-input::placeholder {
  color: #7a6a7c;
  opacity: 1;
}

.journal-filter-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(136, 63, 143, 0.12);
}

.journal-item input[type="checkbox"] {
  cursor: pointer;
}

.journal-controls {
  margin-bottom: 0.75rem;
}

.journal-facets {
  padding-bottom: 1.25rem;
}

.journal-controls-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem;
  align-items: stretch;
}

.journal-sort-select {
  /* layout & select-specific — visual tokens come from .secondary-btn */
  width: 100%;
  height: 100%;
  padding: 0.35rem 1.9rem 0.35rem var(--search-padding-inline);
  outline: none;
  width: auto;
  max-width: 110px;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23883f8f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.4rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
}

.journal-sort-select:focus {
  box-shadow: 0 0 0 2px rgba(136, 63, 143, 0.12);
}

@media (max-width: 560px) {
  .journal-controls-row {
    grid-template-columns: 1fr;
  }

  .journal-sort-select {
    max-width: 120px;
    justify-self: end;
  }
}
</style>
