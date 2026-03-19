<template>
  <div
    id="resultcounter"
    class="result-summary bg-white border border-[#EBE4EA] rounded-2xl p-5 shadow-sm mb-6"
  >
    <div v-if="hasresponse" class="summary-content">
      <!-- Top Row: Toggles and Sort/View Settings -->
      <div
        class="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-[#F5F1F5]"
      >
        <!-- Left: Action Toggles -->
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative flex items-center">
              <input
                type="checkbox"
                :checked="openAccessChecked"
                @change="toggleOpenAccess"
                class="peer h-4 w-4 text-primary-color border-gray-300 rounded focus:ring-primary-color cursor-pointer"
              />
            </div>
            <span
              class="text-sm font-medium text-gray-600 group-hover:text-primary-color transition-colors"
              >Open Access Only</span
            >
          </label>

          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              :checked="allCollapsed"
              @change="toggleAllResults"
              class="h-4 w-4 text-primary-color border-gray-300 rounded focus:ring-primary-color cursor-pointer"
            />
            <span
              class="text-sm font-medium text-gray-600 group-hover:text-primary-color transition-colors"
            >
              {{ !allCollapsed ? "Expand Details" : "Collapse Details" }}
            </span>
          </label>
        </div>

        <!-- Right: Sort & Page Size -->
        <div class="flex items-center gap-6">
          <!-- Sort -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Sort by:</span>
            <div class="flex items-center gap-1">
              <select
                v-model="sortKey"
                @change="sortResults"
                class="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary-color pr-6 pl-0 py-0"
              >
                <option value="parsedDate">Date</option>
                <option value="shortTitle">Title</option>
              </select>
              <select
                v-model="sortDirection"
                @change="sortResults"
                class="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary-color pr-6 pl-0 py-0"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <!-- Page Size -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Show:</span>
            <select
              id="pageSize"
              v-model.number="selectedPageSize"
              @change="updatePageSize"
              class="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary-color pr-6 pl-0 py-0"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Pagination & Count -->
      <div class="flex flex-wrap justify-between items-center gap-4 pt-4">
        <!-- Count -->
        <span class="text-sm text-gray-500 font-medium">
          Showing
          <span class="text-dark-bg font-bold"
            >{{ (1 + start).toLocaleString() }} –
            {{ (start + numcurrent).toLocaleString() }}</span
          >
          of
          <span class="text-dark-bg font-bold">{{
            numfound.toLocaleString()
          }}</span>
          results
        </span>

        <!-- Pagination -->
        <div
          class="pagination-controls flex items-center gap-1.5"
          role="navigation"
          aria-label="Pagination"
          @mouseenter="expandPagination"
          @mouseleave="collapsePaginationWithDelay"
          @focusin="expandPagination"
          @focusout="handlePaginationFocusOut"
        >
          <button
            type="button"
            @click="pageToBeginning"
            :disabled="start === 0"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 transition-colors"
          >
            <i class="ph-bold ph-caret-double-left"></i>
          </button>
          <button
            type="button"
            @click="pageBackward"
            :disabled="start === 0"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 transition-colors"
          >
            <i class="ph-bold ph-caret-left"></i>
          </button>

          <transition-group
            tag="div"
            :class="[
              'pagination-window flex items-center mx-2 gap-1',
              { expanded: isPaginationExpanded },
            ]"
            name="page-pill"
          >
            <button
              v-for="i in range(paginationStart, paginationEnd + 1)"
              :key="i"
              type="button"
              :class="[
                'min-w-[2.1rem] px-2 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all',
                currentpage === i
                  ? 'bg-primary-color text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
              @click="goToPage(i)"
            >
              {{ i }}
            </button>
          </transition-group>

          <button
            type="button"
            @click="pageForward"
            :disabled="start + numcurrent >= numfound"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 transition-colors"
          >
            <i class="ph-bold ph-caret-right"></i>
          </button>
          <button
            type="button"
            @click="pageToEnd"
            :disabled="start + numcurrent >= numfound"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 transition-colors"
          >
            <i class="ph-bold ph-caret-double-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="error p-4 bg-red-50 text-red-600 rounded-lg text-center" v-else>
      The search service is currently down.
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultCounter",
  data() {
    return {
      pageSizeOptions: [10, 20, 50, 100],
      selectedPageSize: 50,
      sortKey: "parsedDate",
      sortDirection: "desc",
      isPaginationExpanded: false,
      paginationHoverTimeout: null,
    };
  },
  computed: {
    hasresponse() {
      return this.$store.getters.hasresponse;
    },
    numfound() {
      return this.hasresponse
        ? this.$store.state.queryresponse.body.response.numFound
        : null;
    },
    numInPage() {
      return this.hasresponse
        ? parseInt(
            this.$store.state.queryresponse.body.responseHeader.params.rows,
            10,
          )
        : undefined;
    },
    numcurrent() {
      return this.hasresponse
        ? this.$store.state.queryresponse.body.response.docs.length
        : null;
    },
    start() {
      return this.hasresponse
        ? this.$store.state.queryresponse.body.response.start
        : null;
    },
    currentpage() {
      return this.start !== null
        ? Math.floor(this.start / this.numInPage) + 1
        : undefined;
    },
    maxpage() {
      return this.numfound !== null
        ? Math.floor((this.numfound - 1) / this.numInPage) + 1
        : undefined;
    },
    visiblePageStart() {
      if (!this.maxpage || !this.currentpage) return 1;
      const windowSize = 7;
      let start = Math.max(1, this.currentpage - Math.floor(windowSize / 2));
      let end = start + windowSize - 1;
      if (end > this.maxpage) {
        end = this.maxpage;
        start = Math.max(1, end - windowSize + 1);
      }
      return start;
    },
    visiblePageEnd() {
      if (!this.maxpage || !this.currentpage) return 1;
      const windowSize = 7;
      return Math.min(this.maxpage, this.visiblePageStart + windowSize - 1);
    },
    paginationStart() {
      if (!this.isPaginationExpanded) {
        return this.currentpage || 1;
      }
      return this.visiblePageStart;
    },
    paginationEnd() {
      if (!this.isPaginationExpanded) {
        return this.currentpage || 1;
      }
      return this.visiblePageEnd;
    },
    allCollapsed() {
      return this.$store.state.allCollapsed;
    },
    openAccessChecked() {
      return this.$store.state.openAccessFilter;
    },
  },
  watch: {
    hasresponse: {
      handler(val) {
        if (val) {
          const rows =
            this.$store.state.queryresponse.body.responseHeader.params.rows;
          this.selectedPageSize = parseInt(rows, 10) || this.selectedPageSize;
        }
      },
      immediate: true,
    },
  },
  methods: {
    range(start, end) {
      return Array.from({ length: end - start }, (_, i) => start + i);
    },
    goToPage(n) {
      if (n > 0 && n <= this.maxpage) {
        this.$store.dispatch("navigateToPage", {
          start: (n - 1) * this.numInPage,
        });
      }
    },
    pageForward() {
      if (this.numfound > this.start + this.numcurrent) {
        this.$store.dispatch("navigateToPage", {
          start: this.start + this.numcurrent,
        });
      }
    },
    pageBackward() {
      if (this.start > 0) {
        const nextstart = Math.max(this.start - this.numcurrent, 0);
        this.$store.dispatch("navigateToPage", { start: nextstart });
      }
    },
    pageToBeginning() {
      if (this.start !== 0) {
        this.$store.dispatch("navigateToPage", { start: 0 });
      }
    },
    pageToEnd() {
      if (this.numfound > this.start + this.numcurrent) {
        this.$store.dispatch("navigateToPage", {
          start: (this.maxpage - 1) * this.numInPage,
        });
      }
    },
    toggleAllResults(event) {
      const shouldCollapse = event.target.checked;
      if (shouldCollapse !== this.allCollapsed) {
        this.$store.dispatch("toggleAllCollapsed");
      }
    },
    updatePageSize() {
      this.$store.dispatch("updatePageSize", this.selectedPageSize);
    },
    sortResults() {
      const sortOrder = `${this.sortKey} ${this.sortDirection}`;
      this.$store.dispatch("setSortOrder", sortOrder);
    },
    toggleOpenAccess() {
      this.$store.dispatch("toggleOpenAccessFilter");
    },
    expandPagination() {
      if (this.paginationHoverTimeout) {
        clearTimeout(this.paginationHoverTimeout);
        this.paginationHoverTimeout = null;
      }
      this.isPaginationExpanded = true;
    },
    collapsePaginationWithDelay() {
      if (this.paginationHoverTimeout) {
        clearTimeout(this.paginationHoverTimeout);
      }
      this.paginationHoverTimeout = setTimeout(() => {
        this.isPaginationExpanded = false;
        this.paginationHoverTimeout = null;
      }, 220);
    },
    handlePaginationFocusOut(event) {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        this.collapsePaginationWithDelay();
      }
    },
  },
  beforeUnmount() {
    if (this.paginationHoverTimeout) {
      clearTimeout(this.paginationHoverTimeout);
    }
  },
};
</script>

<style scoped>
/* Specific overrides if standard utility classes aren't enough */
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0 center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 1.5rem;
  font-size: var(--type-body-sm);
  line-height: 1.35;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.summary-content {
  line-height: 1.5;
}

.pagination-window {
  overflow: hidden;
  max-width: 3.25rem;
  opacity: 0.92;
  transition: max-width 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms ease;
  will-change: max-width, opacity;
}

.pagination-window.expanded {
  max-width: 30rem;
  opacity: 1;
}

.page-pill-enter-active,
.page-pill-leave-active {
  transition: opacity 420ms ease;
}

.page-pill-enter-from,
.page-pill-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pagination-window,
  .page-pill-enter-active,
  .page-pill-leave-active {
    transition: none;
  }
}
</style>
