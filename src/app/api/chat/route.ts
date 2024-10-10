import OpenAI from "openai"; // Import the OpenAI SDK
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI(); 

const context = `
To enable Point-in-Time Recovery (PITR) in Supabase using the Management API, you'll need to follow these steps:
1. First, ensure that your project is on the Pro plan or higher, as PITR is not available on the free tier.
2. Use the Management API endpoint for updating a project's configuration. The relevant endpoint is:
   \`PATCH /v1/projects/{ref}/config/database/backups\`
   Where \`{ref}\` is your project's reference ID.
3. In the request body, you'll need to include the following JSON:
   \`\`\`json
   { "pitr_enabled": true }
   \`\`\`
4. Send the PATCH request with the appropriate authentication headers.

Here's an example of how you might structure the API call using curl:
\`\`\`bash
curl -X PATCH 'https://api.supabase.com/v1/projects/YOUR_PROJECT_REF/config/database/backups' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-d '{"pitr_enabled": true}'
\`\`\`

Replace \`YOUR_PROJECT_REF\` with your actual project reference and \`YOUR_ACCESS_TOKEN\` with your valid access token.

You can use SQL to enable RLS on all tables at once:
\`\`\`sql
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END $$;
\`\`\`

This SQL script will loop through all tables in the public schema and enable RLS for each one.

To enable MFA for Your Own Account do the following:
1. Sign in to your Supabase account.
2. Go to your account settings.
3. Look for the MFA or Security section.
4. Enable MFA for your account.
5. You'll be prompted to set up a Time-based One-Time Password (TOTP) using an authenticator app like Google Authenticator, Authy, or 1Password.
6. Scan the QR code or enter the provided secret key into your authenticator app.
7. Enter the 6-digit code from your authenticator app to verify and complete the setup.

Remember to set up a backup TOTP factor on a different device or store the secret securely as a backup.
`;

const query_text = `
You are a large language AI assistant built by Daniel Fleming. You are given a user question, and please write clean, concise and accurate answer to the question. You will be given a set of related contexts to the question Please use the context and cite the context at the end of each sentence if applicable. 

Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic, if the given context do not provide sufficient information.

Other than code and specific names, your answer must be written in the same language as the question.

Here are the set of contexts:

${context}

Remember, don't blindly repeat the contexts verbatim. And here is the user question:
`;

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const { userQuestion } = await req.json();

        try {
            // Create a chat completion with the user's question
            const completion = await openai.chat.completions.create({
                model: "gpt-4o", 
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `${query_text} ${userQuestion}` },  
                ],
                max_tokens: 4096,
            });

            return NextResponse.json({ answer: completion.choices[0].message.content });
        } catch (error) {
            console.error('Error fetching response from GPT-4:', error);
            return NextResponse.json({ error: 'Failed to fetch response from GPT-4' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
}