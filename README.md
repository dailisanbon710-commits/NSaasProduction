
# SaaS Call Analytics Dashboard

A comprehensive SaaS platform for analyzing sales call performance with AI-powered coaching insights and real-time analytics.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **AI Integration**: OpenAI API for call analysis and coaching
- **Workflow Automation**: N8N for email notifications
- **Authentication**: Supabase Auth

## Features

- Call recording and transcription analysis
- AI-powered performance coaching
- Sales rep performance metrics
- Real-time dashboard updates
- Call enrichment with AI insights
- Email notifications via N8N integration
- Interactive data visualizations

## Project Structure

```
src/
├── app/              # Main application components
├── components/       # Reusable React components
├── services/         # API and service integrations
├── styles/           # CSS and theme configuration
└── utils/            # Utility functions

supabase/
├── functions/        # Edge functions
└── migrations/       # Database migrations

scripts/              # TypeScript utility scripts
```

## Environment Setup

1. Clone the repository
2. Create `.env.local` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
   - `VITE_N8N_WEBHOOK_URL`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Database

PostgreSQL database managed through Supabase with migrations in `supabase/migrations/`.

### Key Tables
- `users` - User accounts and profiles
- `calls` - Call records with metadata
- `transcripts` - Call transcriptions
- `ai_analysis` - AI-generated insights
- `scheduled_calls` - Upcoming call bookings

## API Integration

### Supabase
- Real-time data sync
- User authentication
- PostgreSQL database

### OpenAI
- Call transcription analysis
- Performance coaching generation
- Insight extraction

### N8N
- Email notification workflows
- Call analysis triggers
- Data enrichment processes

## Docker

Build and run with Docker:

```bash
docker-compose up --build
```

See `docker-compose.yml` for configuration.

## Build & Deploy

```bash
npm run build
```

Output goes to `dist/` directory, ready for deployment.

## License

All rights reserved.
  