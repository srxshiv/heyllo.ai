import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";

const InterviewCard = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const feedback = userId && id ? await getFeedbackByInterviewId({interviewId: id, userId}) : null;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("DD/MM/YYYY");

  return (
    <div className="w-full h-full bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          {/* Type Badge */}
          <div className="absolute top-0 right-0 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-bl-xl">
            <p className="text-xs font-medium text-indigo-600">{normalizedType}</p>
          </div>

          {/* Card Content */}
          <h3 className="text-xl font-medium text-gray-800 mt-2 capitalize">
            {role} Interview
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-5 mt-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="opacity-70"
              />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image 
                src="/star.svg" 
                alt="star" 
                width={18} 
                height={18}
                className="opacity-70"
              />
              <span className="text-sm">
                {feedback?.totalScore || "---"}/100
              </span>
            </div>
          </div>

          {/* Feedback Preview */}
          <p className="mt-4 text-gray-600 line-clamp-2 text-sm">
            {feedback?.finalAssessment || "No feedback yet"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          {/* Tech Stack */}
          <div className="flex">
            {techstack.map((tech, index) => (
              <div 
                key={index} 
                className={cn(
                  "bg-white/80 backdrop-blur-sm group relative rounded-full p-2 flex-center shadow-xs",
                  index >= 1 && "-ml-3"
                )}
              >
                <span className="group-hover:opacity-100">
                  {tech}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button 
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all"
          >
            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
              {feedback ? "View Feedback" : "Continue"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;