<template>
  <div class="untagged">
    <h2>Untagged</h2>
    <p>{{ numfound.toLocaleString() }} untagged articles</p>

    <ul>
      <li v-for="doc in docs" v-bind:key="doc.key">
        {{ doc.title }} <i>{{ doc.journalAbbreviation }}</i>
        {{ doc.parsedDate }}
        <a
          v-if="'collections' in doc"
          title="link to Zotero"
          v-bind:href="
            'https://www.zotero.org/groups/65640/wu_vaw/collections/' +
            doc.collections[0] +
            '/items/' +
            doc.key +
            '/collection'
          "
          >⬈</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "untagged",
  computed: {
    numfound: function () {
      if (this.$store.getters.hasuntaggedresponse) {
        return this.$store.state.untaggedresponse.body.response.numFound;
      } else {
        return null;
      }
    },
    docs: function () {
      if (this.$store.getters.hasuntaggedresponse) {
        return this.$store.state.untaggedresponse.body.response.docs;
      } else {
        return [];
      }
    }
  },
  beforeCreate: function () {
    this.$store.dispatch("getUntaggedQueryResults");
  }
};
</script>
<style scoped>
.untagged {
  margin: 0 100px 0 100px;
}
ul {
  list-style: none;
  line-height: 1em;
  /* font-size: 10pt; */
  text-indent: -1em;
  padding: 0;
  margin: 0 0 50px 0;
}
li {
  margin: 0.5em 0 0 1em;
}
a {
  text-decoration: none;
}

ul {
}
</style>
