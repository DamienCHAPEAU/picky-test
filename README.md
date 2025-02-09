# Image Management & Compression Mini-App

## Setup and Installation

### Prerequisites

Before running the application, ensure you have the following installed on your system:

- Docker
- Docker Compose

### Installation Steps

1. **Clone the Repository**

   ```sh
   git clone https://github.com/DamienCHAPEAU/picky-test.git
   ```

2. **Navigate to the Project Directory**

   ```sh
   cd picky-test
   ```

3. **Start the Application**

   ```sh
   docker compose up --build
   ```

4. **Access the Application**

   - The application will be running at: `http://localhost:3000`
   - The Minio dashboard is accessible at: `http://localhost:9001`
     - Use the following credentials:
       - **Access Key**: `minio`
       - **Secret Key**: `miniosecret`

---

## Architectural Decisions and Reasoning

This application is designed as a simple image upload and compression app. It allows users to upload images via a frontend interface, processes them on a backend server, and stores them in a Minio bucket to simulate an S3-compatible object storage service.

### Frontend

- Built with **Next.js**.
- Uses **Shadcn UI** for UI components: Button and Toast.
- Implemented `react-dropzone` for drag-and-drop file uploads.
- Styled with **Tailwind CSS**.

### Backend

- **Next.js API routes** are used to handle images uploads and images compression.
- **Zod** is used to parse and validate request body.
- `@t3-oss/env-nextjs` helps manage environment variables fully typed.
- **Sharp** is used to resize images to `200x200` pixels.
- **SQLite** is used as a simple database to store images metadata.
- **Drizzle ORM** to interact with the SQLite database type safely.

### Bucket (S3 Simulation with Minio)

- **Minio** is used as an S3-compatible object storage service for local development.
- The bucket is **public by default** for easy access in this mini-app.
  - In real-world scenarios, it should be **private** with file access controlled via a CDN or signed URLs.
- File uploads follow a **backend upload approach** (server handles the upload to Minio).
  - A better alternative for production would be to use **presigned URLs**, allowing clients to upload directly to Minio/S3.

---

## Assumptions and Limitations

- The application is designed for **local development** and **not for production use**.
- Only supports **single-file uploads only**.
- The backend handles images uploads, which could be optimized using **presigned URLs**.

---

## AI Assistance and Tools Used

- **GitHub Copilot** is installed on my VS Code and can help with code suggestions.
- **Chat gpt** helped me to generate my README.md file content in a more concise way.

---

## Future Improvements that could be made

- **Multiple File Uploads**: Allow users to upload multiple files at once.
- **Image Compression Options**: Allow users to choose the compression level.
