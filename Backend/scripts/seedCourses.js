import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

dotenv.config();

const trainerEmail = "demo.trainer@ailearning.local";

const courses = [
  {
    title: "React Foundations for Beginners",
    description: "Build confidence with components, props, state, events, and simple project structure in React.",
    category: "Frontend",
    level: "Beginner",
    duration: "3h 20m",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Components and JSX", duration: "35m", content: "Create reusable UI pieces with JSX and props." },
      { title: "State and Events", duration: "45m", content: "Handle user interaction with useState and event handlers." },
      { title: "Building a Mini Dashboard", duration: "55m", content: "Combine components into a small frontend project." },
    ],
  },
  {
    title: "Responsive UI with Tailwind CSS",
    description: "Design clean, responsive pages using spacing, layout, typography, and utility-first styling.",
    category: "Frontend",
    level: "Intermediate",
    duration: "2h 45m",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Utility Classes That Matter", duration: "30m", content: "Use Tailwind utilities to build consistent interfaces." },
      { title: "Responsive Layouts", duration: "45m", content: "Create adaptive grids, cards, and navigation." },
      { title: "Polishing Real Screens", duration: "50m", content: "Improve hierarchy, empty states, and interaction feedback." },
    ],
  },
  {
    title: "Advanced React Patterns",
    description: "Learn practical patterns for shared state, composition, custom hooks, and scalable frontend workflows.",
    category: "Frontend",
    level: "Advanced",
    duration: "4h",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Custom Hooks", duration: "50m", content: "Extract reusable stateful logic into hooks." },
      { title: "Component Composition", duration: "45m", content: "Use flexible composition instead of rigid props." },
      { title: "Performance and Boundaries", duration: "60m", content: "Understand memoization, loading states, and render flow." },
    ],
  },
  {
    title: "Node.js API Essentials",
    description: "Create REST APIs with Express, routes, middleware, validation, and clear JSON responses.",
    category: "Backend",
    level: "Beginner",
    duration: "3h",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Express App Structure", duration: "35m", content: "Set up routes, controllers, and middleware." },
      { title: "Request Validation", duration: "40m", content: "Validate body data before it reaches business logic." },
      { title: "Error Handling", duration: "45m", content: "Return consistent API errors for clients." },
    ],
  },
  {
    title: "MongoDB and Mongoose Models",
    description: "Model application data, design schemas, create relationships, and query documents effectively.",
    category: "Backend",
    level: "Intermediate",
    duration: "3h 30m",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Schemas and Validation", duration: "40m", content: "Create reliable Mongoose schemas." },
      { title: "Relationships and Population", duration: "50m", content: "Connect users, courses, and progress records." },
      { title: "Query Design", duration: "45m", content: "Filter, sort, and search documents for real apps." },
    ],
  },
  {
    title: "Production Backend Security",
    description: "Secure APIs with authentication, role checks, safe errors, CORS, and deployment-ready settings.",
    category: "Backend",
    level: "Advanced",
    duration: "4h 10m",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "JWT Authentication", duration: "55m", content: "Protect API routes with signed tokens." },
      { title: "Roles and Permissions", duration: "45m", content: "Authorize trainer and student workflows." },
      { title: "Deployment Hardening", duration: "55m", content: "Prepare CORS, env vars, and error messages for production." },
    ],
  },
  {
    title: "AI Prompting Fundamentals",
    description: "Write better prompts for explanations, quizzes, summaries, and tutoring-style AI responses.",
    category: "AI",
    level: "Beginner",
    duration: "2h 15m",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Prompt Anatomy", duration: "30m", content: "Use role, task, context, and output format." },
      { title: "Examples and Constraints", duration: "35m", content: "Improve answers with examples and clear boundaries." },
      { title: "Study Assistant Prompts", duration: "40m", content: "Create prompts for learning support and practice." },
    ],
  },
  {
    title: "Building AI Features with APIs",
    description: "Connect AI services to a web app and handle prompts, responses, loading states, and failures.",
    category: "AI",
    level: "Intermediate",
    duration: "3h 40m",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Service Layer Design", duration: "45m", content: "Keep provider logic isolated from controllers." },
      { title: "Structured AI Output", duration: "50m", content: "Ask for JSON and validate the result." },
      { title: "Quota and Error UX", duration: "40m", content: "Handle provider limits with professional app messages." },
    ],
  },
  {
    title: "AI Evaluation and Safety",
    description: "Review AI outputs for quality, consistency, hallucinations, and user safety before shipping.",
    category: "AI",
    level: "Advanced",
    duration: "4h 20m",
    thumbnail: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Quality Checks", duration: "50m", content: "Evaluate usefulness, accuracy, and tone." },
      { title: "Failure Modes", duration: "55m", content: "Spot hallucinations, unsafe advice, and brittle prompts." },
      { title: "Feedback Loops", duration: "45m", content: "Use user feedback to improve AI behavior over time." },
    ],
  },
  {
    title: "Data Analysis with Spreadsheets",
    description: "Clean data, summarize patterns, and build useful charts with spreadsheet fundamentals.",
    category: "Data",
    level: "Beginner",
    duration: "2h 50m",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Cleaning Tables", duration: "35m", content: "Prepare rows and columns for analysis." },
      { title: "Formulas and Summaries", duration: "45m", content: "Use formulas to calculate useful metrics." },
      { title: "Charts That Explain", duration: "40m", content: "Choose charts that match the question." },
    ],
  },
  {
    title: "SQL for Product Data",
    description: "Query relational data using SELECT, joins, grouping, filtering, and practical reporting patterns.",
    category: "Data",
    level: "Intermediate",
    duration: "3h 25m",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Filtering and Sorting", duration: "40m", content: "Write queries that answer focused business questions." },
      { title: "Joins", duration: "55m", content: "Combine users, courses, enrollments, and progress tables." },
      { title: "Aggregations", duration: "45m", content: "Summarize activity with grouping and counts." },
    ],
  },
  {
    title: "Machine Learning Data Preparation",
    description: "Prepare datasets for ML with feature thinking, missing values, splits, and evaluation baselines.",
    category: "Data",
    level: "Advanced",
    duration: "4h 30m",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Feature Basics", duration: "50m", content: "Turn raw data into model-ready signals." },
      { title: "Train and Test Splits", duration: "45m", content: "Separate data for honest evaluation." },
      { title: "Baseline Metrics", duration: "55m", content: "Compare models against simple starting points." },
    ],
  },
  {
    title: "UI Design Foundations",
    description: "Learn layout, typography, contrast, spacing, and hierarchy for clean application screens.",
    category: "Design",
    level: "Beginner",
    duration: "2h 30m",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Visual Hierarchy", duration: "35m", content: "Guide attention with size, weight, and placement." },
      { title: "Spacing Systems", duration: "35m", content: "Create rhythm with consistent spacing choices." },
      { title: "Readable Interfaces", duration: "40m", content: "Improve clarity with contrast and typography." },
    ],
  },
  {
    title: "Design Systems in Practice",
    description: "Create reusable components, states, tokens, and documentation for consistent product UI.",
    category: "Design",
    level: "Intermediate",
    duration: "3h 15m",
    thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Component Inventory", duration: "40m", content: "Identify repeated interface patterns." },
      { title: "States and Variants", duration: "45m", content: "Design loading, empty, error, and success states." },
      { title: "Documentation", duration: "35m", content: "Explain usage rules for teams." },
    ],
  },
  {
    title: "UX Research for Learning Products",
    description: "Plan interviews, map learner journeys, and turn research insights into product decisions.",
    category: "Design",
    level: "Advanced",
    duration: "4h 5m",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    lessons: [
      { title: "Research Questions", duration: "45m", content: "Frame useful questions before talking to users." },
      { title: "Learner Journey Maps", duration: "50m", content: "Find friction across discovery, study, and completion." },
      { title: "Turning Insights into Work", duration: "55m", content: "Prioritize changes from evidence." },
    ],
  },
];

const seedCourses = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash("trainer123", 10);
  const trainer = await User.findOneAndUpdate(
    { email: trainerEmail },
    {
      $setOnInsert: {
        name: "Demo Trainer",
        email: trainerEmail,
        password,
        role: "trainer",
      },
    },
    { returnDocument: "after", upsert: true }
  );

  const operations = courses.map((course) => ({
    updateOne: {
      filter: { title: course.title },
      update: {
        $set: {
          ...course,
          trainer: trainer._id,
        },
      },
      upsert: true,
    },
  }));

  const result = await Course.bulkWrite(operations);

  console.log(
    `Seeded courses. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}`
  );
  console.log(`Demo trainer: ${trainerEmail} / trainer123`);
};

seedCourses()
  .catch((error) => {
    console.error(`Course seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
