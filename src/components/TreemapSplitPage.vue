<template>
  <div class="pagecomponent">
    <page-header></page-header>
    <div class="content pure-g">
      <query-builder class="pure-u-1-1 querybuilder"></query-builder>
      <div
        class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 pure-u-lg-2-3 pure-u-xl-2-4 treemapwrapper"
      >
        <input type="radio" name="tabs" id="tab_geog" checked />
        <input type="radio" name="tabs" id="tab_pop" />
        <input type="radio" name="tabs" id="tab_issueresponse" />
        <input type="radio" name="tabs" id="tab_src" />
        <nav>
          <label for="tab_geog">Geography</label>
          <label for="tab_pop">Population</label>
          <label for="tab_issueresponse">Issues and Responses</label>
          <label for="tab_src">Source Types</label>
        </nav>
        <treemap
          class="tab_geog"
          v-bind:treemapdata="treemapdata.geog"
        ></treemap>
        <treemap class="tab_pop" v-bind:treemapdata="treemapdata.pop"></treemap>
        <treemap
          class="tab_issueresponse"
          v-bind:treemapdata="treemapdata.issueresponse"
        ></treemap>
        <treemap class="tab_src" v-bind:treemapdata="treemapdata.src"></treemap>
      </div>
      <div
        class="pure-u-1 pure-u-sm-1 pure-u-md-1-2 pure-u-lg-1-3 pure-u-xl-1-3 pure-g resultcolumn"
      >
        <result-counter class="pure-u-1-1 resultcounter"></result-counter>
        <result-list class="pure-u-1-1 results"></result-list>
      </div>
    </div>
    <!-- <page-footer></page-footer> -->
  </div>
</template>
<script>
import QueryBuilder from "./QueryBuilder.vue";
import ResultList from "./ResultList.vue";
import ResultCounter from "./ResultCounter.vue";
import PageHeader from "./PageHeader.vue";
import PageFooter from "./PageFooter.vue";
import Treemap from "./Treemap.vue";

export default {
  name: "treemappage",
  data: function () {
    // console.log(this.$route.query);
    return {
      include_pop: false,
      include_src: false,
      params: this.$route.params,
    };
  },
  computed: {
    treemapdata: function () {
      let treecopy = this.copytree(this.$store.getters.schemacounts);
      let pop = treecopy.children.find((v) => v.label === "Population");
      let geog = this.copytree(
        pop.children.find((v) => v.label === "Geography")
      );
      pop.children = pop.children.filter((v) => v.label !== "Geography");
      let src = treecopy.children.find((v) => v.label === "Source Type");
      let issueresponse = JSON.parse(JSON.stringify(treecopy));
      issueresponse.children = issueresponse.children.filter(
        (v) => v.label !== "Population" && v.label !== "Source Type"
      );
      return {
        geog: geog,
        pop: pop,
        issueresponse: issueresponse,
        src: src,
      };
    },
  },
  methods: {
    copytree: function (treeinput) {
      return JSON.parse(JSON.stringify(treeinput));
    },
  },
  components: {
    PageHeader,
    PageFooter,
    QueryBuilder,
    ResultList,
    ResultCounter,
    Treemap,
  },
};
</script>
<style scoped>
.content {
  padding: 0 5% 5% 5%;
}
.pop,
.src {
  color: #000000;
  background: #cccccc;
}
.nopop,
.nosrc {
  color: #888888;
  background: #aaaaaa;
}
nav label {
  display: inline-block;
  margin: 5px 0 0 0;
  padding: 0px 10px;
}
.treemapwrapper > div {
  padding: 5px 0 0 0;
  background-color: #eeeeee;
}
input {
  display: none;
}
.treemapwrapper,
nav input {
  background-color: #cccccc;
}
#tab_geog:checked ~ nav label[for="tab_geog"] {
  background-color: #eeeeee;
}
#tab_pop:checked ~ nav label[for="tab_pop"] {
  background-color: #eeeeee;
}
#tab_issueresponse:checked ~ nav label[for="tab_issueresponse"] {
  background-color: #eeeeee;
}
#tab_src:checked ~ nav label[for="tab_src"] {
  background-color: #eeeeee;
}

#tab_geog ~ div.tab_geog,
#tab_pop ~ div.tab_pop,
#tab_issueresponse ~ div.tab_issueresponse,
#tab_src ~ div.tab_src {
  display: none;
}

#tab_geog:checked ~ .tab_geog {
  display: block;
}
#tab_pop:checked ~ .tab_pop {
  display: block;
}
#tab_issueresponse:checked ~ .tab_issueresponse {
  display: block;
}
#tab_src:checked ~ .tab_src {
  display: block;
}
</style>
