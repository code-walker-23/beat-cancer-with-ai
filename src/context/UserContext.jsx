import React, { createContext, useCallback, useContext, useState } from "react";
import { db } from "../utils/dbConfig";
import { Users, Records } from "../utils/schema";
import { eq } from "drizzle-orm";

const UserStateContext = createContext();

export const UserStateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const results = await db.select().from(Users).execute();
      setUsers(results);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }, []);

  const fetchUserByEmail = useCallback(async (email) => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute(); // Added execute

      if (result.length > 0) {
        setCurrentUser(result[0]);
      } else {
        setCurrentUser("user-not-found");
      }
    } catch (error) {
      console.error("Error fetching user by email", error);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning()
        .execute();
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      setCurrentUser(newUser[0]);
      return newUser[0];
    } catch (error) {
      console.error("Error creating user", error);
      return null;
    }
  }, []);

  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user record", error);
    }
  }, []);

  const createRecord = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();
      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating user record", error);
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentID, ...dataToUpdate } = recordData;
      const result = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentID))
        .returning()
        .execute();

      if (result.length > 0) {
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === documentID ? { ...record, ...dataToUpdate } : record,
          ),
        );
        return result[0];
      }
      return null;
    } catch (error) {
      console.error("Error updating user record", error);
      return null;
    }
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        users,
        records,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        currentUser,
        updateRecord,
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
};

export const useUserStateContext = () => useContext(UserStateContext);