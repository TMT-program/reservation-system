# Reservation System (MVP)

飲食店向けの予約管理Webアプリ（MVP）です。公開ページは「店舗紹介 + メニュー + 予約」、管理画面は「メニュー管理 / ホーム情報編集 / 画像更新」を行います。

## セットアップ

1. `.env` を用意する（Vite形式）

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. 依存関係インストール

```bash
npm install
```

3. 開発サーバー起動

```bash
npm run dev
```

## 画面構成

- `/`：Home（店舗紹介 + 営業時間など）
- `/menu`：Menu（公開中メニュー一覧）
- `/reservation`：Reservation（予約フォーム / localStorage 保存）
- `/admin/login`：管理者ログイン
- `/admin/menu`：メニュー管理
- `/admin/settings`：ホーム情報・画像管理

## Firestore / Storage ルール案

> 必要に応じて管理者UIDや匿名アクセス可否は調整してください。

### Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
    }

    match /menuItems/{docId} {
      allow read: if resource.data.isPublished == true;
      allow read, create, update, delete: if isAdmin();
    }

    match /settings/public {
      allow read: if true;
      allow update: if isAdmin();
    }
  }
}
```

### Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /menuItems/{docId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```
