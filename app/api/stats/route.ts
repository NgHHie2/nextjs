import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/app/lib/api-config';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/accounts`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}