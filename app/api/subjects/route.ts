import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/app/lib/api-config';

export async function GET() {
  try {
    // Gọi API gateway để lấy subjects với participants
    const response = await fetch(`${API_BASE_URL}/api/subject`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}