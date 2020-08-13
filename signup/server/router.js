var express = require("express");
var url = require("url");
var db = require("./database");
const { send } = require("process");
var router = express.Router();
function User(loadCode=null,Data=null){
    this.loadCode = loadCode;
    this.Data = Data;
};
var OnlineUsers = [];

router.get("/ConfirmId",async (req,res) => {
    var params = url.parse(req.url,true).query;
    var StuIdList = JSON.parse(await db.StuIdList());
    console.log("Confirm accept:"+params.sid);
    if(StuIdList)
        if(StuIdList.indexOf(params.sid) !== -1){
            var UserList = JSON.parse(await db.GetUserList());
            for(var i = 2;i<UserList.length;i++){
                if(UserList[i].stuid == params.sid){
                    res.send({code:0,flag:2});
                    return;
                }
            }
            res.send({code:0,flag:1});
        }
        else 
            res.send({code:0,flag:0});
    else
        res.send({code:1,flag:0});
});

router.post("/LoadUser",async (req,res)=>{
    for(var i=0;i<OnlineUsers.length;i++)
        if(req.body.loadCode == OnlineUsers[i].loadCode){
            res.send({code:0,userData:OnlineUsers[i].Data});
            return;
        }
    res.send({code:1,userData:null});
});

router.post("/LoadUserList",async (req,res)=>{
    var UserList = JSON.parse(await db.GetUserList());
    if(UserList){
        for(var i=0;i<OnlineUsers.length;i++)
        if(req.body.loadCode == OnlineUsers[i].loadCode){
            res.send({code:0,adminData:OnlineUsers[i].Data,userList:UserList});
            return;
        }
        res.send({code:1,adminData:null,userData:null});
    }
    else
        res.send({code:2,adminData:null,userData:null});
})

router.post("/Offline",async (req,res)=>{
    console.log("Offline request recieved from %s",req.body.account);
    for(var i=0;i<OnlineUsers.length;i++)
        if(req.body.loadCode == OnlineUsers[i].loadCode){
            OnlineUsers.splice(i,1);
            console.log("Account %s offline by load code %s",req.body.account,req.body.loadCode);
            res.send({code:0});
            return;
        }
    res.send({code:1});
});

router.post("/Update",async (req,res)=>{
    console.log("Update request recieved from %s",req.body.account);
    var UserList = JSON.parse(await db.GetUserList());
    for(var i=0;i<UserList.length;i++)
        if(UserList[i].account == req.body.account){
            UserList[i].nickName = req.body.nickName;
            UserList[i].email = req.body.email == "" ? "unknown" : req.body.email;
            break;
        }
    if(!await db.UpdateUserList(UserList))
        res.send({code:0});
    else
        res.send({code:1});
    console.log("Update finishied!");
});

router.post("/DeleteUser",async (req,res)=>{
    console.log("Delete request recieved. The user is %s",req.body.account);
    var UserList = JSON.parse(await db.GetUserList());
    for(var i=0;i<UserList.length;i++)
        if(UserList[i].account == req.body.account){
            UserList.splice(i,1);
            break;
        }
    if(!await db.UpdateUserList(UserList))
        res.send({code:0});
    else
        res.send({code:1});
});

router.post("/Register",async (req,res) => {
    var UserList = JSON.parse(await db.GetUserList());
    var account = String(Number(UserList[UserList.length-1].account) + 1);
    var StuIdList = JSON.parse(await db.StuIdList());
    var StuDatas = JSON.parse(await db.StudentData());
    var UserData = StuDatas[StuIdList.indexOf(req.body.sid)];
    UserData.account = account;
    UserData.email = "unknown";
    UserData.password = req.body.password;
    UserData.nickName = req.body.nickName;
    console.log("Register recieved: ");
    console.log(UserData);
    if(db.RegisterUser(UserData))
        res.send({code:0,account:account});
    else
        res.send({code:1,account:account});
});

router.post("/Login",async (req,res) => {
    var UserList = JSON.parse(await db.GetUserList());
    console.log("Recieve a login request from: account = %s",req.body.account);
    if(UserList){
        var account = req.body.account;
        var password = req.body.password;
        for(var i=0;i<UserList.length;i++)
            if(UserList[i].account == account || UserList[i].stuid == account || UserList[i].email == account)
                if(UserList[i].password == password){
                    res.send({code:0,flag:true});
                    OnlineUsers.push(new User(req.body.randomCode,UserList[i]));
                    console.log("Access accept! LoadCode is %s.",req.body.randomCode);
                    return;
                }
        res.send({code:0,flag:false});
        console.log("Access denied!");
    }
    else{
        res.send({code:1,flag:false});
        console.log("Failed to response!");
    }
});

module.exports = router;