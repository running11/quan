import axios from 'axios'
import router from '../router'
//管理员带token
const HOST = 'http://quan-dev.xiaoheiban.cn/api/?auth_token=ZGU1ZXJ2NDMrS2lJekN4Q2duWExlNXMvdVNjbGFZcHVTa1dLN2JlUFljM013b1FVVmcvQ081UWRIRzgzMU12YjhleXNWdTRjNFBrZlhzNA==&method=';

//名师带token
// const HOST = 'http://quan-dev.xiaoheiban.cn/a/pi/?auth_token=ZThkYTJxdEU1Vm1LWmRlUHNDWUxtV1ZhUUU0cU1nUURhaTUrNnUrdHlya3BRV0pja3lYWmYyMDlYeFNIanBXTE92NDdHNmpCZmlQbTdZQWZ4MXM=&method=';

//本地测试管理员带token
// const HOST = 'http://192.168.3.8/api/?auth_token=YmMxM1V1cWhTbGMySkNrV3gwMUk0WktTd3E5NXBDRk90VGg1NUhjKzhHdVJ2Y0xzQXR2b2l3NEt3NlI0RlpBTW53N0kveVVuQjBpL09kQQ==&method='
//本地测试名师带token
// const HOST = 'http://192.168.3.8/api/?auth_token=NWZmZWF5dWNJaUxZR0ZoNWs2VXo0SDZLdGpHK1BBbzhjcnVVSm9xME9IaTNyOWRvNGRSR2Z2TTlubjRkcmdSMEF1WUp5RURGTENaZHVBaw==&method='
//本地测试打包
// const HOST = 'http://192.168.3.8/api/?method='
//测试打包
// const HOST = 'http://quan-dev.xiaoheiban.cn/api/?method='
axios.defaults.timeout = 15000;

function ServerError(){
  alert("服务器错误")
}

//get 请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(HOST + url, {params})
      .then((res) => {
        console.log('get请求:'+res)
        if (res.status === 0) {
          return
        }
        if (res.data.callStatus === 'SUCCEED') {
          resolve(res.data);
        } else {
          if (res.data) resolve(res.data);
        }
      }).catch(err => {
        console.log('getError:'+err)
        ServerError();
        reject(err)
      });
  });
}
//post 请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(HOST + url, params)
      .then((res) => {
        console.log("post请求:"+res)
        if (res.status === 500 || res.status === 503 || res.status === 504 || res.status === 404 || res.status === 502) {
          ServerError();
          return
        }
        if (res.data.status === 1) {
          resolve(res);
        } else {
          resolve(res);
        }
      }).catch((err) => {
        reject('网络请求错误');
        console.log("post请求Error:"+err)
        ServerError();
    });
  });
}
