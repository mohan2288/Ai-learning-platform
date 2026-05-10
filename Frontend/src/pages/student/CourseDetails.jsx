import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { enrollCourse, getCourseById, getProgress, updateProgress } from "../../services/courseService";
import { getCourseImage, useFallbackCourseImage } from "../../utils/helpers";
import Loader from "../../components/common/Loader";
import ProgressBar from "../../components/course/ProgressBar";

const getEmbedUrl = (url) => {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.replace("/", "")}`;
    }

    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
  } catch {
    return url;
  }

  return url;
};

const isDirectVideo = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [], percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState("");

  const fetchCourseData = useCallback(async () => {
    const [courseResponse, progressResponse] = await Promise.all([getCourseById(id), getProgress(id)]);

    return {
      courseData: courseResponse.data.data,
      progressData: progressResponse.data.data,
    };
  }, [id]);

  const refreshCourse = async () => {
    try {
      const { courseData, progressData } = await fetchCourseData();
      setCourse(courseData);
      setProgress(progressData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialCourse = async () => {
      try {
        const { courseData, progressData } = await fetchCourseData();

        if (active) {
          setCourse(courseData);
          setProgress(progressData);
          setSelectedLessonId(courseData.lessons?.[0]?._id || "");
        }
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || "Unable to load course");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInitialCourse();

    return () => {
      active = false;
    }
  }, [fetchCourseData]);

  const toggleLesson = async (lessonId) => {
    try {
      const completed = !progress.completedLessons?.some((item) => item === lessonId);
      const { data } = await updateProgress({ courseId: id, lessonId, completed });
      setProgress(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update progress");
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollCourse(id);
      toast.success("Enrolled successfully");
      refreshCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to enroll");
    }
  };

  if (loading) {
    return <div className="p-8"><Loader text="Loading course..." /></div>;
  }

  if (!course) {
    return <div className="p-8 text-slate-500">Course not found.</div>;
  }

  const selectedLesson = course.lessons?.find((lesson) => lesson._id === selectedLessonId) || course.lessons?.[0];
  const videoUrl = selectedLesson?.videoUrl?.trim();
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <img className="h-72 w-full object-cover" src={getCourseImage(course)} alt={course.title} onError={useFallbackCourseImage} />
        <div className="p-6">
          <p className="text-sm font-bold uppercase text-blue-700">{course.category} / {course.level}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">{course.title}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{course.description}</p>
          <button onClick={handleEnroll} className="mt-5 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white">Enroll / Resume</button>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white">
          {videoUrl ? (
            isDirectVideo(videoUrl) ? (
              <video className="aspect-video w-full bg-black" src={videoUrl} controls title={selectedLesson?.title || "Lesson video"} />
            ) : (
              <iframe
                className="aspect-video w-full"
                src={embedUrl}
                title={selectedLesson?.title || "Lesson video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <div className="aspect-video p-5">
              <div className="flex h-full items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <div className="text-center">
                  <p className="text-xl font-black">Lesson Video Placeholder</p>
                  <p className="mt-2 text-sm text-slate-300">No video URL has been added for this lesson.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Course Info</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Trainer</dt><dd className="font-bold">{course.trainer?.name || "Trainer"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Lessons</dt><dd className="font-bold">{course.lessons?.length || 0}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Duration</dt><dd className="font-bold">{course.duration}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Level</dt><dd className="font-bold">{course.level}</dd></div>
          </dl>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Lessons</h2>
          <span className="text-sm font-bold text-blue-700">{progress.percentage || 0}% complete</span>
        </div>
        <div className="mt-3"><ProgressBar value={progress.percentage} /></div>
        <div className="mt-5 divide-y divide-slate-100">
          {course.lessons?.map((lesson, index) => {
            const checked = progress.completedLessons?.some((item) => item === lesson._id);
            const selected = selectedLesson?._id === lesson._id;
            return (
              <label key={lesson._id} className={`flex cursor-pointer items-center gap-4 py-4 ${selected ? "bg-blue-50 px-3" : ""}`} onClick={() => setSelectedLessonId(lesson._id)}>
                <input type="checkbox" checked={checked} onChange={() => toggleLesson(lesson._id)} className="h-5 w-5 accent-blue-600" />
                <span className="flex-1">
                  <span className="block font-bold">{index + 1}. {lesson.title}</span>
                  <span className="text-sm text-slate-500">{lesson.duration}</span>
                </span>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
