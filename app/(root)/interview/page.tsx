import {Agent} from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { vapi } from "@/lib/vapi.sdk";
import React from "react";

const Page = async () =>{
    const user = await getCurrentUser();

    if(!user){
        return <h3>Please login to continue</h3>
    }
    return <>
        <h3>
            Interview Page
        </h3>
         <Agent userName={user?.name} userId={user?.id} type="generate"/>
        </>
}

export default Page;