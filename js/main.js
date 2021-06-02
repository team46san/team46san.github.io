// 変数
// 回答リスト
// var anslist= [0];
var anslist= new Array(152);


// 設問順序
var orderno=1;
// 設問ID
var qid=1;

// botui
var botui = new BotUI('chat-app');

//処理　開始挨拶⇒（制御 ⇒ 制御から質問 ⇒ 質問から回答作成 ⇒ 回答作成から制御 ）
startMessage();
control(orderno);

//制御
function control(orderno){
  if ( orderno >= 5){ //talk.length ) { //とりあえず5問でおためし
    endMessage();
  } else {
    // 質問順序が同じなら、質問出力
    for (let i = 0; i < talk.length; i++) {
      if (talk[i].ORDER == orderno) {
        //回答リストにすでに回答がある場合は、次の設問順序を設定
        if (anslist[i + 1] >= 1) {
          orderno = orderno + 1;
          control(orderno);
          break;
        } else {
          setTalk(i);
          break;
        }
      }
    }
  }
  doend();
}

//回答リスト作成
function answerlist(i,val){
  qid = i + 1;
  anslist[qid] = val;

  //スキップ処理
  if(val == 3){
    for (let index = 1; index < skip.length; index++) {
      //1.まだ回答していない設問
      if (! anslist[index] >= 1) {
        //2.かつ、スキップフラグが1の場合
        if (skip[i][index] == 1) {
          anslist[index] = (qid * 100) + 3;
          console.log(`anslist[index] = ${ anslist[index]}`)
          console.log(`skip[i][index] = ${ skip[i][index]}, i =  ${ i },index =  ${ index }`)
        }
      }
    }
  }
  orderno=orderno + 1;
  control(orderno);
}

//開始挨拶
function startMessage(){
  botui.message.bot({
    loading: true,  
    delay: 2000,  
    content: greet1[0].greet
  })
}

//終了挨拶
function endMessage(){
  botui.message.bot({
    loading: true,  
    delay: 2000,  
    content: greet2[0].greet
  })
  console.log(`ans = ${ anslist }`)

}

//質問出力
function setTalk(i){

  botui.message.bot({
    photo: true,
    photo: 'https://moin.im/face.svg',
    loading: true,
    delay: 1500,  
    content: talk[i].QUESTION
  }).then(function () {
    // return入力待ち状態
    return botui.action.button({
      delay: 1500,  //表示タイミング
      action: [{
        icon: 'circle-thin',  //FontAwesomeアイコン
        text: '聞いたことがない                  ',
        value: 1
      }, {
      //  icon: 'close',
        text: '知っている                        ',
        value: 2    
      }, {
        icon: 'close',
        text: '一人称でできる                     ',
        value: 3    
      }]
    }).then(function(res) { 
      //回答をcontrolメソッドにリターン
      answerlist(i,res.value)
    })
  })
}

function doend(){
  try {
    throw new Error('正常終了');
  } catch (e) {
    console.log(e.message);
  }
}