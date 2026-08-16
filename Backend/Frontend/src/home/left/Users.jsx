/* eslint-disable no-unused-vars */
import React from "react";
import User from "./User.jsx";
import userGetAllUsers from "../../Context/userGetAllUsers.jsx";
import Loading from "../../components/Loading.jsx"; // Import Loading

function Users() {
  const [allUsers, loading] = userGetAllUsers();

  return (
    <div>
      {/*
        The 'style' and 'overflow-y-auto' classes have been moved to Left.jsx
        for a cleaner layout. This div is now just the container.
      */}
      <div className="flex-eren py-2 flex-col">
        {loading && <Loading />} {/* Show loading skeleton */}
        {!loading &&
          allUsers.map((user, index) => {
            return <User key={user._id || index} user={user} />;
          })}
      </div>
    </div>
  );
}

export default Users;