## for Dev
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
>> `package.json` : 프론트 관련 모듈, 스크립트 등등
>>
>> `public` : 이미지 등
>>
>> `src` : 프론트 소스
>>
>>> `components/views` : 각 화면들

### Server
> `server/` : Back-End (Node-Express)
>>
>>`index.js`: server 메인
>>
>>`config/` : 환경변수 관련 (리팩토링 필요)
>>
>>`middleware/` : 미들웨어
>>
>>`models/`: DB Schema
>>
>>`routes/`: route 관리
>
> `package.json` : 백 관련 모듈, 스크립트 등등

<hr>

### Note

* 컴포넌트 스타일 설정에 antd 사용하고 있음 (그냥 개발용으로 볼때 예쁘라고 썼는데 편한 듯)
  https://ant.design/docs/react/introduce

* back, front 실행 시 주의해야 할 변수
* MONGO_URI, PORT, setupProxy.js (from client/), ...
  * Dev, Prod, ~~Local~~ 분리 필요
