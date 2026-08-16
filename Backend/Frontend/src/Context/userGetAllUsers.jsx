import { useEffect, useState } from "react";
import apiClient from "../apiClient.js";

const useGetAllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getUsers = async () => {
      try {
        const response = await apiClient.get("/user/getUserProfile");
        if (isMounted && Array.isArray(response.data)) {
          setAllUsers(response.data);
        }
      } catch (_) {
        if (isMounted) setAllUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return [allUsers, loading];
};

export default useGetAllUsers;