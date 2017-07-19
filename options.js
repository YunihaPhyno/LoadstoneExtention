$(function(){

  // セーブボタンが押されたら、
  // ローカルストレージに保存する。
  $("#save").click(function () {
    chrome.storage.sync.set({"flickrUserId" : $("#flickrUserId").val()}, OnSavedFlickrUserId);
  });


  // オプション画面の初期値を設定する
  chrome.storage.sync.get(['flickrUserId'], OnLoadFlickrUserId);
});

function OnSavedFlickrUserId () {
  console.log ("save succeed!!");
}

function OnLoadFlickrUserId (items) {
  console.log(items["flickrUserId"]);

  if (items["flickrUserId"]) {
    $("#flickrUserId").val(items["flickrUserId"]);
  } else {
    $("#flickrUserId").val("123456789@N01");
  }
  console.log ("load succeed!!");
}