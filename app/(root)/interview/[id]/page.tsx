import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import { Agent } from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";

const Page = async ({ params }: { params: { id: string } }) => {
  const id = await params.id;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/20 to-blue-50/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Interview Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <h3 className="text-xl font-medium text-gray-800 capitalize">
              {interview.role} Interview
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {interview.techstack.map((tech, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-xs",
                    "flex items-center gap-1.5"
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500/80"></span>
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-2 bg-indigo-500/10 rounded-lg text-indigo-700 text-sm font-medium capitalize">
            {interview.type}
          </div>
        </div>

        {/* Agent Component */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6">
          <Agent
            userName={user?.name || ""}
            userId={user?.id || ""}
            type="interview"
            interviewId={id}
            questions={interview.questions}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;