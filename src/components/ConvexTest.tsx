import React, { useEffect, useState } from 'react';
import { ConvexProvider, useQuery, useMutation } from "convex/react";
import convex from './ConvexClient';
import { getCurrentUser, updateUser } from '../convex/user'; // Adjust path as necessary

const ConvexTest = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // const { data: currentUserData, isLoading: isCurrentUserLoading } = useQuery(getCurrentUser, { userId: 'user-id' });
    // const updateUserMutation = useMutation(updateUser);
    
    // Define your Convex queries and mutations
    const currentUserQuery = convex.query('getCurrentUser');
    const saveUserData = convex.mutation('saveUserData');

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const userId = 'user-id'; // Replace with actual user ID logic
            const userData = await currentUserQuery({ userId });
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchUser();
    }, [getCurrentUser]);

    const handleSave = async () => {
        try {
        const dataToSave = { key: 'value' }; // Replace with actual data
        await saveUserData(dataToSave);
        alert('Data saved successfully');
        } catch (error) {
        console.error('Error saving data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
        {/* <h1>Hello, {user?.name}</h1> */}
        <button onClick={handleSave}>Save Data</button>
        </div>
    );
}
 
export default ConvexTest;