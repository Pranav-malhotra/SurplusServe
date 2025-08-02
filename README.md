
<img width="1919" height="964" alt="Screenshot 2025-08-02 141748" src="https://github.com/user-attachments/assets/063e702a-5763-48e9-8096-5b39fba2ed68" />
<img width="1915" height="966" alt="Screenshot 2025-08-02 141736" src="https://github.com/user-attachments/assets/b78b1254-2037-4f67-8a0f-7bd0ad50858f" />
<img width="1919" height="963" alt="Screenshot 2025-08-02 141707" src="https://github.com/user-attachments/assets/4a75dba6-f25e-4a14-a1b3-74a34765435b" />
<img width="1919" height="971" alt="Screenshot 2025-08-02 141759" src="https://github.com/user-attachments/assets/5dd1d51c-04d9-4f26-b917-5872ac3fdc80" />

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- JavaScript
- React
- shadcn-ui
- Tailwind CSS


# Backend (FastAPI)

This project includes a FastAPI backend to power predictive food shorting, surplus management, user authentication, and analytics for SurplusServe. The backend uses PostgreSQL for persistent storage and exposes a REST API for the React frontend.

## How to Run

1. Create a `.env` file in the `backend/` directory with your database URL and secret key (see backend/README.md for details).
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `uvicorn backend.main:app --reload`


