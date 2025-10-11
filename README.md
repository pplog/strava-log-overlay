# Strava Log Overlay (Strava ログオーバーレイアプリ)

<img width="2557" height="1339" alt="image" src="https://github.com/user-attachments/assets/1ebea07f-9e72-4323-9562-41752bb10849" />

## 概要

Stravaのアクティビティデータを可視化し、すべての軌跡をインタラクティブな地図上に表示するウェブアプリケーションです。

## 主な機能

- OAuth 2.0 を利用した Strava API との安全な認証
- すべての Strava アクティビティを取得し、サーバーサイドでキャッシュ
- Leaflet マップ上にすべてのアクティビティの軌跡（ポリライン）を表示
- リスト上のアクティビティにカーソルを合わせると、地図上の該当アクティビティをハイライト


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

### 1. バックエンドサーバーの起動

`server` ディレクトリで以下のコマンドを実行します。
```bash
node index.js
```
サーバーが `http://localhost:3001` で起動します。初回起動時に、アクティビティデータを保存するための`cache`ディレクトリが自動的に作成されます。

### 2. フロントエンドアプリケーションの起動

別のターミナルを開き、`client` ディレクトリで以下のコマンドを実行します。
```bash
npm start
```
Reactアプリケーションが起動し、ブラウザで `http://localhost:3000` が開きます。

### 3. Strava と連携

"Connect with Strava" ボタンをクリックして、アプリケーションを認証します。Stravaの認証ページにリダイレクトされ、許可を与えるとアプリケーションに戻り、アクティビティの地図が表示されます。

### (別な方法) コマンド一発で起動

プロジェクトのルートディレクトリで、以下のコマンドを実行すると、バックエンドとフロントエンドを同時に起動できます。

```bash
npm run dev
```

---

# Strava Log Overlay

<img width="2557" height="1339" alt="image" src="https://github.com/user-attachments/assets/1ebea07f-9e72-4323-9562-41752bb10849" />

## Overview

This web application visualizes your Strava activity data, displaying all your activity tracks on an interactive map.

## Features

- Secure authentication with the Strava API using OAuth 2.0.
- Fetches all your Strava activities and caches them on the server.
- Displays all activity polylines on a Leaflet map.
- Highlights activities on the map when you hover over them in the list.

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

### 1. Start the Backend Server

In the `server` directory, run the following command:
```bash
node index.js
```
The server will start on `http://localhost:3001`. On the first run, it will automatically create a `cache` directory to store activity data.

### 2. Start the Frontend Application

Open a separate terminal, navigate to the `client` directory, and run the following command:
```bash
npm start
```
The React application will start, and your browser should open to `http://localhost:3000`.

### 3. Connect with Strava

Click the "Connect with Strava" button to authorize the application. You will be redirected to Strava to grant permissions and then redirected back to the application, where your activity map will be displayed.

### (Alternative) Single Command Startup

In the project root directory, you can run the following command to start both the backend and frontend concurrently:

```bash
npm run dev
```
