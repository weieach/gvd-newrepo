/* global _ */
import "../../public/static/lodash.min.js";

export default function makequery(query, querystart = 0) {
  /* Takes an internal query object and returns a SOLR query string;
       the query object is a list of lists, where the first level
       is a list of OrQueries that are to be logically AND-ed,
       and each OrQuery is a list of tags that are to be OR-ed.
       (Unless we decide we prefer to go back to the original way,
       which was low-level AndQueries that would be OR-ed at the top level.)
     */
  const protocol = process.env.protocol ? process.env.protocol : "https";
  const host = process.env.host;
  const path = process.env.path;
  const base = `${protocol}://${host}/${path}/select?wt=json&q=`;
  const facetstring =
    "&facet.field=tags&facet.limit=-1" + "&facet=on&json.nl=map";
  const andset = makeAndSet(query);
  const sortstring = "&sort=parsedDate+desc,shortTitle+asc";
  const startstring = `&start=${querystart}`;
  const limitstring = "&rows=50";
  return base + andset + facetstring + sortstring + startstring + limitstring;
}

function makeOrSet(orblock) {
  const hastags = orblock.tags.length > 0;
  const hasboth = (orblock.querytext > "") & hastags;
  let text = encodeURIComponent(orblock.querytext ? orblock.querytext : "");
  let orlist = _.join(_.map(orblock.tags, "tagname"), " OR ");
  if (orblock.tags.length > 1) {
    orlist = `(${orlist})`;
  }
  if (hastags) {
    orlist = `tags:${orlist}`;
  }
  const orstring =
    text + `${hasboth ? " OR " : ""}` + encodeURIComponent(orlist);
  return orstring;
}

function makeAndSet(queries) {
  const nonemptyqueries = _.filter(
    queries,
    (x) => (x.tags.length > 0) | (x.querytext > "")
  );
  if (nonemptyqueries.length === 0) {
    return "*";
  }
  if (nonemptyqueries.length === 1) {
    return _.join(_.map(nonemptyqueries, makeOrSet), " AND ");
  }
  return "(" + _.join(_.map(nonemptyqueries, makeOrSet), ") AND (") + ")";
}
