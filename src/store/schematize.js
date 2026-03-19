/*  modifies schema so that tags that also have children
    have a reified "general" child added at the end of their
    list of children.
*/
export default function schematize (node) {
    if (!("children" in node)) {
        node["children"] = [];
    }
    if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            node.children[i] = schematize(node.children[i]);
        }
    }
    if (("tagname" in node) && (node.tagname > "") &&
        (node.children.length > 0)) {
        let newchild = {"label": node.label + " [general]",
                        "tagname": node.tagname,
                        "notes": node.notes,
                        "children": []};
        node.tag_id = "";
        node.notes = "";
        node.children.push(newchild);
    }
    return node;
}
