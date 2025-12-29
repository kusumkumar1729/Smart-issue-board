# Smart Issue Board

A modern, intelligent issue tracking application built with React, Vite, and Firebase. It provides teams with real-time issue management, duplicate detection, workflow enforcement, and a professional user experience.

**Live Demo**: [https://smart-issue-board-123.vercel.app/](https://smart-issue-board-123.vercel.app/)

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

## Firestore Security Rules: 
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.createdBy == request.auth.token.email;
      allow update, delete: if request.auth != null && resource.data.createdByUid == request.auth.uid;
    }
  }
}

```

## How I handled similar issues : 
To prevent duplicate issues, the app performs client-side similarity detection when creating a new issue :
### Algorithm :
1. Fetch the 50 most recent issues (limits Firestore reads).
2. Compare the new title against existing titles using:
      - Substring matching (both directions)
      - Jaccard similarity on word sets (threshold > 0.6)
3. If any match is found → display a warning modal listing similar issues.
4. User can Cancel or Proceed Anyway.

## Challenges : 
- Vite Environment Variables: Initially used REACT_APP_ prefix (habit from Create React App), causing Firebase config to be undefined. Fixed by switching to VITE_ and correctly configuring them in Vercel.
- Routing vs Smooth Scrolling: Using react-scroll for internal section links while needing react-router-dom for external routes required careful separation of Link components.
- Status Transition Validation on Edit: Tracking the original status during editing to prevent invalid transitions (e.g., Open → Done) needed extra state management.
- Two-Column Dashboard Layout: Achieving a clean, responsive layout with the form on the left and issues on the right with perfect alignment took several CSS iterations.
- Git Conflicts: Encountered "refusing to merge unrelated histories" error due to GitHub initializing the repo with default files — resolved with a force push.
- Password Visibility Toggle: Positioning the eye icon inside inputs across browsers required precise relative/absolute CSS.

## Future improvements : 
- User list with dropdown for easier "Assigned To" selection
- Threaded comments on individual issues
- Full-text search across titles and descriptions
- Dedicated issue detail page with activity history
- Dark mode toggle
- Kanban board view with drag-and-drop
- Email notifications for assignments
- Pagination or infinite scroll for large datasets
- Loading skeletons for better UX
- Comprehensive testing (unit + integration)

#### Built with passion using React, Vite, Firebase, and pure CSS.
This project was a rewarding challenge in full-stack development, real-time data, UI/UX design, and practical decision-making under constraints. Thank you for the opportunity!

