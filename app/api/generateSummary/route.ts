import openai from "@/openai";
import { NextResponse } from "next/server";
export async function POST (request: Request) {
    const {todos} = await request.json();


    //communicate to open ai

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "When responding, welcome the user always as Mr.Leo and say welcome to the Brello Todo App! Limit the response to 300 characters" },
        { role: "user", content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To Do, in progress and done, then tell the user 3 main things he can do so he can quickly finish all To dos but consider these tips being specific for the content of those todos, if there is no To do and no in progress on the list, congratulate the user. Here's the data: ${JSON.stringify(todos)}` }
    ],
        model: "gpt-3.5-turbo",
      });

    console.log(completion);

    return NextResponse.json(completion.choices[0].message);
}