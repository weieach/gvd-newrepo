import { createStore, ref } from "vuex";
import schemajson from "../../public/static/schema_indent.json";
import colljson from "../../public/static/collections.json";
import _, { over } from "lodash";

import Vue from "vue";
import schematize from "./schematize.js";
import schemacounter from "./schemacounts.js";
import schemataglookup from "./schemataglookup.js";
import flattentags from "./flattentags.js";
import collpath from "./collectionpath.js";
import collectiontree from "./collectiontree.js";
import makequery from "./querystringAndOr.js";
import untaggedquery from "./untaggedquery.js";
import MakeJournalQuery from "./journalqueries.js";
import { SOLR_BASE } from "../../config/config";
import router from "../router";

// eslint-disable-next-line
const emptyquery = {
  status: "active",
  tags: [],
  querytext: "",
  journalSearch: "",
  journalSearches: [],
};

const store = createStore({
  state() {
    return {
      schema: null,
      taglookup: {},
      schemaLoaded: false,
      schemaError: null,
      collections: colljson,
      collectiontree: collectiontree(colljson),
      query: {
        status: "active",
        tags: [],
        querytext: "",
        journalSearch: "",
        journalSearches: [],
      },
      querystart: 0,
      pageSize: 50, // Default page size
      queryresponse: {},
      untaggedresponse: {},
      journals: {},
      posts: [],
      error: null,
      openAccessFilter: false,
      currentSort: "parsedDate desc",
      allCollapsed: true,
      bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
      selectedTags: [],
      tooltipContent: null,
      activeTooltipId: null,
      cachedPosts: [],
      cachedSections: [],
      lastCacheUpdate: null,
      ignoredTags: ["Glossary", "Research", "Contributors", "Overview"],
      cachedFullArticle: null,
      fullArticleLastUpdate: null,
      cachedGlossaryArticles: [],
      glossaryLastUpdate: null,
      contributors: [],
      contributorsLoading: false,
      contributorsError: null,
      overview: null,
      overviewLoading: false,
      overviewError: null,
      cachedOverview: null,
      overviewLastUpdate: null,

      cachedOverview: null,
      overviewLastUpdate: null,

      cachedContributors: null,
      contributorsLastUpdate: null,
      journalList: {},
      landingArticles: {
        scope: null,
        approach: null,
        workflow: null,
      },
      feedbackModalOpen: false,
    };
  },
  getters: {
    untaggedquerystring: (state) => {
      return untaggedquery();
    },
    hasuntaggedresponse: (state) => {
      return (
        state.untaggedresponse.ok &&
        "body" in state.untaggedresponse &&
        "response" in state.untaggedresponse.body
      );
    },
    querystring: (state) => {
      let baseQuery = makequery(
        state.query,
        state.querystart,
        state.currentSort,
        state.pageSize,
      );
      if (state.openAccessFilter) {
        baseQuery += "&fq=url_for_pdf:[* TO *]";
      }

      if (
        state.query.journalSearches &&
        state.query.journalSearches.length > 0
      ) {
        const journalFilters = state.query.journalSearches.map(
          (journalName) => `publicationTitle:"${journalName}"`,
        );
        const combinedJournalFilter =
          journalFilters.length === 1
            ? journalFilters[0]
            : `(${journalFilters.join(" OR ")})`;
        baseQuery += `&fq=${encodeURIComponent(combinedJournalFilter)}`;
      } else if (
        state.query.journalSearch &&
        state.query.journalSearch.length > 0
      ) {
        const journalName = state.query.journalSearch;
        const journalFilter = `publicationTitle:"${journalName}"`;
        baseQuery += `&fq=${encodeURIComponent(journalFilter)}`;
      }
      return baseQuery;
    },
    hasresponse: (state) => {
      return (
        state.queryresponse.ok &&
        "body" in state.queryresponse &&
        "response" in state.queryresponse.body
      );
    },
    schemacounts: function (state, getters) {
      if (!state.schema) {
        return null;
      }
      return schemacounter(state.schema, getters.tagfacets);
    },
    tagfacets: function (state) {
      if (
        state.queryresponse.ok &&
        "body" in state.queryresponse &&
        "facet_counts" in state.queryresponse.body
      ) {
        let tagfacets = state.queryresponse.body.facet_counts.facet_fields.tags;
        return tagfacets;
      } else {
        return {};
      }
    },
    journalFacets: function (state) {
      return state.journalList || {};
    },
    schemataglist: function (state) {
      if (!state.schema) {
        return [];
      }
      return flattentags(state.schema);
    },
    taglookup: function (state) {
      if (!state.schema) {
        return {};
      }
      const tagsonly = _.filter(
        flattentags(state.schema),
        (v) => v.tagname > "",
      );
      return _.keyBy(tagsonly, "tagname");
    },
    hasEmptySubquery: function (state) {
      return (state.query.tags.length > 0) | (state.query.querytext > "");
    },
    collectionpath: function (state) {
      return (collid) => collpath(state.collections, collid);
    },
    journalquery: function (state) {
      return MakeJournalQuery();
    },

    isBookmarked: (state) => (article) => {
      return state.bookmarks.some((b) => b.id === article.id);
    },
    openAccessChecked() {
      return this.$store.state.openAccessFilter;
    },
    activeBookmarks: (state, getters, rootState, rootGetters) => {
      const filter = rootGetters.openAccessOnly;
      return state.bookmarks.filter((bookmark) =>
        filter ? bookmark.openAccess : true,
      );
    },
    numBookmarks: (state) => state.bookmarks.length,
    tooltipContent: (state) => state.tooltipContent,
    getTagLabel: (state) => (tagname) => {
      if (!state.schema) {
        return tagname;
      }
      const flattenedTags = flattentags(state.schema);
      const tag = flattenedTags.find((tag) => tag.tagname === tagname);
      return tag ? tag.label : tagname;
    },
    isNodeSelected: (state) => (tagname) => {
      return state.query.tags.some((tag) => tag.tagname === tagname);
    },
    allContributors: (state) => state.contributors,
    isContributorsLoading: (state) => state.contributorsLoading,
    contributorsError: (state) => state.contributorsError,

    allOverview: (state) => state.overview,
    isOverviewLoading: (state) => state.overviewLoading,
    overviewError: (state) => state.overviewError,
    glossaryLookup: (state) => {
      const glossaryLookup = {};
      if (
        state.cachedGlossaryArticles &&
        state.cachedGlossaryArticles.length > 0
      ) {
        state.cachedGlossaryArticles.forEach((article) => {
          if (
            article.attributes &&
            article.attributes.body &&
            article.attributes.body.value
          ) {
            const content = article.attributes.body.value;

            const textArea = document.createElement("textarea");
            textArea.innerHTML = content;
            const decodedContent = textArea.value;

            const parser = new DOMParser();
            const doc = parser.parseFromString(decodedContent, "text/html");

            // Look for both paragraphs and list items that contain definitions
            const elements = doc.querySelectorAll("p, li");

            elements.forEach((element) => {
              const text = element.textContent.trim();

              // Match pattern: "Term: definition" (including strong tags around term)
              const match = text.match(/^([^:：]+)[:：]\s*(.+)$/);
              if (match) {
                let term = match[1].trim();
                const definition = match[2].trim();

                // Clean up term (remove any HTML formatting from textContent)
                term = term.replace(/^\w+\.\s*/, "");

                const termKey = term.toLowerCase().replace(/[^\w\s]/g, "");
                glossaryLookup[termKey] = definition;
                glossaryLookup[term.toLowerCase()] = definition;
              }
            });
          }
        });
      }
      return glossaryLookup;
    },
    getTagDefinition: (state, getters) => (tagname) => {
      if (!tagname || tagname === "") {
        return null;
      }

      // First priority: Check schema notes field
      if (getters.taglookup[tagname] && getters.taglookup[tagname].notes) {
        return getters.taglookup[tagname].notes;
      }

      return null;
    },
    getNodeDefinition: (state, getters) => (node) => {
      if (!node) return null;

      // First priority: Check schema notes field directly
      if (node.notes && node.notes.trim() !== "") {
        return node.notes;
      }

      // Second priority: If node has tagname, use getTagDefinition which checks schema notes
      if (node.tagname && node.tagname !== "") {
        return getters.getTagDefinition(node.tagname);
      }

      return null;
    },
    isDocumentOpenAccess: (state, getters) => (doc) => {
      // Simple check: document has PDF
      return doc.url_for_pdf ? true : false;
    },
  },

  mutations: {
    SET_FEEDBACK_MODAL(state, value) {
      state.feedbackModalOpen = value;
    },
    addQueryTag(state, payload) {
      var query = this.state.query;
      if (
        query.tags.filter((x) => x.tagname === payload.tagname).length === 0
      ) {
        query.tags = query.tags.concat(payload);
        this.state.querystart = 0;
        this.dispatch("getQueryResults");
      }
    },
    removeQueryTag(state, payload) {
      var query = this.state.query;
      query.tags = query.tags.filter((x) => x.tagname !== payload.tagname);
      this.state.querystart = 0;
      this.dispatch("getQueryResults");
    },

    updateQueryResponse(state, payload) {
      state.queryresponse = payload;
    },
    setAccessFilter(state, value) {
      state.openAccessFilter = value;
      state.querystart = 0;
      console.log(`Filter set to: ${value}`);
    },

    removeQueryText(state, payload) {
      this.state.query.querytext = "";
      this.state.querystart = 0;
      this.dispatch("getQueryResults");
    },
    setQueryText(state, text) {
      state.query.querytext = text;
    },
    clearResults(state) {
      state.query.querytext = "";
      state.query.journalSearch = "";
      state.query.journalSearches = [];
      state.queryresponse = {};
    },
    clearTextSearch(state) {
      state.query.querytext = "";
      state.queryresponse = {};
    },
    setQueryFromParams(state, payload) {
      state["query"] = payload;
      this.dispatch("getQueryResults");
    },

    pageNewStart(state, payload) {
      let start = "start" in payload ? payload.start : 0;
      state.querystart = start;
    },

    updateUntaggedQueryResponse(state, payload) {
      this.state.untaggedresponse = payload;
    },
    updateJournalQuery(state, payload) {
      this.state.journals = payload;
    },
    SET_POSTS(state, posts) {
      this.state.posts = posts;
    },
    SET_ERROR(state, error) {
      this.state.error = error;
    },
    updateSortOrder(state, sortOrder) {
      state.currentSort = sortOrder;
      state.querystart = 0;
    },
    SET_BOOKMARKS(state, bookmarks) {
      state.bookmarks = bookmarks;
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    },
    ADD_BOOKMARK(state, article) {
      if (!state.bookmarks.some((b) => b.id === article.id)) {
        state.bookmarks.push(bookmark);
        localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
      }
    },
    REMOVE_BOOKMARK(state, index) {
      state.bookmarks = state.bookmarks.filter((b) => b.id !== bookmarkId);
      state.bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
    },
    setAllCollapsed(state, payload) {
      state.allCollapsed = payload;
    },
    ADD_TAG(state, tag) {
      if (!state.query.tags.some((t) => t.tagname === tag.tagname)) {
        state.query.tags.push(tag);
      }
    },
    REMOVE_TAG(state, tagname) {
      state.query.tags = state.query.tags.filter(
        (tag) => tag.tagname !== tagname,
      );
    },
    SET_QUERY_TEXT(state, text) {
      state.query.querytext = text;
    },
    SET_JOURNAL_SEARCH(state, journalName) {
      state.query.journalSearch = journalName;
    },
    ADD_JOURNAL_SEARCH(state, journalName) {
      if (!state.query.journalSearches.includes(journalName)) {
        state.query.journalSearches.push(journalName);
      }
    },
    REMOVE_JOURNAL_SEARCH(state, journalName) {
      state.query.journalSearches = state.query.journalSearches.filter(
        (journal) => journal !== journalName,
      );
    },
    CLEAR_ALL_JOURNAL_SEARCHES(state) {
      state.query.journalSearches = [];
    },
    setTooltipContent(state, content) {
      state.tooltipContent = content;
    },
    SET_CACHED_POSTS(state, posts) {
      state.cachedPosts = posts;
    },
    SET_CACHED_SECTIONS(state, sections) {
      state.cachedSections = sections;
    },
    SET_LAST_CACHE_UPDATE(state, timestamp) {
      state.lastCacheUpdate = timestamp;
    },
    SET_CACHED_FULL_ARTICLE(state, article) {
      state.cachedFullArticle = article;
    },
    SET_PAGE_SIZE(state, size) {
      state.pageSize = size;
      // Reset to first page when changing page size
      state.querystart = 0;
    },
    SET_FULL_ARTICLE_LAST_UPDATE(state, timestamp) {
      state.fullArticleLastUpdate = timestamp;
    },
    SET_CACHED_GLOSSARY_ARTICLES(state, articles) {
      state.cachedGlossaryArticles = articles;
    },
    SET_GLOSSARY_LAST_UPDATE(state, timestamp) {
      state.glossaryLastUpdate = timestamp;
    },
    UPDATE_QUERY(state, query) {
      state.query = query;
    },
    SET_QUERY(state, query) {
      state.query = query;
    },
    ADD_TAG(state, tag) {
      if (!state.query.tags.some((t) => t.tagname === tag.tagname)) {
        state.query.tags.push(tag);
      }
    },
    REMOVE_TAG(state, tagname) {
      state.query.tags = state.query.tags.filter(
        (tag) => tag.tagname !== tagname,
      );
    },
    SET_CONTRIBUTORS(state, contributors) {
      state.contributors = contributors;
    },
    SET_CONTRIBUTORS_LOADING(state, isLoading) {
      state.contributorsLoading = isLoading;
    },
    SET_CONTRIBUTORS_ERROR(state, error) {
      state.contributorsError = error;
    },
    SET_CACHED_CONTRIBUTORS(state, cachedContributors) {
      state.cachedContributors = cachedContributors;
    },
    SET_CONTRIBUTORS_LAST_UPDATE(state, timestamp) {
      state.contributorsLastUpdate = timestamp;
    },
    SET_OVERVIEW(state, overview) {
      state.overview = overview;
    },
    SET_OVERVIEW_LOADING(state, isLoading) {
      state.overviewLoading = isLoading;
    },
    SET_OVERVIEW_ERROR(state, error) {
      state.overviewError = error;
    },
    SET_CACHED_OVERVIEW(state, cachedOverview) {
      state.cachedOverview = cachedOverview;
    },
    SET_OVERVIEW_LAST_UPDATE(state, timestamp) {
      state.overviewLastUpdate = timestamp;
    },
    SET_SCHEMA(state, schemaData) {
      state.schema = schematize(schemaData);
      state.taglookup = schemataglookup({}, schemaData);
      state.schemaLoaded = true;
      state.schemaError = null;
    },
    SET_SCHEMA_ERROR(state, error) {
      state.schemaError = error;
      state.schemaLoaded = false;
    },
    SET_JOURNAL_LIST(state, list) {
      state.journalList = list;
    },
    SET_LANDING_ARTICLES(state, payload) {
      state.landingArticles = { ...state.landingArticles, ...payload };
    },
  },

  actions: {
    openFeedbackModal({ commit }) {
      commit("SET_FEEDBACK_MODAL", true);
    },
    closeFeedbackModal({ commit }) {
      commit("SET_FEEDBACK_MODAL", false);
    },
    async loadJournalList({ commit }) {
      try {
        const base = `${SOLR_BASE}/select?wt=json&q=*:*`;
        const params = "&rows=50000&fl=publicationTitle";

        const response = await fetch(base + params);
        if (!response.ok) throw new Error("Failed to fetch journal list");

        const data = await response.json();
        const docs = data.response?.docs || [];
        const journalCounts = {};

        docs.forEach((doc) => {
          const title = doc.publicationTitle;
          if (title) {
            if (Array.isArray(title)) {
              title.forEach((t) => {
                if (t) journalCounts[t] = (journalCounts[t] || 0) + 1;
              });
            } else {
              journalCounts[title] = (journalCounts[title] || 0) + 1;
            }
          }
        });

        commit("SET_JOURNAL_LIST", journalCounts);
      } catch (error) {
        console.error("Error loading journal list:", error);
      }
    },

    async fetchLandingArticles({ commit }) {
      const titles = {
        scope: "Our Scope",
        approach: "Our Approach",
        workflow: "Tagging Workflow",
        resources: "Resources",
        timeline: "Project Timeline",
      };

      for (const [key, title] of Object.entries(titles)) {
        try {
          const response = await fetch(
            `https://gvd.research-stage.artsci.wustl.edu/admin/jsonapi/node/article?filter[title]=${encodeURIComponent(
              title,
            )}`,
            { headers: { Accept: "application/vnd.api+json" } },
          );

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              commit("SET_LANDING_ARTICLES", { [key]: data.data[0] });
            }
          }
        } catch (error) {
          console.error(`Error fetching landing article '${title}':`, error);
        }
      }
    },

    async loadSchema({ commit }) {
      try {
        const response = await fetch("./static/schema_indent.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const schemaData = await response.json();
        commit("SET_SCHEMA", schemaData);
      } catch (error) {
        console.error("Error loading schema:", error);
        commit("SET_SCHEMA_ERROR", error.message);
      }
    },

    async reloadSchema({ commit }) {
      try {
        const response = await fetch(
          "./static/schema_indent.json?" + Date.now(),
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const schemaData = await response.json();
        commit("SET_SCHEMA", schemaData);
      } catch (error) {
        console.error("Error reloading schema:", error);
        commit("SET_SCHEMA_ERROR", error.message);
      }
    },

    async getQueryResults({ commit, state, getters }) {
      try {
        const response = await fetch(getters.querystring);
        if (!response.ok) {
          console.error("Query failed with status:", response.status);
          console.error("Query URL:", getters.querystring);
        }
        const data = await response.json();

        commit("updateQueryResponse", { body: data, ok: response.ok });
      } catch (error) {
        console.error("Error fetching query results:", error);
        commit("updateQueryResponse", { ok: false, error: error.message });
      }
    },

    getUntaggedQueryResults(context) {
      Vue.http.get(this.getters.untaggedquerystring).then(
        (response) => {
          this.commit("updateUntaggedQueryResponse", response);
        },
        (response) => {
          this.commit("updateQueryResponse", response);
          console.error(`ERROR: ${response.status} ${response.statusText}`);
        },
      );
    },
    loadJournals(context) {
      Vue.http.get(this.getters.journalquery).then(
        (response) => {
          this.commit("updateJournalQuery", response);
        },
        (response) => {
          console.error(`ERROR: ${response.status} ${response.statusText}`);
        },
      );
    },
    fetchArticles({ commit }) {
      fetch(
        "https://gvd.research-stage.artsci.wustl.edu/admin/api/articles?_format=json",
      )
        .then((response) => response.json())
        .then((data) => {
          commit("SET_POSTS", data);
        })
        .catch((error) => {
          commit("SET_ERROR", error.message);
        });
    },
    toggleOpenAccessFilter({ commit, dispatch, state }) {
      commit("setAccessFilter", !state.openAccessFilter);
      dispatch("getQueryResults");
    },

    updateSearchQuery({ commit, dispatch }, text) {
      commit("setQueryText", text);
      dispatch("getQueryResults");
    },

    updatePageSize({ commit, dispatch }, size) {
      commit("SET_PAGE_SIZE", size);
      dispatch("getQueryResults");
    },

    updateSortOrder({ commit, dispatch }, sortOrder) {
      commit("updateSortOrder", sortOrder);
      commit("pageNewStart", { start: 0 });
      dispatch("getQueryResults");
    },

    navigateToPage({ commit, dispatch }, payload) {
      commit("pageNewStart", payload);
      dispatch("getQueryResults");
    },
    clearSearch({ commit, dispatch }) {
      commit("clearResults");
      dispatch("getQueryResults");
    },
    clearTextSearchOnly({ commit, dispatch }) {
      commit("clearTextSearch");
      dispatch("getQueryResults");
    },
    searchJournals({ commit, dispatch }, journalName) {
      commit("SET_JOURNAL_SEARCH", journalName);

      commit("ADD_JOURNAL_SEARCH", journalName);

      commit("SET_QUERY_TEXT", "");
      dispatch("getQueryResults");
    },
    addJournal({ commit, dispatch }, journalName) {
      commit("ADD_JOURNAL_SEARCH", journalName);

      commit("SET_QUERY_TEXT", "");
      dispatch("getQueryResults");
    },
    removeJournal({ commit, dispatch }, journalName) {
      commit("REMOVE_JOURNAL_SEARCH", journalName);
      dispatch("getQueryResults");
    },
    clearJournalSearch({ commit, dispatch }) {
      commit("SET_JOURNAL_SEARCH", "");
      commit("CLEAR_ALL_JOURNAL_SEARCHES");
      dispatch("getQueryResults");
    },
    setSortOrder({ commit, dispatch }, sortOrder) {
      commit("updateSortOrder", sortOrder);
      dispatch("getQueryResults");
    },
    loadBookmarks({ commit }) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      commit("SET_BOOKMARKS", bookmarks);
    },
    initializeBookmarks({ commit }) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      commit("SET_BOOKMARKS", bookmarks);
    },
    toggleAllCollapsed({ commit, state }) {
      commit("setAllCollapsed", !state.allCollapsed);
    },
    addQueryTag({ commit, dispatch }, payload) {
      commit("addQueryTag", payload);
      dispatch("getQueryResults");
    },
    addTag({ commit, dispatch }, tag) {
      commit("ADD_TAG", tag);
      dispatch("getQueryResults");
    },

    removeTag({ commit, dispatch }, tagname) {
      commit("REMOVE_TAG", tagname);
      dispatch("getQueryResults");
    },
    addGlossaryTermToQuery({ commit, dispatch }, payload) {
      commit("addQueryTag", payload);
      dispatch("getQueryResults");
    },
    showTooltip({ commit }, content) {
      commit("setTooltipContent", content);
    },

    hideTooltip({ commit }) {
      commit("setTooltipContent", null);
    },
    async fetchAndCacheData({ commit, state }) {
      const cacheExpiration = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      const hasCachedData =
        state.cachedPosts?.length > 0 && state.cachedSections?.length > 0;

      if (
        hasCachedData &&
        state.lastCacheUpdate &&
        now - state.lastCacheUpdate < cacheExpiration
      ) {
        return;
      }

      try {
        const articlesResponse = await fetch(
          "https://gvd.research-stage.artsci.wustl.edu/admin/api/articles?_format=json",
        );
        const tagsResponse = await fetch(
          "https://gvd.research-stage.artsci.wustl.edu/admin/jsonapi/taxonomy_term/tags",
        );

        if (!articlesResponse.ok || !tagsResponse.ok)
          throw new Error("Failed to fetch data");

        const articlesData = await articlesResponse.json();
        const tagsData = await tagsResponse.json();

        const processedSections = tagsData.data
          .filter((tag) => {
            if (!tag || !tag.id || !tag.attributes || !tag.attributes.name) {
              return false;
            }
            const ignoredTags = state.ignoredTags || [];
            return (
              !ignoredTags.includes(tag.id) &&
              !ignoredTags.includes(tag.attributes.name)
            );
          })
          .map((tag) => ({
            name: tag.attributes.name,
            tagUUID: tag.id,
          }));

        commit("SET_CACHED_POSTS", articlesData);
        commit("SET_CACHED_SECTIONS", processedSections);
        commit("SET_LAST_CACHE_UPDATE", now);

        localStorage.setItem("cachedPosts", JSON.stringify(articlesData));
        localStorage.setItem(
          "cachedSections",
          JSON.stringify(processedSections),
        );
        localStorage.setItem("lastCacheUpdate", now.toString());
      } catch (error) {
        console.error("Error fetching and caching data:", error);
      }
    },

    loadCachedData({ commit }) {
      const cachedPosts = JSON.parse(localStorage.getItem("cachedPosts"));
      const cachedSections = JSON.parse(localStorage.getItem("cachedSections"));
      const lastCacheUpdate = localStorage.getItem("lastCacheUpdate");

      if (cachedPosts) commit("SET_CACHED_POSTS", cachedPosts);
      if (cachedSections) commit("SET_CACHED_SECTIONS", cachedSections);
      if (lastCacheUpdate)
        commit("SET_LAST_CACHE_UPDATE", parseInt(lastCacheUpdate));
    },

    clearAllCaches({ commit }) {
      // Clear localStorage items
      localStorage.removeItem("cachedPosts");
      localStorage.removeItem("cachedSections");
      localStorage.removeItem("lastCacheUpdate");
      localStorage.removeItem("cachedFullArticle");
      localStorage.removeItem("fullArticleLastUpdate");
      localStorage.removeItem("cachedGlossaryArticles");
      localStorage.removeItem("glossaryLastUpdate");
      localStorage.removeItem("cachedOverview");
      localStorage.removeItem("overviewLastUpdate");
      localStorage.removeItem("cachedContributors");
      localStorage.removeItem("contributorsLastUpdate");

      // Reset state
      commit("SET_CACHED_POSTS", []);
      commit("SET_CACHED_SECTIONS", []);
      commit("SET_LAST_CACHE_UPDATE", null);
      commit("SET_CACHED_FULL_ARTICLE", null);
      commit("SET_FULL_ARTICLE_LAST_UPDATE", null);
      commit("SET_CACHED_GLOSSARY_ARTICLES", []);
      commit("SET_GLOSSARY_LAST_UPDATE", null);
      commit("SET_CACHED_OVERVIEW", null);
      commit("SET_OVERVIEW_LAST_UPDATE", null);

      console.log("All caches have been cleared.");
    },

    async checkAndClearDailyCache({ dispatch, state, commit }) {
      const lastCacheUpdate = localStorage.getItem("lastCacheUpdate");
      const now = new Date().getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (!lastCacheUpdate || now - parseInt(lastCacheUpdate) > oneDayInMs) {
        console.log("Cache is older than 24 hours. Refreshing data...");
        // Clear all caches
        dispatch("clearAllCaches");

        // Set a refresh timestamp
        const refreshTimestamp = now;
        localStorage.setItem(
          "cacheRefreshTimestamp",
          refreshTimestamp.toString(),
        );

        // Fetch fresh data safely
        try {
          await Promise.all([
            dispatch("fetchAndCacheData"),
            dispatch("fetchAndCacheFullArticle"),
            dispatch("fetchAndCacheGlossaryArticles"),
            dispatch("fetchOverview"),
          ]);
        } catch (err) {
          console.warn(
            "Daily cache refresh failed partially or completely:",
            err,
          );
          // Return false or handle gracefully
        }

        return true;
      }

      return false;
    },
    async fetchAndCacheFullArticle({ commit, state }) {
      const cacheExpiration = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      if (
        state.cachedFullArticle &&
        state.fullArticleLastUpdate &&
        now - state.fullArticleLastUpdate < cacheExpiration
      ) {
        return state.cachedFullArticle;
      }

      try {
        const response = await fetch(
          "https://gvd.research-stage.artsci.wustl.edu/admin/jsonapi/node/article/dd2d259c-2b32-48ac-adf0-3234b31fb894",
        );
        if (!response.ok) throw new Error("Failed to fetch full article");

        const data = await response.json();
        const fullArticle = {
          body: data.data.attributes.body.value,
        };

        commit("SET_CACHED_FULL_ARTICLE", fullArticle);
        commit("SET_FULL_ARTICLE_LAST_UPDATE", now);

        localStorage.setItem("cachedFullArticle", JSON.stringify(fullArticle));
        localStorage.setItem("fullArticleLastUpdate", now.toString());

        return fullArticle;
      } catch (error) {
        console.error("Error fetching and caching full article:", error);
        throw error;
      }
    },

    loadCachedFullArticle({ commit }) {
      const cachedFullArticle = JSON.parse(
        localStorage.getItem("cachedFullArticle"),
      );
      const fullArticleLastUpdate = localStorage.getItem(
        "fullArticleLastUpdate",
      );

      if (cachedFullArticle)
        commit("SET_CACHED_FULL_ARTICLE", cachedFullArticle);
      if (fullArticleLastUpdate)
        commit("SET_FULL_ARTICLE_LAST_UPDATE", parseInt(fullArticleLastUpdate));
    },
    async fetchAndCacheGlossaryArticles({ commit, state }) {
      const cacheExpiration = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      if (
        state.cachedGlossaryArticles?.length > 0 &&
        state.glossaryLastUpdate &&
        now - state.glossaryLastUpdate < cacheExpiration
      ) {
        return state.cachedGlossaryArticles;
      }

      try {
        const response = await fetch(
          `https://gvd.research-stage.artsci.wustl.edu/admin/jsonapi/node/article?filter[field_tags.name]=Glossary`,
          {
            headers: { Accept: "application/vnd.api+json" },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch glossary articles");

        const data = await response.json();
        const articles = data.data;

        commit("SET_CACHED_GLOSSARY_ARTICLES", articles);
        commit("SET_GLOSSARY_LAST_UPDATE", now);

        localStorage.setItem(
          "cachedGlossaryArticles",
          JSON.stringify(articles),
        );
        localStorage.setItem("glossaryLastUpdate", now.toString());

        return articles;
      } catch (error) {
        console.error("Error fetching and caching glossary articles:", error);
        throw error;
      }
    },

    loadCachedGlossaryArticles({ commit }) {
      const cachedGlossaryArticles = JSON.parse(
        localStorage.getItem("cachedGlossaryArticles"),
      );
      const glossaryLastUpdate = localStorage.getItem("glossaryLastUpdate");

      if (cachedGlossaryArticles)
        commit("SET_CACHED_GLOSSARY_ARTICLES", cachedGlossaryArticles);
      if (glossaryLastUpdate)
        commit("SET_GLOSSARY_LAST_UPDATE", parseInt(glossaryLastUpdate));
    },
    updateQuery({ commit, dispatch }, query) {
      const fullQuery = {
        status: "active",
        tags: [],
        querytext: "",
        journalSearch: "",
        journalSearches: [],
        ...query,
      };
      commit("SET_QUERY", fullQuery);
      dispatch("getQueryResults");
    },
    setQueryText({ commit }, text) {
      commit("SET_QUERY_TEXT", text);
    },
    addMultipleTags({ commit }, tags) {
      tags.forEach((tag) => commit("ADD_TAG", tag));
      this.dispatch("getQueryResults");
    },
    removeMultipleTags({ commit }, tags) {
      tags.forEach((tag) => commit("REMOVE_TAG", tag.tagname));
      this.dispatch("getQueryResults");
    },
    async fetchContributors({ commit }) {
      commit("SET_CONTRIBUTORS_LOADING", true);
      commit("SET_CONTRIBUTORS_ERROR", null);

      const apiUrl = `https://gvd.research-stage.artsci.wustl.edu/admin/jsonapi/node/article?filter[field_tags.name]=Contributors`;

      try {
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/vnd.api+json" },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch contributors: ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (data.data.length === 0) {
          throw new Error("No Contributors article found.");
        }

        const contributorsArticle = data.data[0];
        const bodyContent = contributorsArticle.attributes.body.processed;

        const parser = new DOMParser();
        const doc = parser.parseFromString(bodyContent, "text/html");
        const listItems = doc.querySelectorAll("li");

        const contributors = Array.from(listItems).map((li) => ({
          id: li.textContent.trim(),
          attributes: {
            title: li.textContent.trim(),
          },
        }));

        commit("SET_CONTRIBUTORS", contributors);
      } catch (error) {
        commit("SET_CONTRIBUTORS_ERROR", error.message);
        console.error("Error fetching contributors:", error);
      } finally {
        commit("SET_CONTRIBUTORS_LOADING", false);
      }
    },
    async fetchOverview({ commit, state }) {
      const cacheExpiration = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      if (
        state.cachedOverview &&
        state.overviewLastUpdate &&
        now - state.overviewLastUpdate < cacheExpiration
      ) {
        commit("SET_OVERVIEW", state.cachedOverview);
        return;
      }

      commit("SET_OVERVIEW_LOADING", true);
      commit("SET_OVERVIEW_ERROR", null);

      const apiUrl = `https://gvd.research-stage.artsci.wustl.edu/admin/jsonapi/node/article?filter[field_tags.name]=Overview`;

      try {
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/vnd.api+json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch overview: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.data.length === 0) {
          throw new Error("No Overview article found.");
        }

        const overviewArticle = data.data[0];
        const bodyContent = overviewArticle.attributes.body.processed;

        commit("SET_OVERVIEW", bodyContent);

        commit("SET_CACHED_OVERVIEW", bodyContent);
        commit("SET_OVERVIEW_LAST_UPDATE", now);

        localStorage.setItem("cachedOverview", JSON.stringify(bodyContent));
        localStorage.setItem("overviewLastUpdate", now.toString());
      } catch (error) {
        commit("SET_OVERVIEW_ERROR", error.message);
        console.error("Error fetching overview:", error);
      } finally {
        commit("SET_OVERVIEW_LOADING", false);
      }
    },
    loadCachedOverview({ commit }) {
      const cachedOverview = JSON.parse(localStorage.getItem("cachedOverview"));
      const overviewLastUpdate = localStorage.getItem("overviewLastUpdate");

      if (cachedOverview) {
        commit("SET_OVERVIEW", cachedOverview);
        commit("SET_CACHED_OVERVIEW", cachedOverview);
      }

      if (overviewLastUpdate) {
        commit("SET_OVERVIEW_LAST_UPDATE", parseInt(overviewLastUpdate));
      }
    },
    async fetchJournalSuggestions(context, searchTerm) {
      try {
        // Original approach but with all documents
        const base = `${SOLR_BASE}/select?wt=json&q=`;

        // Get all publications to extract journal titles
        const corequery = encodeURIComponent("*");
        const facetstring =
          "&facet.field=tags&facet.limit=-1&facet=on&json.nl=map";
        const sortstring = "&sort=parsedDate desc";
        const startstring = "&start=0";
        const limitstring = "&rows=50000";
        const flstring = "&fl=publicationTitle";

        const queryUrl =
          base +
          corequery +
          facetstring +
          sortstring +
          startstring +
          limitstring +
          flstring;

        const response = await fetch(queryUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract unique journal titles from documents
        const docs = data.response?.docs || [];
        const uniqueJournals = new Set();

        docs.forEach((doc) => {
          if (
            doc.publicationTitle &&
            typeof doc.publicationTitle === "string"
          ) {
            uniqueJournals.add(doc.publicationTitle.trim());
          } else if (Array.isArray(doc.publicationTitle)) {
            // Handle array of titles
            doc.publicationTitle.forEach((title) => {
              if (typeof title === "string") {
                uniqueJournals.add(title.trim());
              }
            });
          }
        });

        const allJournals = Array.from(uniqueJournals).filter(
          (title) => title.length > 0,
        );

        // Filter journals that match the search term
        const searchTermLower = searchTerm.toLowerCase();
        const matchingJournals = allJournals.filter((journal) =>
          journal.toLowerCase().includes(searchTermLower),
        );

        return matchingJournals.slice(0, 10);
      } catch (error) {
        console.error("Error fetching journal suggestions:", error);
        return [];
      }
    },
  },
  computed: {
    hasBookmarks() {
      return this.$store.getters.isBookmarked.length > 0;
    },
  },

  strict: process.env.NODE_ENV !== "production",
});

export default store;
