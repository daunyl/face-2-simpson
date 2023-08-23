import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '../../../../_constants';
import { deleteBucketObject, getStatusText } from '../../../_utils';

export async function POST(req: NextRequest) {
  try {
    const { feedback, key } = await req.json();
    if (feedback === false) deleteBucketObject(key);
    return NextResponse.json(null);
  } catch (e) {
    console.error(e);
    if (e instanceof Error)
      return NextResponse.json(
        { message: e.message },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
        }
      );
  }
}