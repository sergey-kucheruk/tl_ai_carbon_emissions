# Carbon Emissions Calculator

A Next.js Single Page Application (SPA) for calculating and tracking carbon emissions with comprehensive data visualization and history management.

## Features

- 🔐 **Authentication**: Login/password authentication with JWT tokens and MySQL database
- 👤 **User Types**: Support for Personal and Business accounts
- 🌍 **Multi-language Support**: Supports English, Polish, Slovak, German, Italian, and Croatian
- 🌐 **Auto Language Detection**: Automatically detects browser language on first visit
- 💾 **Calculation History**: Save, view, and manage your carbon footprint calculations
- 📊 **Data Visualization**: 
  - List view for detailed calculation history
  - Interactive charts with bar and line chart options
  - Linear and logarithmic Y-axis scales
  - Click on chart elements to view calculation details
- 📄 **PDF Export**: Download calculation results as PDF reports
- 🎨 **Modern UI**: Beautiful green-themed design using Tailwind CSS
- 📱 **Responsive**: Works seamlessly on all device sizes
- 💾 **Persistent Preferences**: View mode, chart type, and scale preferences saved in localStorage

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React 19** for UI components
- **Recharts** for data visualization
- **jsPDF** for PDF generation
- **MySQL** for database storage
- **bcryptjs** for password hashing
- **jsonwebtoken** for authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (recommended) OR MySQL 8.0+ installed and running

### Installation

#### Option 1: Using Docker Compose (Recommended)

1. Install dependencies:
```bash
npm install
```

2. Start everything with Docker Compose:
```bash
docker-compose up --build -d
```
This will:
- Start MySQL 8.0 container
- Create the `carbon_emissions` database
- Initialize the database schema automatically
- Expose MySQL on port 3306
- Prepare production-ready image of application
- Expose application on port 3000


3. Open [http://localhost:3000](http://localhost:3000) in your browser


#### Option 2: Manual MySQL Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your MySQL database configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=carbon_emissions
   JWT_SECRET=your-secret-key-here
   ```

3. Initialize the database:
   - Make sure MySQL is running
   - Create the database (if it doesn't exist):
   ```sql
   CREATE DATABASE carbon_emissions;
   ```
   - Initialize the database schema by visiting:
   ```
   http://localhost:3000/api/init-db
   ```
   Or run the initialization manually using the SQL schema in `lib/backend/repositories/db.ts`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Authentication

- The application shows a login form when first opened
- The main window is blurred until authentication
- **Sign Up**: Click "Sign Up" to create a new account
  - Choose between **Personal** or **Business** account type
  - Personal accounts require: Email, Password, First Name, Last Name
  - Business accounts require: Email, Password, Business Name, Business Description (optional)
- **Login**: Use your email and password to access the application
- After login, you can access the main application
- User information is stored securely in MySQL database with hashed passwords
- JWT tokens are used for session management

### Carbon Footprint Calculation

1. **Start New Calculation**: Click "New Calculation" to begin
2. **Enter Data**: Fill in the wizard forms for:
   - **Scope 1**: Direct emissions (Energy Carriers, Fleet, Refrigerants)
   - **Scope 2**: Indirect emissions from purchased energy (Electricity, District Heating)
   - **Scope 3**: Other indirect emissions (Water, Paper, Waste, Business Travel)
3. **Calculate**: Review and calculate your carbon footprint
4. **View Results**: See detailed breakdown by scope with visual indicators
5. **Save Calculation**: Give your calculation a name and save it for future reference
6. **Export PDF**: Download your calculation results as a PDF report

### Viewing Calculation History

- **List View**: See all your saved calculations in a detailed list format
  - View calculation name, date, and emission totals
  - Click any calculation to view full details
- **Chart View**: Visualize your calculation history with interactive charts
  - **Bar Chart**: Compare emissions across different calculations
  - **Line Chart**: Track emission trends over time
  - **Scale Options**: Switch between linear and logarithmic Y-axis scales
  - Click on chart elements to view calculation details
- **View Preferences**: Your selected view mode (list/chart), chart type (bar/line), and scale (linear/log) are automatically saved and restored

### Language Selection

- Language is automatically detected from your browser settings
- You can manually change the language using the language selector in the header
- Language preference is saved in localStorage
- Supported languages:
  - English (en)
  - Polish (pl)
  - Slovak (sk)
  - German (de)
  - Italian (it)
  - Croatian (hr)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   │   ├── login/      # Login endpoint
│   │   │   └── signup/     # Signup endpoint
│   │   ├── calculate/      # Carbon footprint calculation endpoint
│   │   ├── calculations/   # Calculation CRUD endpoints
│   │   │   └── [id]/       # Individual calculation endpoint
│   │   ├── health/         # Health check endpoint
│   │   └── init-db/        # Database initialization endpoint
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── auth/
│   │   └── LoginForm.tsx   # Authentication form
│   ├── calculations/
│   │   ├── PreviousCalculations.tsx  # Main calculations container
│   │   ├── CalculationsListView.tsx  # List view component
│   │   └── CalculationsChartView.tsx # Chart view component
│   ├── common/
│   │   ├── LanguageSwitcher.tsx      # Language selector
│   │   └── Toast.tsx                 # Toast notifications
│   └── wizard/
│       ├── CarbonFootprintWizard.tsx  # Main calculation wizard
│       ├── CalculationView.tsx       # View saved calculation
│       ├── ResultsView.tsx            # Results display
│       ├── CollapsibleInformation.tsx # Information panel
│       ├── forms/
│       │   ├── Scope1Form.tsx         # Scope 1 input form
│       │   ├── Scope2Form.tsx         # Scope 2 input form
│       │   └── Scope3Form.tsx         # Scope 3 input form
│       └── modals/
│           └── CalculationNameModal.tsx # Save calculation modal
├── lib/                     # Utilities and providers
│   ├── backend/
│   │   ├── calculations/    # Carbon footprint calculation logic
│   │   │   ├── co2e.ts     # Global CO2e formula
│   │   │   ├── scope1.ts   # Scope 1 calculations
│   │   │   ├── scope2.ts   # Scope 2 calculations
│   │   │   ├── scope3.ts   # Scope 3 calculations
│   │   │   ├── constants.ts # Conversion factors
│   │   │   └── index.ts    # Main calculation function
│   │   ├── auth/           # Authentication utilities
│   │   │   ├── jwt.ts      # JWT token handling
│   │   │   └── middleware.ts # Auth middleware
│   │   ├── repositories/   # Database repositories
│   │   │   ├── mysql-calculations-repository.ts
│   │   │   ├── mysql-users-repository.ts
│   │   │   └── db.ts       # Database connection
│   │   ├── security/
│   │   │   └── password-hasher.ts # Password hashing
│   │   └── interfaces/     # Repository interfaces
│   ├── models/              # Data models
│   │   ├── calculation.ts   # Calculation types
│   │   └── user.ts          # User types
│   ├── providers/           # React context providers
│   │   ├── auth.tsx         # Authentication context
│   │   └── locale.tsx       # Locale context
│   ├── utils/
│   │   └── pdf.ts           # PDF generation utilities
│   └── i18n.ts              # Internationalization utilities
└── i18n/                    # Translation files
    ├── config.ts            # Locale configuration
    └── messages/            # Translation JSON files
        ├── en.json
        ├── pl.json
        ├── sk.json
        ├── de.json
        ├── it.json
        └── hr.json
```

## Carbon Footprint Calculation

The application includes a comprehensive carbon footprint calculation system that follows standard GHG Protocol scopes:

- **Scope 1**: Direct emissions (Energy Carriers, Fleet, Refrigerants)
- **Scope 2**: Indirect emissions from purchased energy (Electricity, District Heating)
- **Scope 3**: Other indirect emissions (Water, Paper, Waste, Business Travel)

### API Endpoints

**POST** `/api/calculate`
- Calculate carbon footprint from input data
- Returns detailed breakdown by scope

**GET** `/api/calculations`
- Retrieve all calculations for the authenticated user
- Returns list of calculation summaries

**GET** `/api/calculations/[id]`
- Retrieve a specific calculation by ID
- Returns full calculation data including inputs and results

**POST** `/api/calculations`
- Save a new calculation
- Requires calculation name and result data

See `lib/backend/calculations/README.md` for detailed documentation on the calculation API and input/output formats.

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Docker Setup

The project includes a `docker-compose.yml` file for easy MySQL setup:

- **Default MySQL root password**: `rootpassword`
- **App user**: `app_user` / `app_password`
- **Database name**: `carbon_emissions`
- **Port**: `3306`

The database schema is automatically initialized when the container starts for the first time.

To customize the MySQL configuration, edit the `docker-compose.yml` file and update the environment variables accordingly.

## Environment Variables

Required environment variables:

- `DB_HOST`: MySQL host (default: localhost)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: carbon_emissions)
- `JWT_SECRET`: Secret key for JWT token signing (required for authentication)

## License

ISC
