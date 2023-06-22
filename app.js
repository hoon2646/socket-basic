// TCP/IP 소켓과 마찬가지로 전이중통신(Full-Duplex Communictaion)을 지원
// 웹소켓으로 연결된 클라이언트와 서버는 요청, 응답없이 능동적으로 메시지를 보냄
// 전이중통신과 실시간 네트워킹이 보장되어야 하는 환경에서 유용하게 사용한다

// 1. 연결수립
// 최초 연결 요청시 클라이언트에서 HTTP를 통해 웹서버에 요청한다
// 이를 핸드세이크라고 한다.

// 2. 전이중통신
// 연결이 수립되면 메시지를 보내 통신하는데 이를 프레임(Frame)이라한다.
// 클라이언트와 서버는 언제든 상대에게 ping 보내며 수신측은 pong 패킷을 답변한다
// 이를 통해 연결이 살아있는지 확인하며 Heartbeat 이라고 한다.

// 3. 연결종료
// 클라이언트나 서버 양측 누구나 연결 종료할 수 있다.
// 종료를 원하는 측이 Close Frame 을 보내면 종료된다.

const express = require("express");
const app = express();
const { WebSocketServer } = require("ws");
// 정적 파일 서빙
app.use(express.static("public"));

app.listen(8000, () => {
  console.log("example port 8000");
});

// 웹 소켓 서버 생성
const wss = new WebSocketServer({ port: 8001 });

wss.broadcast = (message) => {
  wss.clients.forEach((client) => {
    client.send(message);
  });
};

// 웹 소켓 서버 연결 이벤트 바인드
wss.on("connection", (ws, request) => {
  wss.broadcast(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size}명`);

  // 클라이언트 close 응답
  ws.on("close", () => {
    wss.broadcast(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size}명`);
  });

  // 클라이언트들에게 메시지 전송
  ws.on("message", (data) => {
    wss.broadcast(data.toString());
  });

  console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`);
});
