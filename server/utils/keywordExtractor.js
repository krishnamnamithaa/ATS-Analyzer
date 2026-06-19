export const extractKeywords = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .match(/\b[a-z]{3,}\b/g) || [];
};
