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

  console.log(interview.questions);
  return (
    <>
      <div className="flex flex=row gap-4 justify-between ">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <h3 className="capitalize">{interview.role}</h3>
          </div>
          <div className="flex flex-row">
            {interview.techstack.map((tech, index) => (
              <div
                key={index}
                className={cn(
                  "bg-dark-300 group relative rounded-full p-2 flex-center",
                  index >= 1 && "-ml-3"
                )}
              >
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
          {interview.type}
        </p>
      </div>
      <Agent
        userName={user?.name || ""}
        userId={user?.id || ""}
        type="interview"
        interviewId={id}
        questions={interview.questions}
      />
    </>
  );
};

export default Page;
