import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Function to generate a random string for code_verifier
function generateCodeVerifier() {
  return [...Array(128)].map(() => Math.random().toString(36)[2]).join('');
}

// Function to create a code challenge from the code verifier
async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function GET() {
  const SUPABASE_CLIENT_ID = process.env.SUPABASE_CLIENT_ID!;
  const REDIRECT_URI = process.env.SUPABASE_REDIRECT_URI!;
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store the codeVerifier in cookies
  cookies().set('codeVerifier', codeVerifier, { httpOnly: true, secure: true, path: '/' });

  const SUPABASE_OAUTH_URL = `https://api.supabase.com/v1/oauth/authorize?client_id=${SUPABASE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=projects.read&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  return NextResponse.redirect(SUPABASE_OAUTH_URL);
}
