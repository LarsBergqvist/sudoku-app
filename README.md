# sudoku-app


## Project Setup
```bash
npm install
npm run dev
```

## Mock API

By default, the app uses a mock API to fetch random sudoku puzzles from a predefined set. The mock data is located in the `src/mocks/sudokuData.ts` file.

## Use the real API

To use the real API, you need to clone the sudoku-puzzler api (C#, NET8)and run it locally:

```bash
git clone https://github.com/LarsBergqvist/sudoku-puzzler.git
cd sudoku-puzzler
dotnet build
dotnet run --project ./Sudoku.Web/Sudoku.Web.csproj
```

If needed, set the `VITE_API_URL` environment variable so that is points to the locally hosted API URL.

```bash
VITE_API_URL=http://localhost:5000
```

In .env in the sudoku-app project, set the VITE_USE_MOCK_API to false.

```bash
VITE_USE_MOCK_API=false
```





