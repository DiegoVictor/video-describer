# Video Describer
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/video-desriber?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/video-desriber)
[![typescript](https://img.shields.io/badge/typescript-5.2.2-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![eslint](https://img.shields.io/badge/eslint-8.50.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/video-describer?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/video-describer)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/video-describer/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Video%20Describer&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fvideo-describer%2Fmain%2FInsomnia_2023-09-14.json)

Allow users to upload a `.mp3` file and get a transcription of the audio and later to send a prompt requesting to Open AI API to generate a text following the prompt rules.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use just one database: [SQLite](https://www.sqlite.org/index.html). For the fastest setup is recommended to use [docker-compose](https://docs.docker.com/compose/), you just need to up all services:
```
$ docker-compose up -d
```

### Migrations
Remember to run the database migrations:
```
$ npx prisma migrate dev
```
> See more information on [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### .env
In this file you may configure your Postgres, MongoDB and Redis database connection, JWT settings, email and storage driver and app's urls. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|DATABASE_URL|Database connection Url.|`file:./dev.db`
|OPENAI_API_KEY|Open AI API Key| -
> Refer to [Where do I find my Secret API Key?](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to get/generate your `OPENAI_API_KEY`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Routes
|route|HTTP Method|params|description
|:---|:---:|:---:|:---:
|`/prompts`|GET| - |Return available prompts.
|`/upload`|POST|Multipart payload with a `file` field with a `mp3` file.|Upload `mp3` file.
|`/videos/:id/transcription`|POST|`id` query parameter and body with a `prompt` of keywords|Request video (`mp3` file) transcription.
|`/videos/:id/generate`|POST|`id` query parameter and body with the `prompt` and `temperature`.|Generate an ouput based in the prompt and temperature sent.

### Requests
* `POST /upload`

MP3 file

* `POST /videos/:id/transcription`

Request body:
```json
{
  "prompt": "skate, skateboarding, BASAC",
}
```

* `POST /videos/:id/generate`

Request body:
```json
{
  "prompt": "Generate a small summary for the following text: '''\n{transcription}\n'''",
  "temperature": 0.5
}
```
> `{transcription}` is a placeholder for the transcription generated in the previous route.

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
