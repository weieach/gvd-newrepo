import { SOLR_BASE } from "../../config/config";

export default function MakeJournalQuery() {
  return `${SOLR_BASE}/select?wt=json&facet.field=container_title&facet=on&q=*%3A*&rows=0&start=0&facet.pivot.mincount=1&facet.pivot=container_title,parsedDate&facet.sort=index&facet.limit=-1`;
}

