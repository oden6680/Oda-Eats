let TOKEN = "LINEトークン";
let URL = "LINEbotのURL";
let profileGetUrl = "LINEbotのプロフィルURL";
let ADMIN = "adminID"

function doPost(event) {
    let request = JSON.parse(event.postData.contents);
    let replyToken = request.events[0].replyToken;
    let userMessage = request.events[0].message.text;
    let userId = request.events[0].source.userId;
    let botMessage;
 
    if (userMessage.indexOf("注文") !== -1){
      botMessage = "ご注文ありがとうございます！位置情報を送信すると配達可能かどうかの審査が始まります。"
      sendUserToAdmin();
      if(userId !== ADMIN){
        sendUserToAdmin();
      }
    } else {
      botMessage = "メッセージありがとうございます！\n申し訳ありませんが、こちらのbotは個別の問い合わせを受け付けておりません。\n注文をご希望の際は「注文」と送ってみてください！"
    }

    if (request.events[0].type == "message" && request.events[0].message.type == "location"){
      botMessage = "位置情報の送信ありがとうございます！ただいま配達可能か判定しておりますので少々お待ちください。";
      sendUserToAdmin();
    }

    let payload = JSON.stringify({
        "replyToken": replyToken,
        "messages": [{
            "type": "text",
            "text": botMessage
        }]
    });
    UrlFetchApp.fetch(URL, {
        "headers": {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + TOKEN
        },
        "method": "post",
        "payload": payload
    });
    return;
}


function sendUserToAdmin() {
  message = "注文が来ました、確認してみましょう。";
  return push(message);
}


function push(text) {
  let url = "https://api.line.me/v2/bot/message/push";
  let headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + TOKEN,
  };

  let postData = {
    "to" : ADMIN,
    "messages" : [
      {
        'type':'text',
        'text':text,
      }
    ]
  };

  let options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}