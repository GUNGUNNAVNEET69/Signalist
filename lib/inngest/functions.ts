export const runtime = "nodejs";

import { inngest } from "@/lib/inngest/client";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompt";
import { getAllUsersForNewsEmail } from "../actions/user.action";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { getFormattedTodayDate } from "../utils";

/**
 * Minimal types for the news job — expand as needed to match your data shapes.
 */
type UserForNewsEmail = {
  email: string;
  name?: string;
  // add other user fields used elsewhere if required
};

type MarketNewsArticle = {
  id?: string | number;
  title?: string;
  source?: string;
  url?: string;
  summary?: string;
  // extend with other article fields returned by getNews()
};

export const sendSignUpEmail = inngest.createFunction(
  { id: "send-signup-email" },
  { event: "app/user.created" },

  async ({ event, step }) => {
    // Create user profile text for prompt
    const userProfile = `
      Country: ${event.data.country}
      Investment Goals: ${event.data.investmentGoals}
      Risk Tolerance: ${event.data.riskTolerance}
      Preferred Industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    // ============================
    // 🚀 Generate AI Email Content
    // ============================
    const result = await step.ai.infer("generate-email", {
      model: step.ai.models.openai({ model: "gpt-4o-mini" }),
      body: {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });

    // Extract the text
    let introText = "Thanks for joining Signalist!";

    try {
      // Primary: prefer the typed choices/message.content shape
      const choiceText = result.choices?.[0]?.message?.content ?? null;

      // Fallback: some SDKs or older responses may use a different shape; cast to any for that path
      const outputText =
        (result as any).output?.[0]?.content?.[0]?.text ?? null;

      introText = choiceText || outputText || introText;
    } catch (e) {
      console.error("AI response parsing failed:", e);
    }

    // ============================
    // 🚀 Send Email
    // ============================
    await step.run("send-welcome-email", async () => {
      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  }
);

/*This code snippet is a configuration object for a cron job. It specifies that the cron job should run every day at 12:00 PM. The 0 12 * * * part is the cron expression, where each asterisk represents a field in the cron schedule. The fields are as follows:

0: The minute field, indicating that the job should run at the start of the hour.
12: The hour field, indicating that the job should run at 12:00 PM.
*: The day of the month field, indicating that the job should run on any day of the month.
*: The month field, indicating that the job should run in any month.
*: The day of the week field, indicating that the job should run on any day of the week.
So, corn:'0 12 * * *' means that the cron job should run every day at 12:00 PM.*/

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  async ({ step }) => {
    // Step #1: Get all users for news delivery
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users || users.length === 0)
      return { success: false, message: "No users found for news email" };

    // Step #2: For each user, get watchlist symbols -> fetch news (fallback to general)
    const results = await step.run("fetch-user-news", async () => {
      const perUser: Array<{
        user: UserForNewsEmail;
        articles: MarketNewsArticle[];
      }> = [];
      for (const user of users as UserForNewsEmail[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });

    // Step #3: (placeholder) Summarize news via AI
    // ============================
    // Step #3: Summarize news via OpenAI
    // ============================
    const userNewsSummaries: {
      user: UserForNewsEmail;
      newsContent: string | null;
    }[] = [];

    for (const { user, articles } of results) {
      try {
        if (!articles || articles.length === 0) {
          userNewsSummaries.push({
            user,
            newsContent: "No major market updates today.",
          });
          continue;
        }

        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2)
        );

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.openai({
            model: "gpt-4o-mini", // 🔥 cheap + fast
          }),
          body: {
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
        });

        const newsContent =
          response.choices?.[0]?.message?.content ??
          (response as any)?.output?.[0]?.content?.[0]?.text ??
          "No market news.";

        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.error("Failed to summarize news for:", user.email, e);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // Step #4: (placeholder) Send the emails
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;

          return await sendNewsSummaryEmail({
            email: user.email,
            date: getFormattedTodayDate(),
            newsContent,
          });
        })
      );
    });

    return {
      success: true,
      message: "Daily news summary emails sent successfully",
    };
  }
);
