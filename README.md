# Strava Log Overlay (Strava ログオーバーレイアプリ)

## 概要 / Overview

Stravaのアクティビティデータを可視化し、すべての軌跡をインタラクティブな地図上に表示するウェブアプリケーションです。

This web application visualizes your Strava activity data, displaying all your activity tracks on an interactive map.

## 主な機能 / Features

- OAuth 2.0 を利用した Strava API との安全な認証
- すべての Strava アクティビティを取得し、サーバーサイドでキャッシュ
- Leaflet マップ上にすべてのアクティビティの軌跡（ポリライン）を表示
- リスト上のアクティビティにカーソルを合わせると、地図上の該当アクティビティをハイライト

- Secure authentication with the Strava API using OAuth 2.0.
- Fetches all your Strava activities and caches them on the server.
- Displays all activity polylines on a Leaflet map.
- Highlights activities on the map when you hover over them in the list.

## 技術スタック / Technology Stack

- **Frontend**: React, Leaflet, react-leaflet
- **Backend**: Node.js, Express

## セットアップとインストール / Setup and Installation

以下の手順に従って、ローカル環境でプロジェクトをセットアップ・実行してください。

Follow these steps to set up and run the project locally.

### 1. リポジトリをクローン / Clone the Repository

```bash
git clone https://github.com/pplog/strava-log-overlay.git
cd strava-log-overlay
```

### 2. Strava API の設定 / Strava API Setup

1.  [Strava API 設定ページ](https://www.strava.com/settings/api) にアクセスし、新しいアプリケーションを作成します。
2.  作成すると **Client ID** と **Client Secret** が発行されます。これらはバックエンドの設定で使用します。
3.  **Authorization Callback Domain** に `localhost` を設定してください。

1.  Go to [your Strava API settings page](https://www.strava.com/settings/api) and create a new application.
2.  You will get a **Client ID** and a **Client Secret**. You'll need these for the backend setup.
3.  Under **Authorization Callback Domain**, set it to `localhost`.

### 3. バックエンドのセットアップ / Backend Setup

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

1.  Navigate to the server directory, install the dependencies, and create a `.env` file with your Strava API credentials.

### 4. フロントエンドのセットアップ / Frontend Setup

1.  プロジェクトのルートディレクトリから `client` ディレクトリに移動します。
    ```bash
    cd client
    ```

2.  依存関係をインストールします。
    ```bash
    npm install
    ```

1.  Navigate to the client directory from the root folder and install the dependencies.

## 実行方法 / How to Run the Application

### 1. バックエンドサーバーの起動 / Start the Backend Server

`server` ディレクトリで以下のコマンドを実行します。
```bash
node index.js
```
サーバーが `http://localhost:3001` で起動します。

In the `server` directory, run the command above. The server will start on `http://localhost:3001`.

### 2. フロントエンドアプリケーションの起動 / Start the Frontend Application

別のターミナルを開き、`client` ディレクトリで以下のコマンドを実行します。
```bash
npm start
```
Reactアプリケーションが起動し、ブラウザで `http://localhost:3000` が開きます。

In a separate terminal, go to the `client` directory and run the command. The React application will start, and your browser should open to `http://localhost:3000`.

### 3. Strava と連携 / Connect with Strava

"Connect with Strava" ボタンをクリックして、アプリケーションを認証します。Stravaの認証ページにリダイレクトされ、許可を与えるとアプリケーションに戻り、アクティビティの地図が表示されます。

Click the "Connect with Strava" button to authorize the application. You will be redirected to Strava to grant permissions and then redirected back to the application, where your activity map will be displayed.