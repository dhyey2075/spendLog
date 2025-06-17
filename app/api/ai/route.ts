import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const enhance_prompt = (prompt: string) => {
    return `You are a helpful expense tracker. User gives you the transcribe and you are supposed to extract data fields from it. There are following data fields amount, isExpense, description, method, merchant, catergory.


    method: ["UPI", "Cash", "Credit", "Debit"]
    Categories: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Salary', 'Investment', 'Gift', 'Travel', 'Groceries', 'Utilities', 'Subscriptions', 'Personal Care', 'Charity', 'Miscellaneous', 'Uncategorized', 'Other'
    ] otherwise you can return uncategorized.
    merchant: ["Papa", "Mummy", "Friends", "Honey One", "Aashapura", "Padma Kamal", "Shinestar", "Kaka's Shop", "Nescafe", "Juice Shop", "KPP", "Amul", "Mess", "Pramukh", "RC", "Other"]

    If the user is spending money, then isExpense should be true, otherwise false.
    The Method and categories should be strictly from the above list.

Example:
I spent 100Rs on Padma Kamal for buying Samosas using UPI.
Output: 
{
    "amount": 100,
    "isExpense": true,
    "description": "Samosas",
    "method": "UPI",
    "merchant: "Padma Kamal"
    "category": "Food"

}

Strictly follow the above format and do not return anything else. If you are not able to extract any field, just return null for that field.

User Transcribe:
${prompt}
`
}


export async function POST(req: NextRequest) {
    const body = await req.json();
    const { prompt, userId } = body;
    if (!prompt) { 
        return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: enhance_prompt(prompt),
        });
        const result = response.text?.trim();
        const slicedResult = result ? result.slice(7, -3) : result;
        if (!slicedResult) {
            return NextResponse.json({ error: "No valid response from AI" }, { status: 500 });
        }
        const jsonResult = JSON.parse(slicedResult);
        jsonResult.userIdBody = userId
        console.log("step1",jsonResult)
        // Get the current host URL from the request headers
        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const baseUrl = `${protocol}://${host}`;

        const resp = await fetch(`${baseUrl}/api/txn/create`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: jsonResult ? JSON.stringify(jsonResult) : "{}",
        });
        const data = await resp.json();
        if(resp.status !== 201) {
            return NextResponse.json({ error: data.error || "Failed to create transaction" }, { status: resp.status });
        }

        return NextResponse.json({ jsonResult, data }, { status: 200 });
    } catch (error) {
        console.error("Error generating AI response:", error);
        return NextResponse.json({ error: "Failed to generate AI response" + error }, { status: 500 });
    }

}