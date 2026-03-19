/* global _ */
import "../../public/static/lodash.min.js";
import { SOLR_BASE } from "../../config/config";

// export default function makequery (query, querystart = 0) {
//     /* Takes an internal query object and returns a SOLR query string;
//        the query object is a list of lists, where the first level
//        is a list of OrQueries that are to be logically AND-ed,
//        and each OrQuery is a list of tags that are to be OR-ed.
//        (Unless we decide we prefer to go back to the original way,
//        which was low-level AndQueries that would be OR-ed at the top level.)
//      */
//     const protocol = process.env.protocol ? process.env.protocol : "https";
//     const host = process.env.host;
//     const path = process.env.path;
//     const base = `${protocol}://${host}/${path}/select?wt=json&q=`;
//     const facetstring = "&facet.field=tags&facet.limit=-1" +
//           "&facet=on&json.nl=map";
//     // const orset = makeOrSet(query);
//     const corequery = makecorequery(query);
//     const sortstring = `&sort=${state.currentSort}`;
//     // const sortstring = "&sort=parsedDate+desc,shortTitle+asc";
//     const startstring = `&start=${querystart}`;
//     const limitstring = "&rows=10";
//     const qry = base + corequery + facetstring + sortstring + startstring + limitstring;
//     return qry;
// };

export default function makequery(
  query,
  querystart = 0,
  currentSort = "parsedDate desc",
  pageSize = 50
) {
  const base = `${SOLR_BASE}/select?wt=json&q=`;
  const facetstring = "&facet.field=tags&facet.field=publicationTitle_str&facet.limit=-1&facet=on&json.nl=map";
  const corequery = makecorequery(query);
  const sortstring = `&sort=${currentSort}`;
  const startstring = `&start=${querystart}`;
  const limitstring = `&rows=${pageSize}`;
  const qry =
    base + corequery + facetstring + sortstring + startstring + limitstring;
  return qry;
}

function makeAndSet(andblock) {
  const hastags = andblock.tags.length > 0;
  const hastext = andblock.querytext > "";

  let queryParts = [];

  if (hastext) {
    queryParts.push(andblock.querytext);
  }

  if (hastags) {
    let andlist = _.join(_.map(andblock.tags, "tagname"), " AND ");
    if (andblock.tags.length > 1) {
      andlist = `(${andlist})`;
    }
    queryParts.push(`tags:${andlist}`);
  }

  const finalQuery = queryParts.length > 0 ? queryParts.join(" AND ") : "*";

  return encodeURIComponent(finalQuery);
}

function makeOrSet(andblock) {
  const hastags = andblock.tags.length > 0;
  const hastext = andblock.querytext > "";

  let queryParts = [];

  if (hastext) {
    queryParts.push(andblock.querytext);
  }

  if (hastags) {
    let andlist = _.join(_.map(andblock.tags, "tagname"), " AND ");
    if (andblock.tags.length > 1) {
      andlist = `(${andlist})`;
    }
    queryParts.push(`tags:${andlist}`);
  }

  const finalQuery = queryParts.length > 0 ? queryParts.join(" AND ") : "*";

  return encodeURIComponent(finalQuery);
}

// function makecorequery(query) {
//   if (query.tags.length === 0 && query.querytext === "") {
//     return "*";
//   } else {
//     return makeAndSet(query);
//   }
// }

// function makeOrSet (queries) {
//     const nonemptyqueries = _.filter(queries,
//                                      x => (x.tags && x.tags.length > 0) || (x.querytext > ""));
//     if (nonemptyqueries.length === 0) {
//         return "*";
//     };
//     if (nonemptyqueries.length === 1) {
//         return _.join(
//             _.map(nonemptyqueries, makeAndSet), " OR ");
//     };
//     return "(" + _.join(
//         _.map(nonemptyqueries, makeAndSet), ") OR (") + ")";
// };

function makecorequery(query, combineMode = "AND") {
  if (query.tags.length === 0 && query.querytext === "") {
    return "*";
  } else {
    return combineMode === "AND" ? makeAndSet(query) : makeOrSet(query);
  }
}
