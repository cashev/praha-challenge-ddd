# praha-challenge-ddd

## PrAha Challenge DDD課題

このRepositoryはPrAha Challengeの課題の成果物です。  

PrAha Challengeを題材としたRest API Serverです。  

### 動かし方

DBを起動する

``` sh
cd .docker
docker compose up
```

DBを初期化する (初回のみ)

``` sh
cd backend
npm run migrate:dev
npm run seed
```

ローカルDBを使ってアプリケーションを起動する

``` sh
npm run start:dev
```
