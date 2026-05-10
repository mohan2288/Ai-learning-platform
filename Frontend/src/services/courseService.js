import api from "./api";

export const getCourses = (params = {}) => api.get("api/courses", { params });

export const getCourseById = (id) => api.get(`api/courses/${id}`);

export const createCourse = (data) => api.post("api/courses", data);

export const updateCourse = (id, data) => api.put(`api/courses/${id}`, data);

export const deleteCourse = (id) => api.delete(`api/courses/${id}`);

export const enrollCourse = (id) => api.post(`api/courses/${id}/enroll`);

export const getProgress = (courseId) => api.get(`api/progress/${courseId}`);

export const getMyProgress = () => api.get("api/progress");

export const updateProgress = (data) => api.post("api/progress/update", data);
