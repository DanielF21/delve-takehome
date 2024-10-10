import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the type for RLS data
type RlsData = {
  schemaname: string;
  tablename: string;
  rls_status: string; // 'Enabled' or 'Disabled'
};

export async function GET() {
  try {
    // Retrieve the accessToken from cookies
    const accessToken = cookies().get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch the projects
    const projectsResponse = await fetch('https://api.supabase.com/v1/projects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!projectsResponse.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await projectsResponse.json();

    // Extract and return the list of projects with id and name
    const projectList = projects.map((project: { id: string, name: string }) => ({
      id: project.id,
      name: project.name
    }));

    // Initialize an array to hold the RLS status for each project
    const rlsStatusList = [];

    // Loop through each project and fetch RLS status
    for (const project of projectList) {
      const rlsResponse = await fetch(`https://api.supabase.com/v1/projects/${project.id}/database/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            SELECT schemaname, tablename, 
            CASE WHEN relrowsecurity THEN 'Enabled' ELSE 'Disabled' END AS rls_status 
            FROM pg_tables 
            JOIN pg_class ON pg_tables.tablename = pg_class.relname 
            WHERE schemaname = 'public' 
            ORDER BY tablename;
          `
        }),
      });

      if (!rlsResponse.ok) {
        console.error(`Failed to fetch RLS status for project ${project.id}`);
        continue;
      }

      // Log the raw response to inspect the data
      const rlsData: RlsData[] = await rlsResponse.json();
      console.log(`RLS Data for project ${project.id}:`, rlsData);

      rlsStatusList.push({
        projectId: project.id,
        projectName: project.name,
        rlsData,
      });
    }

    return NextResponse.json(rlsStatusList);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
