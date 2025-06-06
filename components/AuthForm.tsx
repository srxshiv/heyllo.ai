"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormInputField from "./FormInputField";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signUp , signIn} from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "signup" ? z.string().min(4 , {message: "should be atleast 4 characters"}).max(30) : z.string().optional(),
    password: z.string().min(6 , {message: "should be atleast 6 characters"}).max(20),
    email: z.string().email(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter();
  const formObject = authFormSchema(type);

  const form = useForm<z.infer<typeof formObject>>({
    resolver: zodResolver(formObject),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formObject>) {
    try {
      if (type === "signup") {
        const {name , email , password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth , email, password);
        const result = await signUp({
          uid : userCredentials.user.uid,
          name : name!,
          email,
          password
        })

        if(!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully , please sign in ")
        router.push("/signin");
        console.log("Sign Up ", values);
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to get user token, please try again");
          return ;
        }

        await signIn({
          email , idToken
        })

        toast.success("Logged in successfully");
        router.push("/")
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occured : " + err);
    }
  }

  const isSignIn: boolean = type === "signin";


  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">Heyllo.ai</h2>
        </div>
        <h3 className="text-center">Practice Job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mt-4 form space-y-6"
          >
            {!isSignIn && (
              <FormInputField
                name="name"
                placeholder="Your Name"
                label="Name"
                control={form.control}
              />
            )}

            <FormInputField
              name="email"
              placeholder="Your Email address"
              label="Email"
              control={form.control}
              type = "email"
            />

            <FormInputField
              name="password"
              placeholder="Your Password"
              label="Password"
              control={form.control}
              type = "password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an Account already?"}
          <Link
            href={!isSignIn ? "/signin" : "/signup"}
            className="font-bold ml-1 hover:text-violet-50"
          >
            {isSignIn ? "SignUp" : "SignIn"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
