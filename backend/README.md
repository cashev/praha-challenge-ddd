# PrAha Challege

## 構成

Onion Architectureに基づいて設計しています。  

- domain

  ドメイン層  
  Entity, ValueObject, Repository-Interface

- app

  ユースケース層  
  UseCase, QueryService-Interface

- infra

  インフラ層  
  Repository, QueryService

- controller

  プレゼンテーション層  
  Controller

---

## API Reference

- 参加者

  - GET `/participant`  

    全ての参加者を取得します。

  - POST `/participant/create`  

    参加者を新規に追加、チーム, ペアにアサインし、課題進捗を登録します。

    Request Body
    - name: 名前
    - email: メールアドレス

  - POST `/participant/rejoin`  

    休会中の参加者をペアに割り当てます。

    Request Body
    - participantId: 対象の参加者id

  - POST `/participant/suspend`  

    参加者を休会させ、ペアから取り除きます。

    Request Body
    - participantId: 対象の参加者id

  - POST `/participant/resign`  

    参加者を退会させます。  
    チーム, ペアから取り除きます。

    Request Body
    - participantId: 対象の参加者id

- チーム

  - GET `/team`

    全てのチームを取得します。

- ペア

  - GET `/pair`

    全てのペアを取得します。

- 課題

  - GET `/task`

    全ての課題を取得します。

  - GET `/taskStatus`

    全ての課題の進捗ステータスを取得します。

  - PATCH `/taskStatus`

    課題の進捗ステータスを更新します。

    Request Body  
    - participantId: 対象の参加者id
    - taskId: 対象の課題id 複数指定する場合は
    - status: 参加者ステータス: ["未着手", "レビュー待ち", "完了"]のいづれか

  - POST `/taskStatus`

    特定の課題(複数可能)が特定の進捗ステータスになっている参加者の一覧を取得します。

    Request Body
    - taskIds: 対象の課題id 複数指定する場合は
    - status: 参加者ステータス: ["未着手", "レビュー待ち", "完了"]のいづれか
    - page?: ページ (指定がない場合は1ページ目)
