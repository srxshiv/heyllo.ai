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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50/20 to-blue-50/20">
        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm text-center">
          <p className="text-gray-600">No feedback available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/20 to-blue-50/20 p-6">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Interview Feedback</h1>
          <div className="flex items-center justify-between mt-4">
            <p className="text-lg">
              <span className="font-medium">Role:</span> {interview.role}
            </p>
            <div className="text-xl font-bold bg-white/20 px-4 py-1 rounded-full">
              {feedback.totalScore}/100
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Category Scores */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Performance Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.categoryScores.map((category, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/20"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-indigo-600">{category.name}</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                      {category.score}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">{category.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50/50 p-4 rounded-xl">
              <h2 className="text-lg font-semibold mb-3 text-green-800">Strengths</h2>
              <ul className="space-y-2">
                {feedback.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50/50 p-4 rounded-xl">
              <h2 className="text-lg font-semibold mb-3 text-orange-800">Areas for Improvement</h2>
              <ul className="space-y-2">
                {feedback.areasForImprovement.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="bg-orange-100 p-1 rounded-full mr-2 mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Final Assessment */}
          <div className="bg-blue-50/50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-3 text-blue-800">Final Assessment</h2>
            <p className="text-gray-700">{feedback.finalAssessment}</p>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200/50">
            <p>Feedback generated on {new Date(feedback.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;