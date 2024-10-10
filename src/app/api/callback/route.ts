import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // For managing cookies in Next.js

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    console.error('Authorization code not found in the request.');
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_CLIENT_ID = process.env.SUPABASE_CLIENT_ID!;
  const SUPABASE_CLIENT_SECRET = process.env.SUPABASE_CLIENT_SECRET!;
  const REDIRECT_URI = process.env.SUPABASE_REDIRECT_URI!;
  const codeVerifier = cookies().get('codeVerifier')?.value;

  if (!codeVerifier) {
    console.error('Code verifier not found.');
    return NextResponse.json({ error: 'Code verifier not found' }, { status: 400 });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: SUPABASE_CLIENT_ID,
        client_secret: SUPABASE_CLIENT_SECRET,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch access tokens:', data);
      return NextResponse.json(data, { status: response.status });
    }

    const accessToken = data.access_token;
    console.log('Access Token Retrieved:', accessToken);
    cookies().set('accessToken', accessToken, { httpOnly: true, secure: true, path: '/' });

    // Redirect to dashboard after successful login
    const baseUrl = `${url.protocol}//${url.host}`;
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    console.error("Error during fetch operation:", error);
    return NextResponse.json({ error: 'An error occurred while fetching access tokens' }, { status: 500 });
  }
}
