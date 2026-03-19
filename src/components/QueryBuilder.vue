<!-- <template>
  <div>
    <sub-query class="subquery" v-bind:subquery="query"></sub-query>
    <text-search></text-search>
  </div>
</template>
<script>
import TextSearch from "./TextSearch.vue";
// import SubQuery from "./SubQuery.vue";

export default {
  name: "query-builder",
  data() {
    return { query: this.$store.state.query };
  },
  computed: {
    querystring: function () {
      return this.$store.getters.querystring;
    },
    noEmptySubqueries: function () {
      return this.$store.getters.hasEmptySubquery;
    }
  },
  components: { TextSearch }
};
</script> -->
<template>
  <div>
    <sub-query class="subquery" v-bind:subquery="query"></sub-query>
    <text-search></text-search>
  </div>
</template>
<script>
import TextSearch from "./TextSearch.vue";
import { mapState } from "vuex";

export default {
  name: "query-builder",
  computed: {
    ...mapState({
      query: (state) => state.query,
    }),
    querystring() {
      return this.$store.getters.querystring;
    },
    noEmptySubqueries() {
      return this.$store.getters.hasEmptySubquery;
    },
  },
  watch: {
    query: {
      handler(newQuery) {
        this.$store.dispatch("getQueryResults");
      },
      deep: true,
    },
  },
  components: { TextSearch },
};
</script>
<style scoped>
div.querybuilder {
  margin: 10px 0;
  font-size: 14pt;
  display: flex;
  flex-direction: column;
}

div.querybuilder .subquery {
  flex: none;
}

button {
  display: block;
  margin: auto 10px;
  font-size: 8pt;
  font-style: italic;
  flex: none;
  border: none;
}
</style>
