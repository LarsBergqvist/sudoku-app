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

To use the real API that generates new random puzzles for every request, you need to clone the sudoku-puzzler api (C#, NET8) and run it locally:

On mac/linux:
```bash
git clone https://github.com/LarsBergqvist/sudoku-puzzler.git
cd sudoku-puzzler
dotnet build
export ASPNETCORE_ENVIRONMENT=Development
dotnet run --project Sudoku.Web/Sudoku.Web.csproj --http_ports "5100" --https_ports "5400"
```

On Windows:
```bash
git clone https://github.com/LarsBergqvist/sudoku-puzzler.git
cd sudoku-puzzler
dotnet build
set ASPNETCORE_ENVIRONMENT=Development
dotnet run --project Sudoku.Web/Sudoku.Web.csproj --http_ports "5100" --https_ports "5400"
```

Then, modify `.env.development` in the sudoku-app project to point to the local API and set VITE_USE_MOCK_API to false.

```bash
VITE_USE_MOCK_API=false
VITE_API_URL='https://localhost:5400'
```






