# Strava Log Overlay (Strava ログオーバーレイアプリ)

<img width="2557" height="1339" alt="image" src="https://github.com/user-attachments/assets/1ebea07f-9e72-4323-9562-41752bb10849" />

## 概要

Stravaのアクティビティデータを可視化し、すべての軌跡をインタラクティブな地図上に表示するウェブアプリケーションです。

## 主な機能

- OAuth 2.0 を利用した Strava API との安全な認証と、認証情報の永続化
- すべての Strava アクティビティを取得し、サーバーサイドでキャッシュ
- 距離と獲得標高によるインタラクティブなフィルター機能
- 地図とリストの双方向連携:
  - リスト項目クリックで、地図が該当アクティビティに移動・ズーム
  - 地図上のアクティビティクリックで、リストが該当項目までスクロール


## セットアップとインストール

以下の手順に従って、ローカル環境でプロジェクトをセットアップ・実行してください。

### 1. リポジトリをクローン

```bash
git clone https://github.com/pplog/strava-log-overlay.git
cd strava-log-overlay
```

### 2. Strava API の設定

<img width="897" height="562" alt="image" src="https://github.com/user-attachments/assets/448ab128-3783-4d10-8cda-7cef19b559f1" />

1.  [Strava API 設定ページ](https://www.strava.com/settings/api) にアクセスし、新しいアプリケーションを作成します。
2.  作成すると **Client ID** と **Client Secret** が発行されます。これらはバックエンドの設定で使用します。
3.  **Authorization Callback Domain** に `localhost` を設定してください。

### 3. バックエンドのセットアップ

1.  `server` ディレクトリに移動します。
    ```bash
    cd server
    ```

2.  依存関係をインストールします。
    ```bash
    npm install
    ```

3.  `server` ディレクトリに `.env` ファイルを新規作成します。このファイルに Strava API の認証情報を保存します。以下の内容をファイルに記述し、`your_client_id` と `your_client_secret` をご自身のものに置き換えてください。
    ```
    STRAVA_CLIENT_ID=your_client_id
    STRAVA_CLIENT_SECRET=your_client_secret
    ```

### 4. フロントエンドのセットアップ

1.  プロジェクトのルートディレクトリから `client` ディレクトリに移動します。
    ```bash
    cd client
    ```

2.  依存関係をインストールします。
    ```bash
    npm install
    ```

## 実行方法

プロジェクトのルートディレクトリで、以下のコマンドを実行します。

```bash
npm run dev
```

これにより、バックエンドサーバー（`http://localhost:3001`）とフロントエンドアプリケーション（`http://localhost:3000`）が同時に起動します。ブラウザで `http://localhost:3000` が自動的に開きます。

### Strava と連携

"Connect with Strava" ボタンをクリックして、アプリケーションを認証します。一度認証すれば、ブラウザを閉じても認証状態が維持されます。

---

# Strava Log Overlay

<img width="2557" height="1339" alt="image" src="https://github.com/user-attachments/assets/1ebea07f-9e72-4323-9562-41752bb10849" />

## Overview

This web application visualizes your Strava activity data, displaying all your activity tracks on an interactive map.

## Features

- Secure authentication with the Strava API using OAuth 2.0, with persistent login.
- Fetches all your Strava activities and caches them on the server-side.
- Interactive filters for distance and elevation gain.
- Bidirectional map-list interaction:
  - Clicking a list item pans and zooms the map to the corresponding activity.
  - Clicking a polyline on the map scrolls the list to the corresponding item.

## Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/pplog/strava-log-overlay.git
cd strava-log-overlay
```

### 2. Strava API Setup

<img width="897" height="562" alt="image" src="https://github.com/user-attachments/assets/31eaade9-b7ec-4ea4-8d9f-41f58c28d377" />


1.  Go to [your Strava API settings page](https://www.strava.com/settings/api) and create a new application.
2.  You will get a **Client ID** and a **Client Secret**. You'll need these for the backend setup.
3.  Under **Authorization Callback Domain**, set it to `localhost`.

### 3. Backend Setup

1.  Navigate to the `server` directory.
    ```bash
    cd server
    ```

2.  Install the dependencies.
    ```bash
    npm install
    ```

3.  Create a new `.env` file in the `server` directory. This file will store your Strava API credentials. Add the following content to the file, replacing `your_client_id` and `your_client_secret` with your own.
    ```
    STRAVA_CLIENT_ID=your_client_id
    STRAVA_CLIENT_SECRET=your_client_secret
    ```

### 4. Frontend Setup

1.  From the project root, navigate to the `client` directory.
    ```bash
    cd client
    ```

2.  Install the dependencies.
    ```bash
    npm install
    ```

## How to Run the Application

In the project root directory, run the following command:

```bash
npm run dev
```

This will start both the backend server (at `http://localhost:3001`) and the frontend application (at `http://localhost:3000`) concurrently. Your browser should automatically open to `http://localhost:3000`.

### Connect with Strava

Click the "Connect with Strava" button to authorize the application. Once authorized, your login session will be persisted in the browser.
