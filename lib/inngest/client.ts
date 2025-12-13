import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "signalist",
  ai: {
    openai: {
      apikey: process.env.OPEN_AI_API_KEY!,
    },
  },
});
