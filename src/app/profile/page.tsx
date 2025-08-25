"use client";

import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Player Profile</h1>
      <p>Name: {user?.fullName}</p>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
