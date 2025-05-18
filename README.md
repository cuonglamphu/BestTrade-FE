# TradingView Frontend

A modern frontend application for trading view and analysis.

## 🚀 Quick Start

### Prerequisites

-   Node.js 18 or higher
-   npm or yarn
-   Docker (optional, for containerization)

### Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add necessary environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Setup

To run the application using Docker:

1. Build the Docker image:

```bash
docker build -t tradingview-frontend .
```

2. Run the container:

```bash
docker run -p 80:80 tradingview-frontend
```

The application will be available at `http://localhost`

## 📦 Build

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## 🛠️ Development

### Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── App.tsx
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

### Code Style

-   We follow modern React best practices
-   Use TypeScript for type safety
-   Follow ESLint and Prettier configurations

## 🔧 Available Scripts

-   `npm start` - Runs the app in development mode
-   `npm run build` - Builds the app for production
-   `npm run lint` - Runs ESLint
-   `npm run format` - Formats code with Prettier

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
