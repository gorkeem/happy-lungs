# HappyLungs - Quit Smoking Companion

## Overview

**HappyLungs** is a full-stack web application designed to help users quit smoking by tracking their progress and providing a supportive community. Built with **React (Frontend)** and **Django (Backend)**, it features a personalized dashboard that displays key statistics such as days smoke-free, money saved, and health improvements. Users can also engage in discussions through a forum for motivation and support.

## Live Demo Link

-   [Live Demo](https://happy-lungs.onrender.com)

## Features

-   **User authentication** (signup, login, logout)
-   **Personalized dashboard** tracking:
    -   Days since quitting
    -   Money saved
    -   Cigarettes avoided
    -   CO level improvements
    -   Milestone achievements
-   **Forum for discussions & support**
-   **Pagination**
-   **Profile settings** (update username, email, quit date, smoking habits, delete account)
-   **Responsive UI** with **Tailwind CSS** and **DaisyUI**
-   **Dark/Light Theme** toggle
-   **API Trottling**

## Tech Stack

### Frontend:

-   React
-   Zustand (State Management)
-   Tailwind CSS (Styling)
-   Framer Motion (Animations)

### Backend:

-   Django
-   Django REST Framework (API)
-   PostgreSQL (Database)
-   Render (Deployment)

## Installation & Setup

### Prerequisites

Ensure you have **Node.js**, **Python**, and **PostgreSQL** installed on your machine.

### Steps to Run Locally

1. **Clone the Repository**

    ```sh
    git clone https://github.com/gorkeem/happy-lungs.git
    cd happylungs
    ```

2. **Set Up Backend**

    ```sh
    cd backend/
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add:

    ```env
    SECRET_KEY=your_django_secret_key
    DATABASE_URL=your_postgresql_connection_string
    DEBUG=should_be_true_if_running_locally
    ```

4. **Run Migrations & Start Backend Server**

    ```sh
    python manage.py migrate
    python manage.py runserver
    ```

5. **Set Up Frontend**

    ```sh
    cd frontend/
    npm install
    npm run dev
    ```

6. **Build for Production**
    ```sh
    npm run build
    ```

## Future Enhancements

-   Gamification (Badges & Rewards)
-   Daily motivation tips
-   AI-powered health insights
-   Mobile app version

## Screenshots

-   **Welcome Page**
    ![WelcomePage](screenshots/welcome_page.png?raw=true "Welcome Page")
-   **Signup Page**
    ![Signup1](screenshots/signup_page_1.png?raw=true "Signup Page")
    ![Signup2](screenshots/signup_page_2.png?raw=true "Signup Page")
-   **Login Page**
    ![Login](screenshots/login_page.png?raw=true "Login Page")
-   **Home Page**
    ![HomePage](screenshots/homepage_stats.png?raw=true "Home Page")
-   **Settings**
    ![Settings](screenshots/settings_page.png?raw=true "Settings Page")
-   **Relapse**
    ![Relapse](screenshots/confirm_relapse.png?raw=true "Relapse")
-   **Delete Account**
    ![Delete Account](screenshots/confirm_delete_account.png?raw=true "Delete Account")
-   **Leaderboard Page**
    ![Leaderboard](screenshots/leaderboard_page.png?raw=true "Leaderboard")
-   **User Profiles**
    ![UserProfiles](screenshots/public_user_stats.png?raw=true "User Profiles")
-   **Community**
    ![Community](screenshots/community_page.png?raw=true "Community")
-   **Create a Post**
    ![CreatePost](screenshots/create_a_post.png?raw=true "Create a Post")
-   **Filter Posts**
    ![FilterPost](screenshots/filter_posts.png?raw=true "Filter Posts")
-   **Search Posts**
    ![SearchPosts](screenshots/search_post.png?raw=true "Search Posts")
-   **Comments and Like Functionality**
    ![CommentsAndLike](screenshots/like_unlike_comments.png?raw=true "Comments and Like Functionality")
-   **Pagination**
    ![Pagination](screenshots/pagination.png?raw=true "Pagination")
-   **Light/Dark Theme**
    ![LightDarkTheme](screenshots/light_theme_dark_theme.png?raw=true "Light/Dark Theme")

---

## Contributing

Feel free to open issues or pull requests to improve **HappyLungs**!
