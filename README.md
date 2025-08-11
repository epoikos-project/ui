This is the simulation UI for the [EpOikoS project](https://github.com/epoikos-project/simulation).

## Getting Started

### Run the Backend

Make sure you have the EpOikoS backend running. You can find instructions in the [EpOikoS Backend repository](https://github.com/epoikos-project/simulation). Without it, the UI will not function properly.

### Installation

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install # if you use bun
```

### Environment Variables
You will need to create a `.env.local` file in the root of the project to set up environment variables. You can copy the example file:

```bash
cp .env.example .env.local
```

### Running the UI

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
