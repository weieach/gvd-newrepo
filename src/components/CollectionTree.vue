<template>
  <div>
    <h2>Collection view</h2>
    <ul>
      <collection
        v-for="coll in collectiontree"
        v-bind:collection="coll"
        v-bind:key="coll[1].key"
      >
      </collection>
    </ul>
  </div>
</template>
<script>
import Collection from "./Collection.vue";
export default {
  name: "collection-tree",
  data() {
    return { collectiontree: this.$store.state.collectiontree };
  },
  components: { Collection }
};
</script>
<style scoped>
ul {
  list-style-type: none;
}
</style>
