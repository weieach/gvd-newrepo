<template>
  <div id="schema">
    <div class="blocklabel">
      <div class="font-serif font-medium text-lg blocklabel-title">
        Filter by Tags
      </div>
    </div>

    <!-- Tag Search Input -->
    <div class="tag-search-container">
      <div class="tag-search-input-wrap">
        <input
          v-model="tagSearchQuery"
          @input="filterTags"
          type="text"
          class="tag-search-input"
          placeholder="Search tags..."
          aria-label="Search tags"
        />
        <button
          v-if="tagSearchQuery"
          @click="clearTagSearch"
          class="clear-tag-search"
          aria-label="Clear tag search"
        >
          ×
        </button>
      </div>
      <TagDisplay class="tag-display-row" />
    </div>

    <div v-if="!schema" class="loading-state">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading schema...</span>
        </div>
        <p class="mt-2">Loading tags...</p>
      </div>
    </div>

    <ul v-else class="schema-tree">
      <schema-node
        v-for="node in displayedSchema?.children || []"
        :node="node"
        :depth="0"
        :key="node.label"
        :expanded-nodes="expandedNodes"
      ></schema-node>
    </ul>

    <hr class="separator mt-4" />
    <!-- Journal Facets -->
    <JournalFacets />
  </div>
</template>

<script>
import SchemaNode from "./SchemaNode.vue";
import Autocomplete from "v-autocomplete";
import TagDisplay from "./TagDisplay.vue";
import JournalFacets from "./JournalFacets.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);

export default {
  name: "schema",
  inheritAttrs: false,
  data() {
    return {
      item: "",
      items: [],
      sortKey: "parsedDate",
      sortDirection: "desc",
      tagSearchQuery: "",
      filteredSchema: null,
      expandedNodes: new Set(),
    };
  },
  computed: {
    schema() {
      return this.$store.state.schema;
    },
    displayedSchema() {
      if (!this.schema) return null;
      if (!this.tagSearchQuery) return this.schema;
      return this.filteredSchema || this.schema;
    },
    openAccessChecked: {
      get() {
        return this.$store.state.openAccessFilter;
      },
      set(value) {
        this.$store.dispatch("toggleOpenAccessFilter");
      },
    },
    sortedDocs() {
      return this.docs;
    },
    docs() {
      if (this.$store.getters.hasresponse) {
        return this.$store.state.queryresponse.body.response.docs;
      } else {
        return [];
      }
    },
    hasBookmarks() {
      return (
        this.$store.state.bookmarks && this.$store.state.bookmarks.length > 0
      );
    },
  },
  methods: {
    toggleOpenAccess() {
      this.$store.dispatch("toggleOpenAccessFilter");
    },
    addQueryTag(item) {
      var payload = { label: item[1]["label"], tagname: item[0] };
      this.$store.commit("addQueryTag", payload);
    },
    sortResults() {
      const sortOrder = `${this.sortKey} ${this.sortDirection}`;
      this.$store.dispatch("setSortOrder", sortOrder);
    },
    viewBookmarks() {
      this.$router.push("/bookmarks");
    },
    addTag(tag) {
      if (!this.selectedTags.find((t) => t.tagname === tag.tagname)) {
        this.$store.dispatch("addTag", tag);
      }
    },
    removeTag(tagname) {
      this.$store.dispatch("removeTag", tagname);
    },
    filterTags() {
      if (!this.tagSearchQuery) {
        this.filteredSchema = null;
        this.expandedNodes.clear();
        return;
      }

      const query = this.tagSearchQuery.toLowerCase();
      this.expandedNodes.clear();
      this.filteredSchema = this.filterSchemaRecursive(this.schema, query);
    },
    filterSchemaRecursive(node, query) {
      if (!node) return null;

      const nodeMatches =
        node.label && node.label.toLowerCase().includes(query);

      const filteredChildren = [];
      let hasMatchingDescendants = false;

      if (node.children) {
        for (const child of node.children) {
          const filteredChild = this.filterSchemaRecursive(child, query);
          if (filteredChild) {
            filteredChildren.push(filteredChild);
            hasMatchingDescendants = true;
          }
        }
      }

      if (nodeMatches || hasMatchingDescendants) {
        if (
          hasMatchingDescendants &&
          node.children &&
          node.children.length > 0
        ) {
          this.expandedNodes.add(this.getNodeKey(node));
        }

        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    },
    getNodeKey(node) {
      return `${node.label || ""}-${node.tagname || ""}-${node.id || ""}`;
    },
    clearTagSearch() {
      this.tagSearchQuery = "";
      this.filteredSchema = null;
    },
  },
  watch: {
    sortKey(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.dispatch("getQueryResults");
      }
    },
    openAccessChecked(newVal) {
      if (newVal) {
        this.$forceUpdate();
      }
    },
  },
  created() {
    this.$store.dispatch("initializeBookmarks");

    if (!this.$store.state.schemaLoaded && !this.$store.state.schema) {
      this.$store.dispatch("loadSchema");
    }
  },
  components: {
    SchemaNode,
    Autocomplete,
    FontAwesomeIcon,
    TagDisplay,
    JournalFacets,
  },
};
</script>

<style scoped>
.sort-card {
  /* background-color: #eee9ef; */
  border: 1px solid #dee2e6;
  border-radius: var(--radius-lg);
  padding: var(--spacing-3) var(--spacing-4);
  margin: var(--spacing-3) 0 var(--spacing-5);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
  border-bottom: 2px solid var(--color-border-dark);
}

.open-access-card {
  /* background-color: #eee9ef; */
  border: 1px solid #dee2e6;
  border-radius: var(--radius-lg);
  padding: var(--spacing-3) var(--spacing-4);
  margin: var(--spacing-3) 0 var(--spacing-5);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
  border-bottom: 2px solid var(--color-border-dark);
}

.open-access-card label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.open-access-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.form-check-input {
  margin-right: 20px;
  padding-top: 1.25em;
}

.tag-search-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: var(--spacing-2) 0 var(--spacing-3);
}

.tag-search-input-wrap {
  position: relative;
}

.tag-search-input {
  width: 100%;
  min-height: 46px;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid #bda7bf;
  border-radius: var(--radius-full);
  font-size: var(--type-body-sm);
  line-height: 1.4;
  color: #5b2960;
  box-sizing: border-box;
  padding-right: 34px;
  background: #fff;
}

.tag-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(136, 63, 143, 0.12);
}

.tag-search-input::placeholder {
  color: #7a6a7c;
  opacity: 1;
}

.clear-tag-search {
  position: absolute;
  right: var(--spacing-2);
  top: 50%;
  transform: translateY(-50%);
  background: #f5f1f5;
  border: 1px solid rgba(189, 167, 191, 0.65);
  border-radius: 999px;
  font-size: var(--font-size-base);
  cursor: pointer;
  color: #5b2960;
  padding: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-tag-search:hover {
  background: #eee7ee;
}

.separator {
  border: 0;
  height: 1px;
  background-color: rgba(189, 167, 191, 0.6);
  margin-top: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

#schema {
  width: 100%;
  max-width: none;
  padding: 0;
}

#schema ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

#schema .schema-tree {
  padding-bottom: var(--spacing-3);
}

#schema > .blocklabel {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-1);
}

.blocklabel-title {
  color: #1f2937;
  letter-spacing: 0.01em;
  line-height: 1.25;
}

.tag-display-row {
  padding-top: 0 !important;
}

#schema div.v-autocomplete {
  margin-left: auto;
  min-width: 60%;
  line-height: 1em;
}

#schema .v-autocomplete-input,
#schema div.v-autocomplete-input-group,
#schema .v-autocomplete-list {
  color: #000000;
}

.v-autocomplete .v-autocomplete-input-group .v-autocomplete-input {
  font-size: var(--font-size-sm);
  padding: var(--spacing-2) var(--spacing-4);
  box-shadow: none;
  border: 1px solid #157977;
  width: calc(100% - 32px);
  outline: none;
  background-color: var(--color-background-alt);
}

.v-autocomplete-selected .v-autocomplete-input {
  color: green;
  background-color: #f2fff2;
}

.v-autocomplete-list {
  width: 100%;
  text-align: left;
  border: none;
  border-top: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 1px solid #157977;
}

.v-autocomplete-list-item {
  cursor: pointer;
  background-color: var(--color-background);
  padding: var(--spacing-3);
  border-bottom: 1px solid #157977;
  border-left: 1px solid #157977;
  border-right: 1px solid #157977;
}

.v-autocomplete-list-item:last-child {
  border-bottom: none;
}

.v-autocomplete-list-item:hover {
  background-color: var(--color-background-alt);
}

abbr {
  opacity: 0.8;
  font-size: var(--font-size-sm);
  display: block;
  font-family: var(--font-family-primary);
}

.view_bookmarks button {
  background-color: #337ab7;
  color: var(--color-text-inverse);
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-base);
}

.view_bookmarks button:hover {
  background-color: #286090;
}

.loading-state {
  padding: var(--spacing-6) 0;
  text-align: center;
  color: #6b7280;
  font-size: var(--type-body-sm);
}

.loading-state .spinner-border {
  width: 2rem;
  height: 2rem;
}

@media (max-width: 768px) {
  #schema {
    width: 100%;
  }
}
</style>
