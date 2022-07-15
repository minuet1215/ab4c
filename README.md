# 4-cut-dev
기본 로그인(REACT) + 동영상 누끼

## 로컬에서 돌리기

1. `npm i`
2. client > `npm run build`
3. `npm run backend`
4. "http://localhost:5001/" 로 접속


## 개발용으로 돌리기

`npm run dev`


## 간단한 파일 구조 설명

> `client` : Front-End (REACT)
>
>> `package.json` : 프론트 관련 모듈, 스크립트 등등
>>
>> `public` : 이미지 등
>>
>> `src` : 프론트 소스
>>
>>> `components/views` : 각 화면들
>
> `server` : Back-End
>>
>>`index.js`: server 메인
>
> `package.json` : 백 관련 모듈, 스크립트 등등

### 비고

* 컴포넌트 스타일 설정에 antd 사용하고 있음 (그냥 개발용으로 볼때 예쁘라고 썻는데 편한듯)
  https://ant.design/docs/react/introduce
* 데이터베이스는 일단은 로컬 DB로 설정되어있음
