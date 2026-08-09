export function buildReportData(report = {}) {
  const questionwiseScore = Array.isArray(report.questionwiseScore) ? report.questionwiseScore : [];

  const totals = questionwiseScore.reduce(
    (acc, item) => {
      const details = item?.scoreDetails || item?.details || {};
      acc.confidence += Number(details.confidence || 0);
      acc.communication += Number(details.communication || 0);
      acc.correctness += Number(details.correctness || 0);
      return acc;
    },
    { confidence: 0, communication: 0, correctness: 0 }
  );

  const count = questionwiseScore.length || 1;

  const metrics = {
    confidence: Number((totals.confidence / count).toFixed(1)),
    communication: Number((totals.communication / count).toFixed(1)),
    correctness: Number((totals.correctness / count).toFixed(1))
  };

  return {
    overallScore: Number(Number(report.finalScore || 0).toFixed(1)),
    metrics,
    questionwiseScore,
    summary: questionwiseScore.length
      ? `${questionwiseScore.length} questions evaluated with a balanced review of communication, confidence, and correctness.`
      : 'Interview completed. Review your answers and feedback below.'
  };
}
