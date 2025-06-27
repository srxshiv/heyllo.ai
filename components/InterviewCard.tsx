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
  const feedback = userId && id ? await getFeedbackByInterviewId({interviewId : id , userId}) : null ;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("DD/MM/YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 px-4 py-2 w-fit rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar logo"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>
            <div className="flex flex-row gap-2">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"} /100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment || "No feedback yet"}
          </p>
        </div>
        <div className="flex flex-row justify-between">
        <div className="flex flex-row">
            {techstack.map((tech , index) => (
                <div key={index} className={cn("bg-dark-300 group relative rounded-full p-2 flex-center" , index >=1 && '-ml-3')}>
                    <span className="tech-tooltip">
                        {tech}
                    </span>
                    <Image src="/tech.svg" alt="tech" width={100} height={100} className="size-5"/>
                </div>
            ))}
        </div>
            <Button className="btn-primary">
                <Link href={feedback? `/interview/${id}/feedback` : `/interview/${id}` }>
                {feedback? "Check Feedback" : "View Interview"}
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
