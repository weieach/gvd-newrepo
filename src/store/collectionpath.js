export default function collectionpath(collections, collid) {
  const coll = collections[collid];
  if (coll && coll.parentCollection) {
    return (
      collectionpath(collections, coll.parentCollection) + " / " + coll.name
    );
  } else {
    return coll.name;
  }
}
