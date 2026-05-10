export const calculatePercentage = (completedLessonsCount, totalLessonsCount) => {
  if (!totalLessonsCount) {
    return 0;
  }

  return Math.round((completedLessonsCount / totalLessonsCount) * 100);
};
