import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";

const useCourses = (filters = {}) => {
  const { search = "", category = "", level = "" } = filters;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const { data } = await getCourses({ search, category, level });
        setCourses(data.data || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [search, category, level]);

  return { courses, loading, error, setCourses };
};

export default useCourses;
