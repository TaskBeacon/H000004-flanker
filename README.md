# H000004 Flanker

HTML/browser preview of the Flanker task built with `psyflow-web`.
The within-trial procedure, condition semantics, response rules, timing model, and instruction flow are aligned to local `T000004-flanker`; only block/trial count is shortened for preview.

## Layout

- `main.ts`: task-level orchestration
- `config/config.yaml`: declarative config
- `src/run_trial.ts`: trial logic
- `src/utils.ts`: block summary helper

## Run

From `e:\xhmhc\TaskBeacon\psyflow-web`:

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:4173/?task=H000004-flanker
```
