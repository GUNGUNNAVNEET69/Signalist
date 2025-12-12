// import { inngest } from "@/lib/inngest/client";
// import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
// import { sendWelcomeEmail } from "../nodemailer";


// export const sendSignUpEmail = inngest.createFunction(
//   { id: "send-signup-email" },
//   { event: "app/user.created" },
//   async ({ event, step }) => {
//     const userProfile = `
//         Country:${event.data.country}
//         Investment Goals:${event.data.investmentGoals}
//         Risk Tolerance:${event.data.riskTolerance}
//         Preferred Industry:${event.data.preferredIndustry}
//         `;

//     const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
//       "{{userProfile}}",
//       userProfile
//     );

//     const response = await step.ai.infer("generate-welcome-intro", {
//       model: step.ai.models.gemini({ model: "gemini-2.0-flash-lite" }),
//       body: {
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
//     });

//     await step.run("send-welcome-email", async () => {
//       const part = response.candidates?.[0]?.content?.parts?.[0];
//       const introText =
//         (part && "text" in part ? part.text : null) ||
//         "Thanks for joining signalist. Now you can start tracking the stocks you are interested in.";

//         const {data: {email, name}} = event;

//         return await sendWelcomeEmail({email, name, intro:introText});
//     });

//     return {
//         success:true,
//         message:"Email sent successfully"
//     }
//   }
// );

import { inngest } from "@/lib/inngest/client";
import { sendWelcomeEmail } from "../nodemailer";

export const sendSignUpEmail = inngest.createFunction(
  { id: "send-signup-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    // User profile (optional, for logging or future personalization)
    const userProfile = `
        Country: ${event.data.country}
        Investment Goals: ${event.data.investmentGoals}
        Risk Tolerance: ${event.data.riskTolerance}
        Preferred Industry: ${event.data.preferredIndustry}
    `;

    // Use a static intro text to bypass AI
    const introText =
      "Thanks for joining Signalist. Now you can start tracking the stocks you are interested in.";

    // Run the email step
    await step.run("send-welcome-email", async () => {
      const { data: { email, name } } = event;
      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: "Email sent successfully"
    };
  }
);

