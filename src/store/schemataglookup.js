import "../../public/static/lodash.min.js";
/* global _ */

export default function schemataglookup(obj, node) {
  if (node && "tagname" in node && node.tagname) {
    obj[node["tagname"]] = {
      label: node["label"],
      notes: node["notes"]
    };
  }
  if (node && "children" in node && node.children.length > 0) {
    obj = _.reduce(node.children, schemataglookup, obj);
  }
  return obj;
}
