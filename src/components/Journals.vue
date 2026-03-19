<template>
  <div id="journals" class="journals">
    <page-header></page-header>
    <div class="content pure-g">
      <div class="pure-u-1">
        <h2>Journals</h2>
        <h3>{{by_issue && "By issue" || "By year"}} <button @click="toggle">{{by_issue && "(show by year)" || "(show by issue)"}}</button></h3>
        <ul>
          <li v-for="journal, j in journalpivot">
            {{j}} <b> {{journal["value"]}} ({{journal["count"].toLocaleString()}})</b>
            
            <svg v-if="by_issue" v-bind:viewBox ="viewbox(journal['pivot'])" width="1200" height="200"">
              <g v-for="issue, i in sortIssues(journal['pivot'])">
                <title>{{issue['value']}}  ({{issue['count']}})</title>
                <rect width="1" 
                      fill="#8080F0"
                      v-bind:height="issue['count']" 
                      v-bind:x="1.3*i" 
                      v-bind:y="3 + maxIssueCount(journal['pivot']) - issue['count']"
                      />
              </g>
            </svg>
            <svg v-else viewBox="0 0 800 200" width="1000" height="250">
              <g v-for="year in yearsequence">
                <title>{{year}} {{maxYearCount(journal, year)}}</title>
                <rect width="19" 
                      fill="#8080F0"
                      v-bind:height="countByYear(journal, year)[year]" 
                      v-bind:x="(year - 1986) * 20" 
                      v-bind:y="3 + maxYearCount(journal, year) - 
                                countByYear(journal, year)[year]"
                      />
                <text v-if="year % 10 === 0"
                  v-bind:x="0" 
                  font-size="70%"
                  stroke="#A0A0A0"
                  fill="#FF0000"
                  v-bind:transform="'rotate(90) translate(' + 
                                    parseInt(10 + maxYearCount(journal, year))
                                    + ', ' + parseInt(-3 + (year - 1986) * -20) + ')'"
                  y="0">{{year}}</text>
                  <!-- y="30 + maxYearCount(journal, year)">{{year}}</text> -->
              </g>
            </svg>

            <!-- <p v-else>{{countByYear(journal['pivot'])}} -->
            <!-- </p> -->
          </li>
        </ul>
      </div>
    </div>
</div>
<!-- <page-footer></page-footer> -->
</template>

<script>
 
/* global _ */
import "../../public/static/lodash.min.js";

import PageHeader from "./PageHeader.vue";
import PageFooter from "./PageFooter.vue";

export default {
    name: "Journals",
    data: function () {
        return {
            by_issue: false
        };
    },
    computed: {
        journalcounts: function () {
            if ("body" in this.$store.state.journals) {
                let jlist = this.$store.state.journals
                    .body.facet_counts.facet_fields.container_title;
                return _.chunk(jlist, 2);
            } else {
                return [];
            }
        },
        journalpivot: function () {
            if ("body" in this.$store.state.journals) {
                let jlist = this.$store.state.journals.body.facet_counts
                    .facet_pivot["container_title,parsedDate"];
                return jlist;
            } else {
                return [];
            }
        },
        yearsequence: function () {
            return _.map([...Array(37).keys()], v => v + 1986);
        }

    },
    methods: {
        toggle: function () {
            this.by_issue = !this.by_issue;
        },
        sortIssues: function (issues) {
            return _.sortBy(issues, v => v["value"]);
        },
        maxIssueCount: function (issues) {
            return _.defaultTo(_.max(_.map(issues, "count")), 0);
        },
        viewbox: function (issues) {
            let maxcount = this.maxIssueCount(issues);
            let vbox = `0 0 400 ${maxcount + 6}`;
            return vbox;
        },
        countByYear: function (journal, year) {
            if (!("pivot" in journal)) {
                return {};
            }
            let issues = journal["pivot"];
            let yearCountPairs = _.map(issues, v =>
                                       [v["value"].slice(0, 4), v["count"]]);
            let obj = _.fromPairs(yearCountPairs);
            return obj;
        },
        maxYearCount: function (journal, year) {
            // if (!(("pivot" in journal) && (year in journal["pivot"]))) {
                // return 0;
            // }
            let yearCounts = this.countByYear(journal, year);
            return _.max(_.values(yearCounts));
        }
    },
    components: {
        PageHeader,
        PageFooter
    },
    beforeCreate: function () {
        this.$store.dispatch("loadJournals");
    },
    mounted: function () {
        window.setTimeout(v => console.log(
            this.$store.state.journals.body.facet_counts.facet_pivot["container_title,parsedDate"]),
                          1000);
    }
};
</script>

<style>
.content {
   /* margin-left: 20px; */
}
ul {
   list-style-type: none;
}


svg {
    display: block;
    /* margin: 10px 0; */
}
</style>
