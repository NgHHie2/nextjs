// app/api/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/app/lib/api-config';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('jwt')?.value;
    const response = await fetch(`${API_BASE_URL}/account/search`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: `jwt=${authToken || ""}`
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const authToken = cookieStore.get('jwt')?.value;
    const response = await fetch(`${API_BASE_URL}/account`, {
      method: 'POST',
      headers: {
        Cookie: `jwt=${authToken || ""}`
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}