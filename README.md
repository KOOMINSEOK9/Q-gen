# 1. 프로젝트 개요

### 📋 서비스 개요
- RAG 기반 문제 생성 서비스
- RAG를 활용하여 사용자가 입력한 데이터를 기반으로 유사도 검색을 하여 정밀한 문제를 생성해주는 서비스 입니다. 
- **프로젝트 기간:** 2025/4/14 ~ 2025/5/21 
<br>
### 💡 서비스 특징
#### 1. 문서/자료 업로드 기반 AI 문제 생성
사용자는 PDF, DOCX, 텍스트 등 다양한 형태의 학습 자료를 업로드할 수 있습니다.
링크를 넣어 링크 내 사이트를 자동으로 크롤링하여 데이터를 입력할 수 있습니다. 
업로드된 자료를 바탕으로 AI가 자동으로 맞춤형 문제를 생성합니다.
#### 2. 문제집/시험지 관리
여러 개의 문제집을 생성하고, 각 문제집 내에서 시험지를 체계적으로 관리할 수 있습니다.
시험지별로 문제 유형(객관식, 주관식, OX )과 문제 수를 자유롭게 설정할 수 있습니다.
#### 3. 실시간 학습 이력 및 피드백
문제 풀이 결과와 학습 이력을 실시간으로 저장 및 확인할 수 있습니다.
오답노트, 풀이 기록 등 다양한 피드백 기능을 제공합니다.
#### 4. 직관적인 가이드 및 도움말
서비스 이용이 처음인 사용자도 쉽게 적응할 수 있도록 단계별 가이드 모달을 제공합니다.
언제든지 오른쪽 하단의 가이드 버튼을 통해 도움말을 확인할 수 있습니다.
#### 5. 학습 몰입도 향상을 위한 디자인
차분한 컬러와 친근한 캐릭터(돌고래 등)로 직관적인 UI를 구성하여 학습 몰입도 향상
<br>
<br>

# 2. 설계 및 구현

### 🛠 기술 스택

**Frontend** <br>
![React](https://img.shields.io/badge/react-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![React Query](https://img.shields.io/badge/react_query-FF4154.svg?style=for-the-badge&logo=reactquery&logoColor=white)
![Yarn Berry](https://img.shields.io/badge/yarn_berry-2C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![Storybook](https://img.shields.io/badge/storybook-FF4785.svg?style=for-the-badge&logo=storybook&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-E26529.svg?style=for-the-badge&logo=zustand&logoColor=white)

**Backend** <br>
![Java](https://img.shields.io/badge/java-3670A0?style=for-the-badge&logo=java&logoColor=ffdd54)
![Spring](https://img.shields.io/badge/spring_boot-6DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/spring_security-6DB33F.svg?style=for-the-badge&logo=springsecurity&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/spring_data_jpa-6DB33F.svg?style=for-the-badge&logo=springdatajpa&logoColor=white)
![Spring Session](https://img.shields.io/badge/spring_session-6DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![OAuth2](https://img.shields.io/badge/oauth2-000000.svg?style=for-the-badge&logo=oauth2&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-0089CF?style=for-the-badge&logo=querydsl&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)
![FFmpeg](https://img.shields.io/badge/ffmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)

**DevOps** <br>
![NginX](https://img.shields.io/badge/NginX-009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-D24939.svg?style=for-the-badge&logo=jenkins&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/amazon_ec2-FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white)
![GitLab](https://img.shields.io/badge/gitlab-FC6D26.svg?style=for-the-badge&logo=gitlab&logoColor=white)

**Tools** <br>
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Intellij IDEA](https://img.shields.io/badge/Intelij_IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![Swagger](https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Figma](https://img.shields.io/badge/figma-F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)

<br>

### 🖼️아키텍쳐 설계
### 수정 필요
![아키텍쳐 설계](/uploads/74610721fc49b01d44153d3f6c6db0a0/image.png)

<br>

### 💾데이터베이스 모델링(ERD)
### 수정 필요
![ERD](/uploads/967fde4d739fa84721702003d7870c3e/B102_ERD.png)

<br>

### 🎨화면 정의서(Figma)

[Figma_화면정의서](https://www.figma.com/design/oSophIoTs9EkVTZZxBGch4/Q-gen?node-id=17-2&t=RTytrBLmL8te7ydv-0)

<br>

### 📝요구사항 정의서

[Notion_요구사항 정의서](https://ubiquitous-theory-103.notion.site/1dc0e945fc098095a082cffb49d8a7b3?pvs=4)

<br>

### 📄API명세서

[Notion_API명세서](https://ubiquitous-theory-103.notion.site/API-1de0e945fc0980d5b553f298e558ac68?pvs=4)

<br>

### 🗂️프로젝트 폴더 구조

**Frontend** - Yarn Berry + Vite + React + Typescript

```text
frontend/
└── src/
    ├── App.tsx
    ├── App.css
    ├── hooks/
    │   └── useAuth.ts
    ├── components/
    │   ├── layout/
    │   │   ├── Header/
    │   │   │   └── Header.tsx
    │   │   ├── Footer/
    │   │   │   └── Footer.tsx
    │   │   └── Background/
    │   │       ├── ArcBackground.tsx
    │   │       └── BlurBackground.tsx
    │   ├── Scroll/
    │   │   └── ScrollToTop.tsx
    │   ├── common/
    │   │   ├── PCRecommendModal/
    │   │   │   └── PCRecommendModal.tsx
    │   │   ├── StickyGuideButton/
    │   │   │   └── StickyGuideButton.tsx
    │   │   └── GuideModal/
    │   │       └── GuideModal.tsx
```

**Backend** - Spring Boot

```text
server
├── src.main.java.com.votegaheneta
│   ├── chat
│   │   ├── component
│   │   ├── controller
│   │   ├── dto
│   │   ├── exception
│   │   └── service
│   ├── common
│   │   ├── component
│   │   ├── exception
│   │   ├── repository
│   │   └── response
│   ├── configuration
│   ├── interceptor
│   ├── security
│   │   ├── autorization
│   │   └── config
│   ├── stream
│   │   ├── controller
│   │   ├── dto
│   │   ├── entity
│   │   ├── handler
│   │   ├── repository
│   │   └── service
│   ├── test
│   ├── user
│   │   ├── controller
│   │   ├── dto
│   │   ├── entity
│   │   ├── enums
│   │   ├── repository
│   │   └── service
│   ├── util
│   │   ├── nickname
│   │   │   ├── component
│   │   │   ├── entity
│   │   │   └── repository
│   ├── vote
│   │   ├── controller
│   │   │   ├── request
│   │   │   └── response
│   │   ├── dto
│   │   ├── entity
│   │   ├── handler
│   │   ├── repository
│   │   └── service
```

<br>

# 3. 기능 상세 설명

## ** < Front-End > ** 

- 개발환경: YarnBerry + Vite + React + Tyepscript
- 디자인 패턴: Atomic Design + FSD Structure
- API 통신: Axios
- 상태 관리: Zustand
- 데이터 캐싱 관리: React-Query
- API Mocking Library: MSW
- UI Test: StoryBook
- Tailwind CSS

## ✅ 문제집/시험지/자료 관리
### 1️⃣ 문제집 목록 및 관리
WorkBookList 컴포넌트 구현
WorkBook 타입을 활용한 문제집 데이터 관리
최신순/제목순 정렬 기능 (커스텀 드롭다운 컴포넌트 활용)
문제집 추가, 수정, 삭제 기능 (Swal 모달로 UX 통일)
각 문제집 클릭 시 상세 페이지로 이동

### 2️⃣ 문제집 상세 및 시험지 관리
List 페이지(메인)
문제집 선택 시 해당 문제집의 시험지 리스트(TestPaperList)와 자료 업로드(UploadedList) 동시 표시
시험지 생성, 삭제, PDF 변환, 문제 노트 이동 등 다양한 액션 지원
시험지 생성 중에는 로딩 애니메이션(CreatingLoader) 표시

### 3️⃣ 시험지 리스트 및 상세
TestPaperList 컴포넌트
시험지별 제목, 생성일, 문제수, 문제유형 등 정보 표시
한 줄 ellipsis 및 hover 시 전체 제목 툴팁/스크롤 애니메이션 지원
시험지 삭제 시 Swal 확인 모달 적용
시험지 생성, 문제 풀기, PDF 변환, 문제 노트 이동 등 액션 버튼 제공

### 4️⃣ 자료 업로드 및 미리보기
UploadedList 컴포넌트
업로드된 파일 리스트, 진행률, 파일 삭제 기능
PDF, DOCX 등 미리보기 지원 (mammoth, PDF.js 등 활용)
파일 타입별 아이콘 및 사용자 친화적 타입명 표시
파일 업로드 시 유효성 검사(확장자, 크기 등)

## ✅ 가이드/접근성/UX
### 5️⃣ PC 권장 모달
PCRecommendModal 컴포넌트
모바일 환경에서만 최초 1회 노출 (localStorage로 상태 관리)
"계속하기" 클릭 시 localStorage에 저장, 이후 노출 안 됨

### 6️⃣ 서비스 가이드 모달
GuideModal 컴포넌트
슬라이드 방식의 단계별 가이드(이미지+텍스트)
"다시 보지 않기" 체크 시 localStorage에 저장, 이후 노출 안 됨
오른쪽 하단 StickyGuideButton 클릭 시 토글로 열고 닫기 가능
특정 페이지에서만 버튼 노출(경로 조건부 렌더링)

### 7️⃣ 스크롤/접근성
ScrollToTopButton 컴포넌트
스크롤 200px 이상 시 우측 하단에 부드럽게 등장
클릭 시 페이지 최상단으로 스크롤 이동

## ✅ 기타 공통 컴포넌트 및 유틸
### 8️⃣ 공통 버튼/아이콘/입력
Button, IconBox, InputField 등
일관된 디자인과 재사용성 확보

### 9️⃣ 상태/스토어/훅
useWorkBook, useTestPaper, useDocuments, useAuth 등
데이터 패칭, 인증, 상태 관리 등 커스텀 훅으로 분리

<br>

---
## **< Back-End > **
- 개발환경: Spring Boot + JPA + Spring Security
- 데이터: MySQL, Redis
- RTMP 변환: FFmpeg


<br>

---
## ** < AI > **
- 개발환경: 
- 데이터:


---
##  ** < Infra >**
- 웹서버: NginX
- 스트리밍: Nginx-rtmp
- 실행환경: Docker, Docker-compose
- CI/CD: Jenkins
- 배포: AWS EC2

## ✅ 배포 환경 구축 
### 1️⃣ 웹서버
- **NGINX**
  - `HTTPS`를 적용하고 여 사이트의 보안 향상.
  - `Reverse Proxy`을 통해 브라우저에서 오는 모든 HTTPS와 WSS요청을 server와 nginx-rtmp 컨테이너로 프록시.

- **NGINX-RTMP**
  - Spring Boot로부터 전송받은 RTMP를 HLS로 변환.

### 2️⃣ 배포 환경 구축과 CI/CD
- **Docker, Docker-compose**
  - `docker`를 이용하여 실행환경을 컨테이너화.
  - 배포에 사용되는 컨테이너 6개를 `docker-compose`로 묶어서 배포.

- **Jenkins**
  - Docker에서 Jenkins image를 pull 받아서 실행
  - 파이프라인 스크립트를 작성하여 배포

- **AWS EC2**
  - 제공받은 AWS EC2 사용

<br>

# 4. 한줄 소감

**🟧 황연주 **


**🟥 구민석 **


**🟨 이신욱 **


**🟩 최현만 **


**🟦 장인영 **


**🟪 홍정표 ** 



