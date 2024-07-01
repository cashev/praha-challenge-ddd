"use client";
import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../lib/firebase/firebase';

const SignIn: React.FC = () => {

    const handleSignIn =  () => {
        signInWithPopup(auth, provider).then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
    };

    return (
        <div>
            <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            >Sign In</button>
        </div>
    );
};

export default SignIn;
