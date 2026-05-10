import api from "./api";

export const getCourses = (params = {}) => api.get("/courses", { params });

export const getCourseById = (id) => api.get(`/courses/${id}`);

export const createCourse = (data) => api.post("/courses", data);

export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);

export const deleteCourse = (id) => api.delete(`/courses/${id}`);

export const enrollCourse = (id) => api.post(`/courses/${id}/enroll`);

export const getProgress = (courseId) => api.get(`/progress/${courseId}`);

export const getMyProgress = () => api.get("/progress");

export const updateProgress = (data) => api.post("/progress/update", data);
