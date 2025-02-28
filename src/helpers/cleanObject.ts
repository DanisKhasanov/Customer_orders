export const CleanObject = (obj) => {
  const cleaned = {};
  for (const key in obj) {
    if (
      obj[key] !== "" &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      !(Array.isArray(obj[key]) && obj[key].length === 0)
    ) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        const cleanedNested = CleanObject(obj[key]);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = obj[key];
      }
    }
  }
  return cleaned;
};
