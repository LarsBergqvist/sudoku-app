# sudoku-app

![Build and deploy](https://github.com/larsbergqvist/sudoku-app/actions/workflows/deploy.yml/badge.svg)

<img src="https://github.com/LarsBergqvist/sudoku-app/blob/main/screenshot1.jpeg" alt="App screenshot" style="width:50%; height:auto;">

## Project Setup
```bash
git clone https://github.com/LarsBergqvist/sudoku-app.git
cd sudoku-app
npm install
npm run dev
```

## Mock API

By default, the app uses a mock API to fetch a random sudoku puzzle with a specified difficulty level from a predefined set. The mock data is located in the `src/mocks/sudokuData.ts` file.

## Use the real API

To use the real API, you need to clone the sudoku-puzzler api (C#, NET8) and run it locally:

```bash
git clone https://github.com/LarsBergqvist/sudoku-puzzler.git
cd sudoku-puzzler
dotnet build
dotnet run --project ./Sudoku.Web/Sudoku.Web.csproj
```

If needed, set the `VITE_API_URL` environment variable for the sudoku-app so that is points to the locally hosted API URL.

```bash
VITE_API_URL=http://localhost:5000
```

In .env in the sudoku-app project, set the VITE_USE_MOCK_API to false.

```bash
VITE_USE_MOCK_API=false
```





