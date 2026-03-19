export default function MakeJournalQuery() {
  const protocol = process.env.protocol ? process.env.protocol : "https";
  const host = process.env.host;
  const path = process.env.path;
  const journalquery = `${protocol}://${host}/${path}/select?wt=json&facet.field=container_title&facet=on&q=*%3A*&rows=0&start=0&facet.pivot.mincount=1&facet.pivot=container_title,parsedDate&facet.sort=index&facet.limit=-1`;
  return journalquery;
}

