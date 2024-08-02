import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from "convex/react";
import { v } from 'convex/values';
import { api } from "../../convex/_generated/api"
// import { syncUsers } from '../../convex/functions/syncUsers';

export default function SignInPage() {
    const { user } = useUser();
    const syncUser = useMutation(api.functios.syncUser.syncUsers);

    useEffect(() => {
        if (user) {
        syncUser({
            clerkUserId: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName
        });
        }
    }, [user, syncUser]);

    return null;
}