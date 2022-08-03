# 안방네컷

## 추억을 잇는 랜선 사진관

1. server/ > `npm i`
2. client/ > `yarn install`
3. client/ > `npm run build`
4. server/ > `npm run dev`

📌 **주의사항**
**`.env 파일` 확인 잘하세요! **

<hr>

## Folder Structure

### Client

> `client` : Front-End (REACT)
>
> > `package.json` : 프론트 관련 모듈, 스크립트 등등
> >
> > `public` : 이미지 등
> >
> > `src` : 프론트 소스
> >
> > > `components/views` : 각 화면들

### Server

> `server/` : Back-End (Node-Express)
>
> > `index.js`: server 메인
> >
> > `config/` : 환경변수 관련 (리팩토링 필요)
> >
> > `middleware/` : 미들웨어
> >
> > `models/`: DB Schema
> >
> > `routes/`: route 관리
>
> `package.json` : 백 관련 모듈, 스크립트 등등

<hr>

### Note

- 컴포넌트 스타일 설정에 antd 사용하고 있음 (그냥 개발용으로 볼때 예쁘라고 썼는데 편한 듯)
  https://ant.design/docs/react/introduce

- back, front 실행 시 주의해야 할 변수
- MONGO_URI, PORT, setupProxy.js (from client/), ...
  - Dev, Prod, ~~Local~~ 분리 필요

## 디렉토리 구조

```
4-cut-dev
├─ .DS_Store
├─ README.md
├─ client
│  ├─ .env
│  ├─ README.md
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ cute.gif
│  │  ├─ favicon.ico
│  │  ├─ icons
│  │  │  ├─ apple-touch-icon-114x114.png
│  │  │  ├─ apple-touch-icon-120x120.png
│  │  │  ├─ apple-touch-icon-144x144.png
│  │  │  ├─ apple-touch-icon-152x152.png
│  │  │  ├─ apple-touch-icon-192x192.png
│  │  │  ├─ apple-touch-icon-57x57.png
│  │  │  ├─ apple-touch-icon-60x60.png
│  │  │  ├─ apple-touch-icon-72x72.png
│  │  │  ├─ apple-touch-icon-76x76.png
│  │  │  ├─ favicon-196x196.png
│  │  │  └─ favicon_512x512.png
│  │  ├─ index.html
│  │  ├─ logo.jpeg
│  │  ├─ manifest.json
│  │  └─ splashscreens
│  │     ├─ iphone5_splash.png
│  │     ├─ iphone6_splash.png
│  │     ├─ iphoneplus_splash.png
│  │     ├─ iphonex_splash.png
│  │     ├─ iphonexr_splash.png
│  │     └─ iphonexsmax_splash.png
│  ├─ src
│  │  ├─ .DS_Store
│  │  ├─ App.css
│  │  ├─ App.js
│  │  ├─ _actions
│  │  │  ├─ room_action.js
│  │  │  ├─ types.js
│  │  │  └─ user_action.js
│  │  ├─ _reducers
│  │  │  ├─ index.js
│  │  │  ├─ room_reducer.js
│  │  │  └─ user_reducer.js
│  │  ├─ audio
│  │  │  ├─ button.mp3
│  │  │  └─ sparkling.mp3
│  │  ├─ components
│  │  │  ├─ Album
│  │  │  │  ├─ Album.js
│  │  │  │  ├─ Album.module.css
│  │  │  │  ├─ Modal.js
│  │  │  │  └─ PhotoDelete.js
│  │  │  ├─ AlbumPage
│  │  │  │  ├─ AlbumPage.js
│  │  │  │  └─ AlbumPage.module.css
│  │  │  ├─ AllAlbum
│  │  │  │  ├─ AllAlbum.js
│  │  │  │  ├─ AllAlbum.module.css
│  │  │  │  ├─ AutoSlide.css
│  │  │  │  ├─ AutoSlides.js
│  │  │  │  ├─ HeartButton.js
│  │  │  │  └─ Modal.js
│  │  │  ├─ FriendAnbang
│  │  │  │  ├─ FriendAnbang.js
│  │  │  │  ├─ FriendsList.js
│  │  │  │  └─ SearchFriend.js
│  │  │  ├─ GA
│  │  │  │  └─ GA.js
│  │  │  ├─ GroupPage
│  │  │  │  ├─ BackgroundContent.js
│  │  │  │  ├─ CameraTab.js
│  │  │  │  ├─ CaptureBtn.js
│  │  │  │  ├─ GroupPage.js
│  │  │  │  ├─ GroupPage.module.css
│  │  │  │  ├─ MuteBtn.js
│  │  │  │  ├─ NookiImages
│  │  │  │  │  ├─ Jennie01.png
│  │  │  │  │  ├─ Jin01.png
│  │  │  │  │  ├─ SeoHyunJin01.png
│  │  │  │  │  ├─ V01.png
│  │  │  │  │  ├─ Winter01.png
│  │  │  │  │  ├─ hat1.png
│  │  │  │  │  ├─ hat2.png
│  │  │  │  │  ├─ hat3.png
│  │  │  │  │  ├─ hat4.png
│  │  │  │  │  ├─ hat5.png
│  │  │  │  │  ├─ starbg1.png
│  │  │  │  │  ├─ starbg10.png
│  │  │  │  │  ├─ starbg2.png
│  │  │  │  │  ├─ starbg3.png
│  │  │  │  │  ├─ starbg4.png
│  │  │  │  │  ├─ starbg5.png
│  │  │  │  │  ├─ starbg6.png
│  │  │  │  │  ├─ starbg7.png
│  │  │  │  │  ├─ starbg8.png
│  │  │  │  │  └─ starbg9.png
│  │  │  │  ├─ SelfUploadBgContent.js
│  │  │  │  ├─ Socket.js
│  │  │  │  ├─ WithStar.js
│  │  │  │  ├─ audio
│  │  │  │  │  └─ camera.mp3
│  │  │  │  ├─ remove.js
│  │  │  │  ├─ remove2.js
│  │  │  │  ├─ segment.js
│  │  │  │  ├─ useInterval.js
│  │  │  │  └─ wegbl-transparency.mjs
│  │  │  ├─ Header
│  │  │  │  ├─ Header.js
│  │  │  │  └─ Navbar.module.css
│  │  │  ├─ ImageEditor
│  │  │  │  ├─ ImageEditor.js
│  │  │  │  ├─ PhotoModify.js
│  │  │  │  ├─ Sticker.js
│  │  │  │  ├─ styles.css
│  │  │  │  └─ theme.js
│  │  │  ├─ Kakao
│  │  │  │  ├─ KakaoInvite.js
│  │  │  │  ├─ KakaoShareImage.js
│  │  │  │  └─ kakao_logo.png
│  │  │  ├─ LandingPage
│  │  │  │  ├─ ImageSlides.js
│  │  │  │  ├─ ImageSlides.module.css
│  │  │  │  ├─ LandingPage.js
│  │  │  │  └─ LandingPage.module.css
│  │  │  ├─ Loading
│  │  │  │  ├─ Loading.js
│  │  │  │  └─ loadingImg.gif
│  │  │  ├─ LoginPage
│  │  │  │  └─ LoginPage.js
│  │  │  ├─ Logout
│  │  │  │  └─ Logout.js
│  │  │  ├─ PhotoEditPage
│  │  │  │  ├─ PhotoEditPage.js
│  │  │  │  ├─ PhotoEditPage.module.css
│  │  │  │  ├─ gifWorker.js
│  │  │  │  └─ makeGIF.js
│  │  │  ├─ RegisterPage
│  │  │  │  └─ RegisterPage.js
│  │  │  ├─ Social
│  │  │  │  └─ Social.js
│  │  │  ├─ SocialShared
│  │  │  │  └─ SocialShared.js
│  │  │  └─ UserMain
│  │  │     └─ UserMain.js
│  │  ├─ context
│  │  │  └─ AuthContext.js
│  │  ├─ controller
│  │  │  ├─ Kakao.js
│  │  │  ├─ KakaoAuth.js
│  │  │  └─ Profile.js
│  │  ├─ font
│  │  │  ├─ Cafe24Oneprettynight.ttf
│  │  │  ├─ NanumSquareRoundB.ttf
│  │  │  ├─ NanumSquareRoundEB.ttf
│  │  │  ├─ NanumSquareRoundOTFEB.ttf
│  │  │  ├─ NanumSquareRoundR.ttf
│  │  │  └─ TmonMonsori.ttf.ttf
│  │  ├─ hoc
│  │  │  └─ auth.js
│  │  ├─ img
│  │  │  ├─ albumImg.png
│  │  │  ├─ appLogo.png
│  │  │  ├─ backIcon.png
│  │  │  ├─ bg1.jpeg
│  │  │  ├─ bg10.jpg
│  │  │  ├─ bg11.jpg
│  │  │  ├─ bg12.jpg
│  │  │  ├─ bg2.jpeg
│  │  │  ├─ bg3.jpeg
│  │  │  ├─ bg4.jpeg
│  │  │  ├─ bg5.jpg
│  │  │  ├─ bg6.jpg
│  │  │  ├─ bg7.jpg
│  │  │  ├─ bg8.jpg
│  │  │  ├─ bg9.jpg
│  │  │  ├─ bgImg1.jpg
│  │  │  ├─ bgImg11.png
│  │  │  ├─ bgImg2.jpg
│  │  │  ├─ bgImg3.jpg
│  │  │  ├─ bgImg4.jpg
│  │  │  ├─ bgImg5.png
│  │  │  ├─ bgImg7.png
│  │  │  ├─ cameraImg.png
│  │  │  ├─ cloudFrame.png
│  │  │  ├─ default_background.jpg
│  │  │  ├─ enterRoom.png
│  │  │  ├─ enterRoomP.png
│  │  │  ├─ flower.png
│  │  │  ├─ kakao_login.png
│  │  │  ├─ linkIcon.png
│  │  │  ├─ main.gif
│  │  │  ├─ menuIcon.png
│  │  │  ├─ prevIcon.png
│  │  │  ├─ shutter.png
│  │  │  ├─ 같이보기.png
│  │  │  ├─ 나만보기.png
│  │  │  ├─ 단색1.png
│  │  │  ├─ 단색2.png
│  │  │  ├─ 단색3.png
│  │  │  ├─ 단색4.png
│  │  │  ├─ 단색5.png
│  │  │  ├─ 단색6.png
│  │  │  ├─ 파스텔1.jpg
│  │  │  ├─ 파스텔2.jpg
│  │  │  ├─ 파스텔3.jpg
│  │  │  ├─ 파스텔4.jpg
│  │  │  └─ 파스텔5.png
│  │  ├─ index.css
│  │  ├─ index.js
│  │  ├─ reportWebVitals.js
│  │  ├─ service-worker.js
│  │  ├─ serviceWorkerRegistration.js
│  │  ├─ setupProxy.js
│  │  └─ setupTests.js
│  └─ yarn.lock
└─ server
   ├─ .DS_Store
   ├─ .env
   ├─ data
   │  └─ aws.js
   ├─ index.js
   ├─ middleware
   │  ├─ ImageUpload.js
   │  ├─ auth.js
   │  └─ backgroundImageUpload.js
   ├─ models
   │  ├─ Image.js
   │  ├─ User.js
   │  └─ backgroundImage.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ backgroundImageRouter.js
   │  ├─ friendsRouter.js
   │  ├─ imageRouter.js
   │  ├─ roomsRouter.js
   │  └─ usersRouter.js
   ├─ uploads
   │  └─ 1658767765270.jpg
   └─ yarn.lock

```
