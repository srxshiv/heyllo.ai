import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const user = await getCurrentUser();
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  if (!feedback) {
    return <div className="p-6 text-gray-400">No feedback available yet.</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">Interview Feedback</h1>

      {/* Total Score */}
      <div className="mb-6">
        <p className="text-lg font-medium">Total Score: <span className="font-bold text-yellow-400">{feedback.totalScore}</span></p>
      </div>

      {/* Category Scores */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Category Scores</h2>
        <div className="space-y-4">
          {feedback.categoryScores.map((category, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded border border-gray-700">
              <p className="font-semibold text-lg text-purple-300">{category.name}</p>
              <p><strong>Score:</strong> <span className="text-yellow-400">{category.score}</span></p>
              <p><strong>Comment:</strong> {category.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Strengths</h2>
        <ul className="list-disc list-inside space-y-1 text-green-400">
          {feedback.strengths.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Areas for Improvement</h2>
        <ul className="list-disc list-inside space-y-1 text-red-400">
          {feedback.areasForImprovement.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Final Assessment */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Final Assessment</h2>
        <p className="text-gray-300">{feedback.finalAssessment}</p>
      </div>

      {/* Date */}
      <div className="text-sm text-gray-500 mt-4">
        <p>Generated on: {new Date(feedback.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Page;
