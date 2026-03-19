import "../../public/static/lodash.min.js";
/* global _ */

function addchildren(coll, parentgroups) {
  coll[1]["key"] = coll[0];
  let children = _.sortBy(parentgroups[coll[0]], (c) => c[1].name);
  _.each(children, (c) => addchildren(c, parentgroups));
  coll[1]["children"] = children;
  return coll;
}

export default function collectiontree(collections) {
  const parentGroups = _.groupBy(
    _.entries(collections),
    (c) => c[1]["parentCollection"]
  );
  let folders = _.chain(collections)
    .entries()
    .filter((e) => e[1]["parentCollection"] === false)
    .sortBy((f) => f[1].name)
    .value();

  _.map(folders, (c) => addchildren(c, parentGroups));
  return folders;
}
