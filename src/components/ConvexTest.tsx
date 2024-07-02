import React, { useEffect, useState } from 'react';
import convex from './ConvexClient';
import { useQuery, useMutation } from "convex/react";
// import { useMutation } from 'react-query';
// import { getCurrentUser, updateUser } from '../convex/user'; // Adjust path as necessary
// import { addRandomName } from './addRandomName'; // Adjust the path as necessary
// import { useMutation } from "convex/react";
// import { api } from "../convex/_generated/api";
// import { useConvex } from 'convex-dev/react';
import addClick from '../convex/functions/addClick';


const ConvexTest = () => {
    // const convex = useConvex();
  
    const handleClick = async () => {
        await convex.mutation(addClick);
        alert("Added 'click me' to the database");
    };

    // const addClickMutation = convex.mutation(addClick);
    // const handleClick = async () => {
    //     await addClickMutation({});
    //     alert("Added 'click me' to the database");
    // };

    return (
        <div>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
}
 
export default ConvexTest;


// const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);
    // Type checking
    // type GetCurrentUser = typeof getCurrentUser;
    // type UpdateUser = typeof updateUser;

    // console.log(getCurrentUser); // Ensure the function is correctly imported
    // console.log(updateUser); // Ensure the function is correctly imported

    // const currUser = convex.useQuery("getCurrentUser");
    // const saveUserData = convex.mutation("updateUser");

    // Use Convex query to get the current user
    // const { data: currentUserData, isLoading: isCurrentUserLoading } = useQuery(getCurrentUser, { userId: 'user-id' });
    // const saveUserDataMutation = useMutation(saveUserData);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //     try {
    //         const userId = 'user-id'; // Replace with actual user ID logic
    //         const userData = await currUser({ userId });
    //         setUser(userData);
    //     } catch (error) {
    //         console.error('Error fetching user:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    //     };

    //     fetchUser();
    // }, [getCurrentUser]);

    // const handleSave = async () => {
    //     try {
    //     const dataToSave = { key: 'value' }; // Replace with actual data
    //     await saveUserData(dataToSave);
    //     alert('Data saved successfully');
    //     } catch (error) {
    //     console.error('Error saving data:', error);
    //     }
    // };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // const addRandomNameMutation = useMutation(addRandomName);

    // const handleAddName = async () => {
    //     try {
    //     const randomNames = ["Alice", "Bob", "Charlie", "David", "Eve"];
    //     const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    //     await addRandomNameMutation({ fullName: randomName });
    //     alert('Name added successfully');
    //     } catch (error) {
    //         console.error('Error adding name:', error);
    //     }
    // };

    // const doSomething = useMutation(api.functions.doSomething);