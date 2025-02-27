![Screenshot (463)](https://github.com/user-attachments/assets/95ff48ba-e78e-4966-910a-2573425a9e52)
![Screenshot (462)](https://github.com/user-attachments/assets/fa3c3b94-c366-4077-9b46-162016c296ea)
![Screenshot (461)](https://github.com/user-attachments/assets/9db50a60-a720-404f-9960-652947b3385a)
# Candidate Application Form

This is a web-based candidate application form that allows users to submit their job applications with details like name, email, LinkedIn profile, skills, and a resume upload option.

## Features
- User-friendly form for job applications
- Resume upload functionality (PDF only)
- Form validation for required fields
- Data submission via `fetch` to a backend API
- Automatic form reset after submission

## Technologies Used
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js (Assumed API for handling form submissions)

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v14+ recommended)
- npm or yarn

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/candidate-application-form.git
   cd candidate-application-form
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
4. Open `http://localhost:5173/` in your browser to access the form.

## Form Fields
- **Name** (Text input, required)
- **Email** (Email input, required)
- **LinkedIn URL** (URL input, required)
- **Resume** (File upload, PDF only, required)
- **Skills & Experience** (Textarea, required)

## Backend API Integration
- The form data is submitted via `POST` request to `/api/submit`.
- Uses `FormData` to send files along with text data.
- On successful submission, a success alert is displayed, and the form is reset.

## How to Contribute
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Make changes and commit:
   ```sh
   git commit -m "Added new feature"
   ```
4. Push to GitHub:
   ```sh
   git push origin feature-branch
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.

---
Made with ❤️ by Keshab Das

