export const calculateATSScore = (jdKeywords, resumeKeywords) => {
  if (!jdKeywords || jdKeywords.length === 0) return 0;
  const uniqueJD = [...new Set(jdKeywords)];
  const matches = uniqueJD.filter((k) =>
    resumeKeywords.includes(k)
  );
  return Math.round((matches.length / uniqueJD.length) * 100);
};
