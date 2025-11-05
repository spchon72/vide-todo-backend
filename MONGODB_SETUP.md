# MongoDB 연결 설정 가이드

## 문제 해결 방법

### 방법 1: 관리자 권한으로 MongoDB 서비스 시작 (로컬 MongoDB 사용)

1. **PowerShell을 관리자 권한으로 실행**
   - 시작 메뉴에서 "PowerShell" 검색
   - "Windows PowerShell"을 우클릭 → "관리자 권한으로 실행"

2. **MongoDB 서비스 시작**
   ```powershell
   Start-Service MongoDB
   ```

3. **서비스 상태 확인**
   ```powershell
   Get-Service MongoDB
   ```

4. **백엔드 서버 실행**
   ```powershell
   cd C:\vibe-coding\todo-backend
   node index.js
   ```

---

### 방법 2: MongoDB Atlas 사용 (권장 - 클라우드 무료 버전)

#### 1단계: MongoDB Atlas 계정 생성 및 클러스터 생성
1. https://www.mongodb.com/cloud/atlas 접속
2. 회원가입 및 무료 클러스터 생성 (M0 - Free Tier)
3. Network Access에서 IP 주소 추가 (0.0.0.0/0으로 모든 IP 허용 가능, 개발용)
4. Database Access에서 사용자 생성 (username, password 설정)

#### 2단계: 연결 문자열 가져오기
1. Atlas 대시보드에서 "Connect" 클릭
2. "Connect your application" 선택
3. 연결 문자열 복사 (예: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### 3단계: 환경변수 설정
PowerShell에서:
```powershell
$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/todo"
```

또는 .env 파일 사용 (권장):
```bash
npm install dotenv
```

`.env` 파일 생성:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo
```

그리고 `index.js`에 추가:
```javascript
require('dotenv').config();
```

#### 4단계: 서버 실행
```powershell
node index.js
```

---

### 방법 3: 수동으로 MongoDB 시작 (설치 경로로 직접 실행)

MongoDB가 설치되어 있지만 서비스가 아닌 경우:

```powershell
# MongoDB 설치 경로로 이동 (일반적인 경로)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# MongoDB 시작
.\mongod.exe --dbpath "C:\data\db"
```

**참고**: `C:\data\db` 디렉토리가 존재해야 합니다.

---

## 추천 방법

개발 환경에서는 **MongoDB Atlas**를 사용하는 것을 권장합니다:
- 별도 설치/관리 불필요
- 무료 티어 제공
- 어디서든 접근 가능
- 자동 백업 및 보안 기능



