# oEmbed

oEmbed 데이터 수집 서비스

## 요구사항

- 입력받은 url에 대해 oembed 데이터 수집
  - oembed spec 가져오기
  - 일치하는 oembed spec 찾기
  - oembed spec에 맞춰 해당 서비스에 요청을 보냄
  - 서비스에서 받은 결과물을 응답으로 반환
- url 입력 폼 구현
  - 뷰 페이지 구현
  - oembed 데이터 테이블 형태로 출력
  - html값과 thumbnail_url은 미리보기 구현

## 실행 방법
1. `npm build` 명령어를 통해 프로젝트를 빌드합니다.
2. `FACEBOOK_APP_ID`, `FACEBOOK_CLIENT_TOKEN`, `PORT` 환경변수를 설정합니다.
3. `node dist/main.js` 명령어로 서버를 실행합니다.
4. `http://localhost:<PORT>` 페이지로 접속하여 oEmbed data를 받으려는 url을 입력한 뒤, 확인 버튼을 눌러 데이터를 가져옵니다.

## 동작 화면
![image](https://user-images.githubusercontent.com/51621520/146635654-9b254ce4-46f6-463c-a7a0-36f8c27d3a00.png)
