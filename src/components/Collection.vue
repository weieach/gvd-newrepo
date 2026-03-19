<template>
  <li>
    <span v-on:click="toggleCollapsed">{{ collection[1].name }}</span>
    <ul v-show="!collapsed">
      <collection
        v-for="coll in collection[1].children"
        v-bind:collection="coll"
        v-bind:key="coll[1].key"
      >
      </collection>
    </ul>
  </li>
</template>
<script>
export default {
  name: "collection",
  data: function () {
    return {
      collapsed: true
    };
  },
  methods: {
    toggleCollapsed: function () {
      this.collapsed = !this.collapsed;
    }
  },
  props: ["collection"]
};
</script>
<style scoped>
ul {
  list-style-type: none;
  padding: 2px 0 2px 1em;
}
li {
  line-height: 1em;
}
</style>
