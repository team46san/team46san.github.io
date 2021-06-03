// 変数
// 設問数
let cnt_order = 10; //talk.length テストとして10問まで。
// 設問順序
let orderno = 1;
// 設問ID
let qid = 1;
// 回答リスト
let anslist= new Array(152);
// botui
let botui = new BotUI('chat-app');

// 処理
// 【概要】　
// 開始挨拶⇒（制御 ⇒ 制御から質問 ⇒ 質問から回答作成 ⇒ 回答作成から制御 ）⇒終了挨拶
startMessage();
control(orderno);

//制御
function control(orderno){

  //全て回答された場合、終了処理
  if ( orderno >= cnt_order ) {
    
    console.log(`ans = ${ anslist }`)
    insertDb();
    endMessage();
    doend();

  //次の設問を設定
  } else {
    // 質問順序(変数)と設問リストの質問順序(talk.order)が同じ場合、質問出力
    for (let i = 0; i < talk.length; i++) {
      if (talk[i].ORDER == orderno) {
        //回答リストにすでに回答がある(スキップにて自動入力されている)場合、設問順序(変数)をカウントアップ
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
  
}

//回答リスト作成
function answerlist(i,val){
  qid = i + 1;
  anslist[qid] = val;

///////////////////////////////////////////todo　ここにログDB1
  //スキップ判定(スキップ対象なら自動回答)
  if(val == 3){
    for (let index = 1; index < skip.length; index++) {
      //1.回答リストにまだ回答が入力されていない場合
      if (! anslist[index] >= 1) {
        //2.かつ、スキップリストのフラグが1の場合
        if (skip[i][index] == 1) {
          anslist[index] = (qid * 100) + 3;
///////////////////////////////////////todo　ここにログDB1
          // console.log(`anslist[index] = ${ anslist[index]}`)

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
}

//質問出力
function setTalk(i){

  botui.message.bot({
    photo: true,
    photo: 'pic/robot.jpeg',
    loading: true,
    delay: 1500,  
    content: talk[i].QUESTION
  }).then(function () {
    // return入力待ち状態
    return botui.action.button({
      delay: 1500,  //表示タイミング
      action: [{
        icon: 'circle-thin',  //FontAwesomeアイコン
        text: '聞いたことがない           ',
        value: 1
      }, {
      //  icon: 'close',
        text: '知っている                 ',
        value: 2    
      }, {
        icon: 'close',
        text: '一人称でできる              ',
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

function insertDb() {

  // 回答リストを文字列変換
  let str_ans = anslist.join(",")

  //DB登録
  const db=firebase.firestore();
  const collection = db.collection('ANSWER LIST');

  collection.add({
    anserlist : str_ans,
  })
  .then(doc => {
  console.log(`${doc.id} added!`)
  })
}