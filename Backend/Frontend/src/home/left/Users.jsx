import React from "react";
import User from "./User.jsx";
import userGetAllUsers from "../../Context/userGetAllUsers.jsx";
import Loading from "../../components/Loading.jsx";

function Users() {
  const [allUsers, loading] = userGetAllUsers();

  return (
    <div className="py-2">
      {loading && <Loading />}

      {!loading && allUsers?.length > 0 && (
        <div className="space-y-0.5">
          {allUsers.map((user, index) => (
            <User key={user._id || index} user={user} />
          ))}
        </div>
      )}

      {!loading && (!allUsers || allUsers.length === 0) && (
        <div className="py-12 px-4 text-center">
          <p className="text-sm text-slate-400">No other users found</p>
        </div>
      )}
    </div>
  );
}

export default Users;