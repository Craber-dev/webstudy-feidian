var fs = require("fs");

async function StudentData(){
    return await fs.promises.readFile("./StuDatas.json","utf-8",(err,data)=>{
        if(err){
            console.log("学生信息读取失败");
            return;
        }
        else{
            console.log("学生信息读取成功");
            var resulte = data;
            return resulte;
        }
    })
}

async function StuIdList(){
    return await fs.promises.readFile("./StuIds.json","utf-8",(err,data)=>{
        if(err){
            console.log("学号列表读取失败");
            return;
        }
        else{
            console.log("学号列表读取成功");
            var resulte = String(data);
            return resulte;
        }
    })
}

async function GetUserList(){
    return await fs.promises.readFile("./UserList.json","utf-8",(err,data)=>{
        if(err){
            console.log("用户信息读取失败");
            return;
        }
        else
        {
            console.log("用户信息读取成功");
            var resulte = data;
            return JSON.parse(resulte);
        }
    });
}

async function UpdateUserList(UserList){
    return fs.promises.writeFile("UserList.json",JSON.stringify(UserList),"utf-8",(err)=>{
        if(err){
            console.log("刷新用户列表失败");
            return false;
        }
        else{
            console.log("刷新用户列表成功");
            return true;
        }
    })
}

async function RegisterUser(UserData){
    UserList = JSON.parse(await GetUserList());
    //console.log(UserList);
    if(UserList)
    {
        UserList.push(UserData);
        if(await UpdateUserList(UserList))
            return true;
        else
            return false;
    }
    else
        return false;
}

module.exports = {StudentData,StuIdList,GetUserList,UpdateUserList,RegisterUser};