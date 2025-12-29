# Smart Issue Board

A modern, intelligent issue tracking application built with React, Vite, and Firebase. It provides teams with real-time issue management, duplicate detection, workflow enforcement, and a professional user experience.

**Live Demo**: [https://smart-issue-board.vercel.app](https://smart-issue-board.vercel.app)  

## Features

- Email/password authentication with Firebase Auth
- Separate landing, login, and signup pages
- Real-time issue creation, editing, filtering, and deletion
- Smart duplicate/similar issue detection on creation
- Enforced status workflow (cannot go directly from Open → Done)
- Priority levels (Low, Medium, High) with combined filtering
- Responsive two-column dashboard: form on left, issues on right
- Password visibility toggle (eye icon) on login/signup
- Confirmation modal for safe issue deletion
- Fixed navbar with smooth scrolling and proper routing
- Fully responsive, clean, and professional UI

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Pure CSS (custom design)
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Authentication & Database**: Firebase (Auth + Firestore)
- **Smooth Scrolling**: react-scroll
- **Deployment**: Vercel

## Frontend Stack Used 

I selected **React with Vite** for the following reasons:

- **Blazing Fast Development**: Vite provides instant server startup and ultra-fast Hot Module Replacement (HMR), significantly speeding up the development cycle compared to Create React App.
- **Modern Tooling**: Native support for ES modules, environment variables (`VITE_` prefix), and optimal production builds.
- **Full Control Over Design**: I avoided external UI libraries (e.g., Material-UI, Tailwind) to create a completely custom, lightweight, and professional design using pure CSS.
- **Zero-Config Deployment**: Vercel automatically detects and optimally builds Vite projects.
- **Efficient State Management**: React Context + Hooks handled global authentication state cleanly without adding Redux overhead.

This stack enabled rapid iteration, excellent performance, and a polished final product within the given timeframe.

## Firestore  Data structure

All issues are stored in a single top-level collection named **`smart-issue-board`**.

Each document has this structure:

```json
{
  "title": string (required),
  "description": string,
  "priority": "Low" | "Medium" | "High",
  "status": "Open" | "In Progress" | "Done",
  "assignedTo": string (optional),
  "createdBy": string (creator's email),
  "createdByUid": string (creator's UID for security),
  "createdAt": timestamp (server-generated)
}

```

