$(function(){

  // セーブボタンが押されたら、
  // ローカルストレージに保存する。
  $("#save").click(function () {
    chrome.storage.sync.set({"flickrUserId" : $("#flickrUserId").val(),
                            "fixedPhrase": $("#fixedPhrase").val(), 
                            "fixedPhraseFCForum": $("#fixedPhraseFCForum").val(),
                            "title_diary": $("#title_diary").val(), 
                            "title_forum": $("#title_forum").val()}, OnClickSavedButton);
  });


  // オプション画面の初期値を設定する
  chrome.storage.sync.get(["flickrUserId", "fixedPhrase", "fixedPhraseFCForum", "title_diary", "title_forum"], OnLoad);
});

function OnClickSavedButton () {
  console.log ("save succeed!!");
  alert ("保存完了！\n\nFlickr\n" + $("#flickrUserId").val() + "\n\n定型文(日記)\n[" + $("#title_diary").val() + "]\n" + $("#fixedPhrase").val() + "\n\n定型文(FCフォーラム)\n[" + $("#title_forum").val() + "]\n" + $("#fixedPhraseFCForum").val());
}

function OnLoad (items) {
  console.log(items);

  if (items["flickrUserId"]) {
    $("#flickrUserId").val(items["flickrUserId"]);
  } else {
    $("#flickrUserId").val("123456789@N01");
  }

  if (items["fixedPhrase"]) {
    $("#fixedPhrase").val(items["fixedPhrase"]);
  }

  if (items["fixedPhraseFCForum"]) {
    $("#fixedPhraseFCForum").val(items["fixedPhraseFCForum"]);
  }

  if (items["title_diary"]) {
    $("#title_diary").val(items["title_diary"]);
  }

  if (items["title_forum"]) {
    $("#title_forum").val(items["title_forum"]);
  }
  console.log ("load succeed!!");
}