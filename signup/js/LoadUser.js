var LoadCode;
var UserData;
var sourceUrl = "file:///C:/Users/ASUS/Desktop/signup/signup/html/user.html?loadcode=";
var loadCode = window.location.href.slice(sourceUrl.length);
LoadCode = loadCode;
ajax({
    url:"http://localhost:8080/LoadUser",
    method:"post",
    data:{loadCode:loadCode},
    success:(res) => {
        const {code,userData} = res;
        if(code == 0)
        {
            UserData = userData;
            console.log(UserData);
        }
        else
            alert("加载用户信息失败");
    }
});