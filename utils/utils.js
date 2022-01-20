module.exports.jsonToCSV = (obj) => {
  const replacer = (key, value) =>
    value === null || typeof value === "undefined" ? "" : value;
  const header = Object.keys(obj[0]);
  const csv = [
    header.join(","),
    ...obj.map((row) =>
      header
        .map((fieldName) => {
          if (Array.isArray(row[fieldName]))
            return `"${row[fieldName].join(",")}"`;
          if (typeof row[fieldName] === "string")
            return `"${row[fieldName].split('"').join('""')}"`;
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(",")
    ),
  ].join("\r\n");

  return csv;
};
