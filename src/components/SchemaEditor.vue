<template>
  <div id="schemaeditor">
    <div v-if="!schema" class="loading-state">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading schema...</span>
        </div>
        <p class="mt-2">Loading schema editor...</p>
      </div>
    </div>
    <ul v-else>
      <schema-node
        v-for="node in schema?.children || []"
        v-bind:node="node"
        v-bind:key="node.label"
      ></schema-node>
    </ul>
  </div>
</template>

<script>
import SchemaNode from "./SchemaNode.vue";

export default {
  name: "schema-editor",
  computed: {
    schema() {
      return this.$store.state.schema;
    },
  },
  created() {
    if (!this.$store.state.schemaLoaded && !this.$store.state.schema) {
      this.$store.dispatch("loadSchema");
    }
  },
  components: {
    SchemaNode,
  },
};
</script>

<style>
#schemaeditor {
  width: 500px;
}
ul {
  list-style-type: none;
}
.loading-state {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}
.loading-state .spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
