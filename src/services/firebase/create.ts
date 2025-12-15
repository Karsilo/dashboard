import { firestore } from "@/lib/firebase/config";
import { IMemberInvite } from "@/models/invite";
import { inviteCodesCol } from "@/utils/constants";
import { doc, setDoc } from "firebase/firestore";


export async function createMemberInvite({ invite }: { invite: IMemberInvite }): Promise<{ code?: string; error?: string }> {
    try {
        const inviteRef = doc(
            firestore,
            inviteCodesCol,
            invite.id as string
        );

        const inviteData: IMemberInvite = {
            ...invite,
            createdAt: Date.now(),
        };

        await setDoc(inviteRef, inviteData);

        return { code: invite.id as string };
    } catch (error) {
        return { error: `${error}` };
    }
}