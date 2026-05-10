export const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

export const getCourseImage = (course) => {
  const thumbnail = course?.thumbnail?.trim();

  if (!thumbnail) {
    return DEFAULT_COURSE_IMAGE;
  }

  if (thumbnail.startsWith("//")) {
    return `https:${thumbnail}`;
  }

  if (/^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return DEFAULT_COURSE_IMAGE;
};

export const useFallbackCourseImage = (event) => {
  if (event.currentTarget.src !== DEFAULT_COURSE_IMAGE) {
    event.currentTarget.src = DEFAULT_COURSE_IMAGE;
  }
};
