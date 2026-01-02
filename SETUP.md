# Mini File Explorer Setup Guide

## Project Structure

```
mini-file-explorer/
├── backend/                 # Node.js/Express backend
│   ├── models/
│   │   └── File.js         # MongoDB schema
│   ├── controllers/
│   │   └── fileController.js
│   ├── services/
│   │   └── fileService.js
│   ├── routes/
│   │   └── fileRoutes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/
│   │   └── validators.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/                # Next.js/React frontend
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── globals.css
    │   └── styles.css
    ├── components/
    │   ├── sidebar.tsx
    │   ├── main-panel.tsx
    │   ├── tree-view.tsx
    │   ├── tree-node.tsx
    │   ├── file-content.tsx
    │   ├── folder-content.tsx
    │   ├── breadcrumb.tsx
    │   └── modals/
    │       ├── create-item-modal.tsx
    │       └── rename-modal.tsx
    ├── lib/
    │   └── api.ts
    ├── .env.local
    └── package.json
```

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
MONGO_URI=mongodb://localhost:27017/mini-file-explorer
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### API Endpoints

**Root Items**
- GET `/api/files/root` - Get all root items

**Folder Navigation**
- GET `/api/files/parent/:parentId` - Get children of a folder
- GET `/api/files/:id` - Get item details
- GET `/api/files/:id/path` - Get breadcrumb path

**File Operations**
- POST `/api/files` - Create new file/folder
- PUT `/api/files/:id/rename` - Rename item
- PUT `/api/files/:id/content` - Update file content
- PUT `/api/files/:id/move` - Move item to another folder
- DELETE `/api/files/:id` - Delete item

**Utilities**
- GET `/api/files/search?query=term` - Search files
- GET `/api/files/:id/stats` - Get folder statistics

## Frontend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

### Core Features
- Create folders and files (text, images)
- Rename files and folders
- Delete files and folders (with cascade delete for folders)
- Navigate through folder hierarchy
- View and edit text file content
- Preview image files
- Search files by name

### UI Components
- **Sidebar Tree View:** Expandable folder hierarchy
- **Main Panel:** Content display and management
- **Breadcrumb Navigation:** Shows current path
- **Modal Dialogs:** Create and rename operations
- **Inline Editing:** Edit text file content directly

## Usage

1. Start backend server
2. Start frontend development server
3. Open `http://localhost:3000` in browser
4. Create folders and files using the "New Item" button
5. Click on items to view their content
6. Use rename and delete buttons to manage items
7. Edit text files directly in the main panel

## File Types

- **Folder:** Container for other items
- **Text File:** Editable content (supports .txt, .md, .json, etc.)
- **Image File:** Preview mode with image display

## Error Handling

The application includes:
- Input validation on both frontend and backend
- Duplicate name prevention in same folder
- Cycle detection for folder moves
- Graceful error messages to users
- Middleware error handling on backend

## Notes

- File content is stored as strings in MongoDB
- Images should be stored as base64 strings
- Folder deletion cascades to all children
- MongoDB indexes optimize query performance
- CORS is enabled for local development
