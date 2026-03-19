<template>
  <div class="pagecomponent">
    <page-header></page-header>
    <div class="pure-u-1-3"></div>
    <div class="pure-u-1-3">
      <h2>Dashboard</h2>
      <div class="dash-body">
        <ul>
          <li>
            <router-link to="/journals">Journals</router-link>
          </li>
          <li>
            <router-link to="/untagged">Untagged articles</router-link>
          </li>
        </ul>
        <!-- <collection-tree></collection-tree> -->
        <!--
        <untagged></untagged>
        -->
      </div>
    </div>
  </div>
  <!-- <page-footer></page-footer> -->
</template>
<script>
import PageHeader from "./PageHeader.vue";
import PageFooter from "./PageFooter.vue";
// import Untagged from "./Untagged.vue";
// import CollectionTree from "./CollectionTree.vue";
export default {
  name: "dashboard",
  components: { PageHeader, PageFooter },
};
</script>
<style>
.dash-body {
  padding: 10px 0 40px;
}
</style>
