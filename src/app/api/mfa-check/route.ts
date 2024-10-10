import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the Member interface based on the API response
interface Member {
  user_id: string;
  user_name: string;
  email: string;
  role_name: string;
  mfa_enabled: boolean;
}

export async function GET() {
  try {
    // Retrieve the accessToken from cookies
    const accessToken = cookies().get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch the user's organizations to get the org ID
    const orgResponse = await fetch('https://api.supabase.com/v1/organizations', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!orgResponse.ok) {
      throw new Error('Failed to fetch organizations');
    }

    const orgData = await orgResponse.json();
    const orgId = orgData[0]?.id;

    if (!orgId) {
      throw new Error('No organization ID found');
    }

    // Fetch the members of the organization using the organization ID (slug)
    const membersResponse = await fetch(`https://api.supabase.com/v1/organizations/${orgId}/members`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!membersResponse.ok) {
      throw new Error('Failed to fetch organization members');
    }

    // Parse the members response and type-check with the Member interface
    const members: Member[] = await membersResponse.json();

    console.log('List of users:', members); // Log the list of users

    const userNames = members.map((member) => ({
      user_name: member.user_name,
      email: member.email,
      mfa_enabled: member.mfa_enabled
    }));

    return NextResponse.json(userNames);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
