# MyBudget AU Technical Test

Technical exam built on Angular v21, NgRx Signals, Nrwl Nx and many more.

## Installing Packages

To install project dependencies, please use `pnpm`:

```shell
pnpm install
```

## Run tasks

To run the dev server for your app, use:

```sh
pnpm exec nx serve mybudget-au-technical-test
```

To create a production bundle:

```sh
pnpm exec nx build mybudget-au-technical-test
```

To run unit tests powered by `vitest`:

```sh
pnpm exec nx test mybudget-au-technical-test
```

To see all available targets to run for a project, run:

```sh
pnpm exec nx show project mybudget-au-technical-test
```

## Generation

This project was bootstrapped using the command:

```shell
npx create-nx-workspace@latest mybudget-au-technical-test \
    --preset=angular-standalone \
    --package-manager=pnpm \
    --style=scss \
    --bundler=esbuild \
    --unitTestRunner=vitest \
    --skipGit \
    --ci=skip \
    --prefix=mbau \
    --ssr=false \
    --e2eTestRunner=playwright

pnpm exec nx g @nx/angular:component --path=src/app/layout/components/navbar/navbar

pnpm exec nx g @nx/angular:component --path=src/app/task-management/task-list/feature/containers/task-list/task-list

pnpm exec nx g @nx/angular:component \
    --path=src/app/task-management/task-details/feature/containers/task-details/task-details \
    --skipTests=true

pnpm exec nx g @nx/angular:component \
    --path=src/app/task-management/task-list/feature/components/task-card/task-card \
    --skipTests=true

pnpm exec nx g @nx/angular:component \
    --path=src/app/task-management/task-list/feature/components/sort-control/sort-control \
    --skipTests=true

pnpm exec nx g @nx/angular:component --path=src/app/ui-kit/status-badge/status-badge

pnpm exec nx g @nx/angular:directive --path=src/app/layout/directives/router-based-control

pnpm exec nx g @nx/angular:component --path=src/app/ui-kit/task-form/task-form
```
