/* global _ */
import "../../public/static/lodash.min.js";

export default function flattentags(schema) {
  if (!schema || !schema.children) {
    return [];
  }
  return _.flatten(_.map(schema.children, node2nodelist));
}

function node2nodelist(node) {
  var l = [
    {
      id: node.id,
      tagname: node.tagname,
      label: node.label,
    },
  ];
  if (node.children && node.children.length > 0) {
    l = _.flatten(l.concat(_.map(node.children, node2nodelist)));
  }
  return l;
}
