<template>
  <div class="result-list">
    <ul class="result-items">
      <result
        v-for="(doc, index) in docs"
        :key="doc.id"
        :doc="doc"
        :index="index"
        :collapsed="$store.state.allCollapsed"
      />
    </ul>
  </div>
</template>

<script>
import Result from "./Result.vue";

export default {
  name: "ResultList",
  components: { Result },
  computed: {
    querystring() {
      return this.$store.getters.querystring;
    },
    numfound() {
      return this.$store.getters.hasresponse
        ? this.$store.state.queryresponse.body.response.numFound
        : null;
    },
    docs() {
      return this.$store.getters.hasresponse
        ? this.$store.state.queryresponse.body.response.docs
        : [];
    },
  },
};
</script>

<style scoped>
.result-list {
  width: 100%;
}

.result-items {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
</style>
