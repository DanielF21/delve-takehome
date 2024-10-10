import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the type for PITR data
type PitrData = {
  projectId: string;
  projectName: string;
  pitrEnabled: boolean;
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

    // Initialize an array to hold the PITR status for each project
    const pitrStatusList: PitrData[] = [];

    // Loop through each project and check PITR status
    for (const project of projectList) {
      const pitrResponse = await fetch(`https://api.supabase.com/v1/projects/${project.id}/database/backups/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!pitrResponse.ok) {
        console.error(`Failed to fetch PITR status for project ${project.id}`);
        continue;
      }

      // Log the raw PITR response
      const pitrData = await pitrResponse.json();
      console.log(`Raw PITR Response for project ${project.id}:`, pitrData);

      // Assuming the response contains a field indicating if PITR is enabled
      const pitrEnabled = pitrData.pitr_enabled; // Adjust this based on actual response structure

      console.log(`PITR Data for project ${project.id}:`, pitrData);

      pitrStatusList.push({
        projectId: project.id,
        projectName: project.name,
        pitrEnabled,
      });
    }

    // Log the complete PITR status list
    console.log('PITR Status List:', pitrStatusList);

    return NextResponse.json(pitrStatusList);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
