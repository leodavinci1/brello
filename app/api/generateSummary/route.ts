import openai from "@/openai";
import { NextResponse } from "next/server";
export async function POST (request: Request) {
    const {todos} = await request.json();


    //communicate to open ai

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "When responding Limit the response to 300 characters" },
        { role: "user", content: `Hi there, suggest new to dos that might be needed (maximum of 2 suggestions and it must be related to the following To Dos: (${JSON.stringify(todos)})). For this part add a string in this format: Todos#{First Todo Suggestion}|{Second Todo Suggestion}` }
    ],
        model: "gpt-3.5-turbo",
      });


   return NextResponse.json(completion.choices[0].message);

}