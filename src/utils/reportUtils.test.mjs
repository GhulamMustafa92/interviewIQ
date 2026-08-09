import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReportData } from './reportUtils.js';

test('buildReportData calculates overall and metric averages', () => {
  const report = {
    finalScore: 8.5,
    questionwiseScore: [
      { score: 8, scoreDetails: { confidence: 7, communication: 8, correctness: 9 } },
      { score: 9, scoreDetails: { confidence: 8, communication: 9, correctness: 8 } }
    ]
  };

  const result = buildReportData(report);

  assert.equal(result.overallScore, 8.5);
  assert.deepEqual(result.metrics, {
    confidence: 7.5,
    communication: 8.5,
    correctness: 8.5
  });
});
