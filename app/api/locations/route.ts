import { NextRequest, NextResponse } from 'next/server';
import { ALL_INDIAN_STATES, getDistrictsByState, INDIA_STATES_DISTRICTS } from '@/app/lib/indiaStatesDistricts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const all = searchParams.get('all');

  if (all === 'true') {
    return NextResponse.json({
      states: ALL_INDIAN_STATES,
      data: INDIA_STATES_DISTRICTS,
    });
  }

  if (state) {
    const districts = getDistrictsByState(state);
    return NextResponse.json({
      state,
      districts,
      count: districts.length,
    });
  }

  return NextResponse.json({
    states: ALL_INDIAN_STATES,
    count: ALL_INDIAN_STATES.length,
  });
}

