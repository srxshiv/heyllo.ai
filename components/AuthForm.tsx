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
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "signup" ? z.string().min(4, { message: "should be atleast 4 characters" }).max(30) : z.string().optional(),
    password: z.string().min(6, { message: "should be atleast 6 characters" }).max(20),
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
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully, please sign in");
        router.push("/signin");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to get user token, please try again");
          return;
        }

        await signIn({ email, idToken });
        toast.success("Logged in successfully");
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred: " + err);
    }
  }

  const isSignIn: boolean = type === "signin";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-blue-100/40">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white/10"
      >
        <motion.div 
          className="flex flex-col items-center"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-5">
            <motion.div
              whileHover={{ rotate: 8 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image 
                src="/logo.png" 
                alt="logo" 
                width={44} 
                height={38} 
                className="h-10 w-auto drop-shadow-md"
              />
            </motion.div>
            <h1 className="text-3xl font-light text-gray-800">
              <span className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Heyllo</span>
              <span className="text-gray-600">.ai</span>
            </h1>
          </div>
          <p className="text-gray-600/90 text-sm">
            Practice job interviews with AI
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormInputField
                  name="name"
                  placeholder="Your Name"
                  label="Name"
                  control={form.control}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isSignIn ? 0.2 : 0.3 }}
            >
              <FormInputField
                name="email"
                placeholder="Your Email address"
                label="Email"
                control={form.control}
                type="email"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isSignIn ? 0.3 : 0.4 }}
            >
              <FormInputField
                name="password"
                placeholder="Your Password"
                label="Password"
                control={form.control}
                type="password"
              />
            </motion.div>

            <motion.div
              className="pt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl shadow-indigo-200/50"
              >
                {isSignIn ? "Sign in" : "Create account"}
              </button>
            </motion.div>
          </form>
        </Form>

        <motion.div 
          className="text-center text-sm text-gray-600/80 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={!isSignIn ? "/signin" : "/signup"}
            className="ml-1.5 font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthForm;