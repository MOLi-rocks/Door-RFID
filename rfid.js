
/*引入模組*/
var readline = require('readline');
//載入node.js的檔案系統模組
var fs = require("fs"),filename = "holder.txt",encode = "utf8";

/*讀入檔案 並且儲存*/
//宣告陣列 lines 
var lines;
var check = function(){
    fs.readFile(filename, encode, function(err, file) {
        if(err){ //如果有錯誤就列印訊息並離開程式
            console.log('檔案讀取錯誤。');
        }
        else {
            //把檔案的內容輸出
            //注意content變數的類型不是一個字串（String）
            //而是一個Buffer物件，所以要用 Buffer.toString() 方法來
            //把這Buffer物件的內容變成一個字串，以作輸出。
            var context = file.toString();
            lines = context.split('\n');
        }
    });
}
var  rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});
var search  = function(answer){
    var i = 0;
    for(i=0;i<lines.length;i++){
        if(answer==lines[i]){
            return i;
        }
        else if(answer!=lines[i]&& i==lines.length-1){
            return 0;
        }
    }
}
check();
rl.on('line', (answer) => {
    var a  = search(answer);
    if(a != 0)
    {
        console.log("keyholder為："+lines[a-1]);
    }else{
        console.log("沒有"+answer+"的資料");
    }
});
