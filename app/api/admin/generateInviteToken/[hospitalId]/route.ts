import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hospital, { IInviteToken } from '@/lib/models/Hospital';
import crypto from 'crypto';

export const POST = async (req: Request, { params }: { params: { hospitalId: string } }) => {
    try {
        // Connect to the database
        await dbConnect();

        // Extract hospitalId from the URL parameters
        const { hospitalId } = params;

        // Find the hospital using the hospitalId from the URL
        const hospital = await Hospital.findById(hospitalId);

        // If the hospital is not found, return an error
        if (!hospital) {
            return NextResponse.json({ success: false, message: 'Hospital not found' }, { status: 404 });
        }

        // Generate a unique invite token
        const inviteToken = crypto.randomBytes(16).toString('hex');
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

        // Create a new subdocument using Mongoose's constructor
        const inviteTokenObj = {
            token: inviteToken,
            isUsed: false,
            expiresAt: expirationDate,
        };

        // Push the invite token object into the inviteTokens array
        hospital.inviteTokens.push(inviteTokenObj as IInviteToken);

        // Save the hospital document with the new invite token
        await hospital.save();

        return NextResponse.json({
            success: true,
            message: 'Invite token generated successfully',
            inviteToken,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
