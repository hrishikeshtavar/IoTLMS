'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type QuestionOption = {
  value: string;
  label: string;
};

type Question = {
  id: string;
  question_text: string;
  options_json: QuestionOption[];
};

type Assessment = {
  questions: Question[];
  pass_score: number;
};

type QuestionResult = {
  is_correct: boolean;
  correct_answer: string;
  points_earned: number;
};

type QuizResult = {
  passed: boolean;
  score: number;
  max_score: number;
  percentage: number;
  pass_score: number;
  results: QuestionResult[];
};

export default function QuizPage() {
  const { assessmentId } = useParams();
  const assessmentIdParam = Array.isArray(assessmentId) ? assessmentId[0] : assessmentId;
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    if (!assessmentIdParam) return;
    fetch(`http://localhost:3001/api/assessments/${assessmentIdParam}`)
      .then(r => r.json())
      .then((data: Assessment) => { setAssessment(data); setLoading(false); });
  }, [assessmentIdParam]);

  const selectAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    const res = await fetch('http://localhost:3001/api/assessments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'student-1',
        assessment_id: assessmentIdParam,
        answers: Object.entries(answers).map(([question_id, answer]) => ({
          question_id,
          answer,
        })),
      }),
    });
    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>;
  if (!assessment) return <div className="min-h-screen flex items-center justify-center">Quiz not found</div>;

  const questions = assessment.questions ?? [];
  const question = questions[currentQ];
  const allAnswered = questions.every((q) => Boolean(answers[q.id]));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-blue-600 text-sm hover:underline">
          ← Back
        </button>
        <h1 className="text-lg font-bold text-blue-600">IoTLearn Quiz</h1>
        <span className="text-sm text-gray-500">
          {Object.keys(answers).length}/{questions.length} answered
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {result ? (
          /* Results Screen */
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="text-6xl mb-4">{result.passed ? '🎉' : '😔'}</div>
            <h2 className="text-2xl font-bold mb-2">
              {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h2>
            <p className="text-gray-500 mb-6">
              You scored {result.score}/{result.max_score} ({result.percentage}%)
            </p>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-8 ${
              result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {result.passed ? '✅ Passed' : `❌ Need ${result.pass_score} to pass`}
            </div>

            {/* Question Results */}
            <div className="text-left space-y-3 mb-8">
              {result.results.map((r, i) => (
                <div key={i} className={`p-3 rounded-lg flex items-center gap-3 ${
                  r.is_correct ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <span>{r.is_correct ? '✅' : '❌'}</span>
                  <span className="text-sm text-gray-700">
                    Q{i + 1}: {r.is_correct ? 'Correct' : `Wrong — answer was "${r.correct_answer}"`}
                  </span>
                  <span className="ml-auto text-sm font-medium">
                    +{r.points_earned} pts
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              Back to Lesson
            </button>
          </div>
        ) : (
          /* Quiz Screen */
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>{assessment.pass_score} pts to pass</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {question && (
              <div className="bg-white rounded-xl border p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  {question.question_text}
                </h2>
                <div className="space-y-3">
                  {(question.options_json ?? []).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(question.id, opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                        answers[question.id] === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium mr-3">{opt.value}.</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm disabled:opacity-50"
              >
                ← Previous
              </button>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(q => q + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  disabled={!allAnswered || submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz ✓'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
