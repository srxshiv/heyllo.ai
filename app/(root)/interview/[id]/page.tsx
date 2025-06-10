import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import DisplayTechIcons from "@/components/DIsplayTechIcons";
import { Agent } from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async ({params} : {params : {id:string}}) => {
    const id = await params.id
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if(!interview) {  
        redirect('/');  
    }

              console.log(interview.questions);
    return (
        <>
          <div className="flex flex=row gap-4 justify-between ">
            <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                <div className="flex flex-row gap-4 items-center">
                    <Image src='/covers/adobe.png' alt="Interview Image" width={40} height={40} className="rounded-full object-cover size-[40px]" />
                    <h3 className="capitalize">{interview.role}</h3>
                </div>
                <DisplayTechIcons
                    techStack={interview.techstack}
                />
            </div>
            <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">{interview.type}</p>
          </div>
          <Agent userName={user?.name!} userId={user?.id} type="interview" interviewId={id} questions={interview.questions} />
        </>
    );
}

export default Page;