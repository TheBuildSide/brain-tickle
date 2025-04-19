# Today in Focus Share

A web application that lets you explore and share daily historical events, take quizzes, and learn about significant moments in history. Built with modern web technologies.

## Features

- Daily historical events with Wikipedia integration
- Interactive trivia quizzes with randomized questions
- Beautiful UI with dark mode support
- Mobile-friendly design
- Share content as images
- Historical event search and filtering
- Daily quotes integration

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.x (for trivia question processing)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd today-in-focus-share

# Install dependencies
npm install

# Install Python dependencies (for trivia processing)
pip install -r requirements.txt

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```sh
cp .env.example .env.local
```

2. Update the following environment variables in `.env.local`:

```env
# Database Configuration
POSTGRES_URL="your_postgres_url"
POSTGRES_PRISMA_URL="your_prisma_url"
POSTGRES_URL_NON_POOLING="your_non_pooling_url"
POSTGRES_USER="your_postgres_user"
POSTGRES_PASSWORD="your_postgres_password"
POSTGRES_DATABASE="your_database_name"
POSTGRES_HOST="your_host"

# Supabase Configuration
SUPABASE_URL="your_supabase_url"
SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_JWT_SECRET="your_jwt_secret"
```

⚠️ **Security Note**: Never commit `.env.local` to version control. The file is already in `.gitignore`.

### Accessing from Other Devices

To access the development server from other devices on your local network (like your phone):

1. Find your computer's local IP address:
   - On Windows: Open Command Prompt and type `ipconfig`
   - On Mac/Linux: Open Terminal and type `ifconfig` or `ip addr`
   - Look for an IP address that starts with `192.168.` or `10.0.`

2. On your other device, open a browser and navigate to:
   ```
   http://<your-local-ip>:3000
   ```
   For example: `http://192.168.1.100:3000`

Note: Make sure your computer's firewall allows incoming connections on port 3000.

## Technologies Used

This project is built with:

- Next.js 14
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query
- html2canvas
- react-mobile-share
- Python (for trivia processing)

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Trivia Question Processing

The project includes several Python scripts for managing trivia questions:

- `trivia_questions.py` - Core trivia question processing
- `randomize_options.py` - Randomizes quiz options
- `check_duplicates.py` - Checks for duplicate questions
- `update_trivia_dates.py` - Updates question dates

## Deployment

This project can be deployed to any platform that supports Next.js applications, such as:

- Vercel (recommended)
- Netlify
- AWS
- Google Cloud Platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
