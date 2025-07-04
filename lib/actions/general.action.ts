import { db } from "@/firebase/admin";
import { generateAIFeedback } from "./ai.action";

export async function getInterviewByUserId(
  userId: string
): Promise<Interview[] | null> {

  console.log(userId)
  
  if(!userId){
    return []
  }
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function createFeedBack(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;
  
  // Get AI feedback
  const aiResult = await generateAIFeedback(transcript);
  
  if (!aiResult.success || !aiResult.feedback) {
    return { success: false, feedbackId: null };
  }

  const { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } = aiResult.feedback;

  // Save to database
  const feedback = await db.collection("feedback").add({
    interviewId,
    userId,
    totalScore,
    categoryScores,
    strengths,
    areasForImprovement,
    finalAssessment,
    createdAt: new Date().toISOString(),
  });

  return { success: true, id: feedback.id };
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection("feedback")
    .orderBy("createdAt", "desc")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (feedback.empty) {
    return null;
  }
  
  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}
