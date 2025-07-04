# Heal-Gen: AI-Powered Health Assistant

**Heal-Gen** is a GenAI-powered healthcare platform that enables users to describe their symptoms and receive personalized medical advice. The system leverages intelligent machine learning models to offer evidence-based recommendations, health tips, lifestyle advice, and preventive care suggestions. The platform includes chat, forums, real-time notifications, and a social network for users and verified doctors.

## High-Level Architecture

* **Backend**: Django (5) with PostgreSQL database, using Django REST Framework for API endpoints
* **Frontend**: React (19) with modern hooks and state management
* **Authentication**: JWT-based security with email verification
* **Communication**: Real-time chat system (Socket.IO) and community forum

---

## Requirements & Technologies

### Backend Stack

* **Python 3.13**
* **Django 5**
* **Django REST Framework**
* **PostgreSQL**
* **Additional Packages**:

  * `django-cors-headers` for CORS management
  * `Pillow` for image processing
  * `python-dotenv` for environment variables
  * `psycopg2-binary` for PostgreSQL adapter
  * `gunicorn` for production WSGI

### Frontend Stack
- **React (Latest stable)**
- **Tailwind CSS**
- **React Context API** – Global state management
- **React Router** – Client-side routing
- **Axios** – API communication
- **React Query** – Remote data handling



### Development Tooling

* **Node.js 16+**
* **npm 8+**
* **Python virtualenv**
* **pip / virtualenv**
* **PostgreSQL client**


---

## Installation & Running Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/HasanOmarHasan/MoreHealth.git
   cd MoreHealth
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate    # Linux/macOS
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

   * Create a `.env` in the `backend/` directory with:

     ```ini
     DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/morehealth_db
     JWT_SECRET=your_jwt_secret_key
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_HOST_USER=your_email@gmail.com
     EMAIL_HOST_PASSWORD=your_app_password
     ```
   * Apply migrations and start server:

     ```bash
     python manage.py migrate
     python manage.py runserver
     ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install      # or yarn install
   ```

   * Create a `.env` in the `client/` directory:

     ```ini
     REACT_APP_API_URL=http://localhost:8000/api
     ```
   * Start the React development server:

     ```bash
     npm start        # or yarn start
     ```

4. **Access the Application**

   * Frontend: `http://localhost:3000/`
   * API Base: `http://localhost:8000/`

     

---


## API Endpoints

### Authentication
- `POST /auth/signup-doctor/` - Doctor registration
- `POST /auth/signup/` - Regular user registration
- `POST /auth/login/` - User login
- `GET /auth/test-token/` - Token validation

### Chat System
- `GET /chat/chat-rooms/` - List chat rooms
- `POST /chat/start-chat/<int:user_id>/` - Start private chat
- `GET /chat/messages/<int:room_id>/` - Room messages

### Friends Management
- `GET /chat/friends/` - List friends
- `POST /chat/friends/<int:user_id>/` - Add friend
- `GET /chat/friend-requests/` - List friend requests
- `PUT/DELETE /chat/friend-requests/<int:pk>/` - Manage requests

### Community Forum
- `GET/POST /groups/` - List/create groups
- `GET/PUT/DELETE /groups/<int:pk>/` - Group details
- `POST /groups/<int:pk>/join/` - Join/leave group
- `GET/POST /groups/<int:group_pk>/questions/` - Group questions
- `GET/PUT/DELETE /questions/<int:pk>/` - Question details
- `GET/POST /questions/<int:question_pk>/comments/` - Question comments
- `GET/PUT/DELETE /comments/<int:pk>/` - Comment details
- `GET/POST /comments/<int:parent_pk>/replies/` - Comment replies
- `POST /upvote/<str:model_type>/<int:pk>/` - Upvote content



---

## Analytics with Vercel

We utilize Vercel's built-in analytics suite to monitor and optimize application performance:

1. **Performance Metrics**
   - Real-time Core Web Vitals tracking
   - Server response time monitoring
   - Client-side rendering performance
   - Resource loading optimization

2. **User Engagement**
   - Active session tracking
   - User retention analysis
   - Feature adoption rates
   - Popular content identification

3. **Error Monitoring**
   - Client-side error logging
   - API failure rate tracking
   - Performance regression alerts

4. **Traffic Analysis**
   - Geographical user distribution
   - Device and browser statistics
   - Traffic source attribution

---

## Key Features

### User Management
- Role-based registration (User/Doctor)
- JWT authentication with refresh tokens
- Email verification workflow
- Password reset functionality
- Profile management with avatar upload

### Health Assistant
- Symptom analysis via GenAI
- Personalized treatment recommendations
- Medication information database
- Preventive care suggestions

### Social Features
- Friend system with request management
- Real-time notifications (Socket.IO)
- Activity feed with friend updates
- 1:1 encrypted messaging with history
- Online status indicators

### Community Forum
- Topic-based discussion groups
- Q&A system with threaded replies
- Content voting system
- Advanced search functionality
- Edit history tracking
- Content moderation tools

### Doctor Verification
- Admin dashboard for credential validation
- Certification review system
- Role-based permissions
- Approval/rejection workflow

---

## Live Demo
[Heal-Gen Live Application](https://heal-gen.vercel.app/)  



