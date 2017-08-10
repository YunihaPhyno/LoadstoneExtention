$(function(){

  // セーブボタンが押されたら、
  // ローカルストレージに保存する。
  $("#save").click(function () {
    chrome.storage.sync.set({"flickrUserId" : $("#flickrUserId").val(), "fixedPhrase": $("#fixedPhrase").val()}, OnClickSavedButton);
  });


  // オプション画面の初期値を設定する
  chrome.storage.sync.get(["flickrUserId", "fixedPhrase"], OnLoad);
});

function OnClickSavedButton () {
  console.log ("save succeed!!");
  alert ("保存完了！\n\nFlickr\n" + $("#flickrUserId").val() + "\n\n定型文\n" + $("#fixedPhrase").val());
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
  console.log ("load succeed!!");
}