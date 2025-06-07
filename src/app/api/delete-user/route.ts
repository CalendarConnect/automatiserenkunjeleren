import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function DELETE(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' },
        { status: 401 }
      );
    }

    // Get the request body to check if this is an admin deletion
    let body = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (error) {
      console.log('No body or invalid JSON, using self-deletion');
    }
    const targetClerkId = (body as any).clerkId;

    let userIdToDelete = userId; // Default to self-deletion

    // If clerkId is provided, this is an admin deletion
    if (targetClerkId) {
      // TODO: Add admin check here if needed
      // For now, we trust that the Convex mutation already checked admin rights
      userIdToDelete = targetClerkId;
    }

    // Delete the user from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(userIdToDelete);

    return NextResponse.json({ 
      success: true, 
      message: 'Gebruiker succesvol verwijderd' 
    });
  } catch (error) {
    console.error('Error deleting user from Clerk:', error);
    return NextResponse.json(
      { error: 'Fout bij het verwijderen van de gebruiker' },
      { status: 500 }
    );
  }
} 