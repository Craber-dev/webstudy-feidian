const ajax = ({
    url = "",
    method = "get",
    params = {},
    data = {},
    headers = {},
    success = () => {},
    error = () => {}
}) => {
    var xhr;
    if(window.XMLHttpRequest)
        xhr = new XMLHttpRequest();
    else
        xhr = new XMLHttpRequest("Microsoft.XMLHTTP");

    if (method === "get" && JSON.stringify(params) !== "{}"){
        url += "?";
        for (let i in params) {
            url += `${i}=${params[i]}&`;
        }
        url = url.slice(0, url.length - 1);
    }
    console.log(url);

    xhr.open(method,url,true);

    for(let i in headers)
        xhr.setRequestHeader(i,headers[i]);

    if(method === "post"){
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
    else
        xhr.send();

    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4)
            if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 0) {
              const result = xhr.responseText;
              success(JSON.parse(result));
            }
    }

    xhr.onerror = function(err){
        console.error(err);
    }
}