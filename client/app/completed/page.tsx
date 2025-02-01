// client/app/completed/page.tsx
"use client";

import React from 'react';

const page = () => {
  return (
    <div style={{
        position: 'absolute', // Change to absolute to position it correctly
        top: '50%', // Center vertically
        left: '50%', // Center horizontally
        transform: 'translate(-50%, -50%)', // Adjust position to center
        zIndex: 100, // High z-index to ensure it appears on top
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly opaque background
        padding: '20px', // Add padding
        borderRadius: '8px' // Optional: rounded corners
    }}>
        <h1 style={{
            fontSize: '4rem', // Large font size
            color: 'black',
            fontWeight: 'bold'
        }}>
            Completed Tasks
        </h1>
        <p style={{
            fontSize: '2rem', // Large font size
            color: 'black',
            fontWeight: 'bold'
        }}>
            This page will display all completed tasks.
        </p>
    </div>
);
};

export default page;
