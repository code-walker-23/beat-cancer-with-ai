import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import MedicalRecord from "./pages/records/MedicalRecord";
import SingleRecordDetails from "./pages/records/SingleRecordDetail";
import ScreeningSchedule from "./pages/ScreeningSchedule";
import { Buffer } from "buffer";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import { useUser } from "@clerk/clerk-react";
import Layout from "./pages/landing/Layout";
import Monitoring from "./pages/Monitoring";
import Screenings from "./pages/Screenings";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import { useUserStateContext } from "./context/UserContext";
import SignIn from "./pages/SignIn";

if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

const App = () => {
  const [searchParams] = useSearchParams();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { fetchUserRecords } = useUserStateContext();

  useEffect(() => {
    const isSignIn = searchParams.get("sign-in") === "true";
    if (isLoaded && isSignIn && user) {
      navigate("/dashboard");
    }
  }, [searchParams, user, navigate, isLoaded]);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchingRecords = async () => {
        await fetchUserRecords(user.emailAddresses[0].emailAddress);
      };
      fetchingRecords();
    }
  }, [user, isLoaded]);

  const isSignIn = searchParams.get("sign-in") === "true";

  return (
    <div>
      {!isSignIn ? (
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoutes>
                <Onboarding />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoutes>
                <MedicalRecord />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/medical-records/:id"
            element={
              <ProtectedRoutes>
                <SingleRecordDetails />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/screening-schedules"
            element={
              <ProtectedRoutes>
                <ScreeningSchedule />
              </ProtectedRoutes>
            }
          />
          <Route path="/" element={<Layout />} />
          <Route
            path="/appointments"
            element={
              <ProtectedRoutes>
                <Appointments />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/screenings"
            element={
              <ProtectedRoutes>
                <Screenings />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/monitoring"
            element={
              <ProtectedRoutes>
                <Monitoring />
              </ProtectedRoutes>
            }
          />
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        !user && <SignIn />
      )}
    </div>
  );
};

export default App;
