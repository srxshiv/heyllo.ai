import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  const [interviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-8 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm">
        {/* Image moved to left */}
        <div className="lg:order-first">
          <Image
            src="/robot.png"
            alt="AI Interview Assistant"
            height={320}
            width={320}
            className="drop-shadow-lg"
          />
        </div>
        
        {/* Text content */}
        <div className="flex flex-col gap-6 lg:max-w-lg">
          <h2 className="text-3xl font-light text-gray-800">
            <span className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Get Interview Ready
            </span> with AI-powered mock interviews
          </h2>
          <p className="text-lg text-gray-600/90">
            Practice job interviews with AI. Get instant feedback and improve
            your interview skills. Join our community of job seekers and land
            your dream job.
          </p>
          <Button asChild className="max-sm:w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all w-fit">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
      </section>


      {/* User Interviews Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-light text-gray-800">
          Your <span className="font-medium">Interviews</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews?.length ? (
            interviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <div className="p-6 bg-white/50 rounded-xl text-gray-500">
              You haven't taken any interviews yet
            </div>
          )}
        </div>
      </section>

      {/* Community Interviews Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-light text-gray-800">
          Browse <span className="font-medium">Community Interviews</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestInterviews?.length ? (
            latestInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <div className="p-6 bg-white/50 rounded-xl text-gray-500">
              No interviews available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Page;