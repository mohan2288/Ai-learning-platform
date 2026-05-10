import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/student/Dashboard";
import Courses from "../pages/student/Courses";
import CourseDetails from "../pages/student/CourseDetails";
import AIAssistant from "../pages/student/AIAssistant";
import CreateCourse from "../pages/trainer/CreateCourse";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route
          path="/trainer/create"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/courses/:id/edit"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
