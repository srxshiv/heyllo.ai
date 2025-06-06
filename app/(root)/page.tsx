import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { dummyInterviews } from "@/constants";


const Page = () => {
    return <>
    <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
            <h2>Get Interview Ready with Ai powered mock interview and feedback</h2>
            <p className="text-lg">
                Practice job interviews with AI. Get instant feedback and improve your interview skills. 
                Join our community of job seekers and land your dream job.
            </p>
            <Button asChild className="btn-primary max-sm:w-full">
                <Link href="/interview">Start an Interview</Link>
            </Button>
        </div>
        <Image src="/robot.png" alt="logo" height={400} width={400} className="max-sm:hidden" />
    </section>

    <section className="flex flex-col gap-6 mt-8">
        <h2>Your InterViews</h2>
        <div className="interviews-section">
            {dummyInterviews.map((interview)=>{
                return <InterviewCard {...interview} key={interview.id} />
            })}

            {/* <p>You haven't taken any interviews yet</p> */}
        </div>
    </section>

    <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>
        <div className="interviews-section">
            {dummyInterviews.map((interview)=>{
                return <InterviewCard {...interview} key={interview.id} />
            })}

            {/* <p>No interviews available </p> */}
        </div>
    </section>

    </>
}

export default Page;