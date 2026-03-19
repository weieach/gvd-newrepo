
export default function untaggedquery () {
    const protocol = process.env.protocol ? process.env.protocol : "https";
    const host = process.env.host;
    const path = process.env.path;
    const base = `${protocol}://${host}/${path}/select?wt=json`;
    const tagless = "&q=(NOT tags:[\"\" TO *])";
    const flstring = "&fl=key,version,createdByUser_username,parsedDate,itemType,title,collections,publicationTitle,journalAbbreviation,volume,issue,pages,DOI,shortTitle,url";
    const extentstring = "&start=0&rows=10000";
    return base + tagless + extentstring + flstring;
}
