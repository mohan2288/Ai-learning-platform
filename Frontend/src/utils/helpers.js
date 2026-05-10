export const getCourseImage = (course) => {
  if (course.thumbnail) {
    return course.thumbnail;
  }

  return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
};
