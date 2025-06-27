import { Agent } from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50/30 to-blue-50/30 p-6">
        <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm text-center space-y-6">
          <h3 className="text-2xl font-medium text-gray-800">
            Please login to continue
          </h3>
          <p className="text-gray-600">
            You need to be signed in to access interview sessions
          </p>
          <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
            <Link href="/signin">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/20 to-blue-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-light text-gray-800">
            <span className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Interview
            </span> Session
          </h3>
          <Button 
            asChild 
            variant="outline" 
            className="bg-white/80 hover:bg-white text-gray-700"
          >
            <Link href="/">
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6">
          <Agent userName={user?.name} userId={user?.id} type="generate" />
        </div>
      </div>
    </div>
  );
};

export default Page;