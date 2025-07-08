import React from "react";
import dayjs from "dayjs";

export default function Dashboard({ user }) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Dashboard</h2>
      <div className="space-y-2 text-gray-700">
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Name:</span> {user.name || "-"}</p>
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {dayjs(user.createdAt).format("MMMM D, YYYY")}
        </p>
      </div>
    </div>
  );
}