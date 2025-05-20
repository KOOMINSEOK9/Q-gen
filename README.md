# 1. 프로젝트 개요

### 📋 서비스 개요
- RAG 기반 문제 생성 서비스
- RAG를 활용하여 사용자가 입력한 데이터를 기반으로 유사도 검색을 하여 정밀한 문제를 생성해주는 서비스 입니다. 
- **프로젝트 기간:** 2025/4/14 ~ 2025/5/21 

### 💰 **서비스 특징**
1. **사용자 업로드 기반**
   - 후보자는 **라이브 방송**을 통해 후보자와 시공간의 제약없이 소통 가능합니다.
2. **후보자별 채팅**
   - 유권자는 **후보자별 채팅방**을 통해 본인이 지지하는 후보자와 긴밀하게
     소통가능 합니다.
3. **실시간 투표 현황**
   - Web Socket을 활용해 **투표 진행 정보**를 실시간으로 제공합니다.
4. **디자인**
   - 학생들의 취향을 고려한 페이지 구성 및 디자인

### 👭팀원 정보 및 업무 분담 내역
| 이름           | 역할 및 구현 기능                                                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟧황연주(팀장) | **Frontend**<br>- figma 디자인 <br>  - SockJS와 STOMP 프로토콜 활용한 서비스 내 실시간 채팅 컴포넌트 구현 <br>- 사용자 및 후보자 정보 관리 구현<br>- 선거 유세를 위한 라이브 화면 구현 <br>                                                                                                                                                                                            |
| 🟩구민석(팀원) | **Backend**<br>- 투표 API 개발<br>- 선거 API 개발<br>- 조회 로직 redis 캐싱<br> - 후보자 초성 검색 구현<br>- JPA 쿼리 최적화                                                                                                                                                                                                           |
| 🟦이신욱(팀원) | **Backend**<br>- 스트리밍 API 개발<br>- WebSocket으로 스트림 수신<br>- 스트림을 FFmpeg로 RTMP 변환<br> <br>**Infra**<br>- 프로젝트 전체 구조 설정<br>- Docker, Docker-compose로 프로젝트 실행과 배포 환경 구축<br>- Jenkins로 CI/CD 구축<br>- RTMP-HLS 스트리밍 환경 구축 |
| 🟥최현만만(팀원) | **Frontend**<br>- figma 디자인<br>- client 프로젝트 구조 설정<br>- WebSocket과 hls.js를 활용한 라이브 스트리밍 구현<br>- 선거 및 투표 만들기 구현 <br>- 선거 메인 화면 구현 <br>- 유틸 기능 구현 (글자수 처리, 날짜 데이터 처리 등)<br> |
| 🟨장인영(팀원) | **Frontend**<br>- figma 디자인<br>- 페이지 마크업 및 스타일링<br>- axios, zustand, react-qeury를 활용한 데이터 바인딩 <br> - 투표하기 Session 구현 <br> - Web Socket을 활용한 실시간 투표 정보 제공<br>                                 |
| 🟪홍정표(팀원) | **Frontend**<br>- figma 디자인 <br>  - SockJS와 STOMP 프로토콜 활용한 서비스 내 실시간 채팅 컴포넌트 구현 <br>- 사용자 및 후보자 정보 관리 구현<br>- 선거 유세를 위한 라이브 화면 구현 <br>   <br>                                                                                                                                                                                                     |

<br>

# 2. 설계 및 구현

### 🛠 기술 스택

**Frontend** <br>
![React](https://img.shields.io/badge/react-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![React Query](https://img.shields.io/badge/react_query-FF4154.svg?style=for-the-badge&logo=reactquery&logoColor=white)
![Yarn Berry](https://img.shields.io/badge/yarn_berry-2C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![Storybook](https://img.shields.io/badge/storybook-FF4785.svg?style=for-the-badge&logo=storybook&logoColor=white)
![Tailwind CSS]](https://img.shields.io/badge/sass-CC6699.svg?style=for-the-badge&logo=sass&logoColor=white)
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



