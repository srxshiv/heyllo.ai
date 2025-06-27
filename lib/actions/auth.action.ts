"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams):Promise<{ success: boolean; message: string }> {
  const { uid, email, name ,password} = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    await db.collection("users").doc(uid).set({
      uid,
      email,
      password,
      name,
    });

    return {
      success: true,
      message: "User created successfully.",
    };
  } catch (e: any) {
    console.error("Error during sign up:", e);

    if (e.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email is already in use. Please use a different email.",
      };
    }
    return {
      success: false,
      message: "An error occurred during sign up. Please try again later.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("heyllo-session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please sign up first.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Sign in successful.",
    };
  } catch (e: any) {
    console.log(e);

    return {
      success: false,
      message: "An error occurred during sign in. Please try again later.",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("heyllo-session")?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (e: any) {
    console.error("Error getting current user:", e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("heyllo-session");
}