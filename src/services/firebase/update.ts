"use client";

// External Imports
import { auth, firestore } from "@/lib/firebase/config";
import {  organisationsCol, usersCol } from "@/utils/constants";
import { deleteField, doc, FieldValue, updateDoc } from "firebase/firestore";

// Local Imports
import { incrementOrganisationMembersCount } from "./admin-increment";
import { createOrganisation } from "./admin-create";
import { retrieveIdToken } from "./retrieve";
import { IOrganisation } from "@/models/organisation";
import { IUser } from "@/models/user";


export async function updateOnboarding({ firstname, lastname, organisation }: { firstname: string, lastname: string, organisation?: string }) {
    try {
        const user = auth.currentUser;

        if (!user || !user.email) {
            throw new Error("No authenticated user found.");
        }


        const userRef = doc(firestore, usersCol, user.uid);

        const updatePayload: { [x: string]: FieldValue | Partial<unknown> | undefined; } = {
            firstname,
            lastname,
            "authentication.onboarding": deleteField(),
        }


        if (organisation) {
            const { org, error } = await createOrganisation({
                name: organisation,
                ownerId: user.uid,
                email: user.email,
            })

            if (error || !org) throw error

            updatePayload.organisation = {
                id: org.id,
                role: "owner",
                joinedAt: org.createdAt,
            }
        }

        await updateDoc(userRef, updatePayload);
    } catch (error) {
        console.error("Failed to update onboarding info:", error);
        throw error;
    }
}


export async function updateUser({ user }: { user: IUser }) {
    try {
        const { id, ...updatableFields } = user;

        const ref = doc(firestore, usersCol, id as string);
        await updateDoc(ref, updatableFields);

        return { success: true };
    } catch (error) {
        return { error: `${error}` };
    }
}


export async function updateOrganisation({ organisation }: { organisation: IOrganisation }) {
    try {
        const { id, ...updatableFields } = organisation;

        const ref = doc(firestore, organisationsCol, id as string);
        await updateDoc(ref, updatableFields);

        return { success: true };
    } catch (error) {
        return { error: `${error}` };
    }
}


export async function updateOrganisationMember({ member, organisation, remove }: { member: IUser, organisation?: IOrganisation, remove?: boolean }) {
    try {
        const userRef = doc(firestore, usersCol, member.id as string);

        if (remove && organisation && organisation.members) {
            const idToken = await retrieveIdToken();
            if (!idToken) throw new Error("User not found");

            await updateDoc(userRef, {
                organisation: deleteField(),
            });

            await incrementOrganisationMembersCount({ idToken, orgId: organisation.id as string, negate: true })
        } else {
            await updateDoc(userRef, {
                "organisation.role": member.organisation?.role,
            });
        }

        return { success: true };
    } catch (error) {
        console.error(`Error in updateOrganisationMember: ${error}`);
        return { error: `${error}` }
    }
}