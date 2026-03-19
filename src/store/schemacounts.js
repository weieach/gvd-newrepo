/*  modifies schema to add schema counts
 */
export default function schemacounter(node, tagfacets) {
  //    let n = JSON.parse(JSON.stringify(nnode));
  if (!node) {
    return null;
  }

  if (node.children && node.children.length > 0) {
    node.value = 0;
    for (let i = 0; i < node.children.length; i++) {
      node.children[i] = schemacounter(node.children[i], tagfacets);
    }
  } else {
    if (node.tagname in tagfacets) {
      node.value = tagfacets[node.tagname];
    } else {
      node.value = 0;
    }
  }
  return JSON.parse(JSON.stringify(node));
}
