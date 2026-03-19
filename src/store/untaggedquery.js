import { SOLR_BASE } from "../../config/config";

export default function untaggedquery() {
  const base = `${SOLR_BASE}/select?wt=json`;
  const tagless = '&q=(NOT tags:["" TO *])';
  const flstring =
    "&fl=key,version,createdByUser_username,parsedDate,itemType,title,collections,publicationTitle,journalAbbreviation,volume,issue,pages,DOI,shortTitle,url";
  const extentstring = "&start=0&rows=10000";
  return base + tagless + extentstring + flstring;
}
