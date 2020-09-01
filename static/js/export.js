import axios from 'axios';

function setUrlParam(data) {
  let _str = '';
  for (let i in data) {
    if (!isNull(data[i])) {
      _str += i + '=' + encodeURIComponent(data[i]) + '&';
    }
  }
  return '?' + _str.substring(0, _str.length - 1);
}
function isNull(e) { // 排除为0 或者其他情况
  let _ = String(e);
  return (_ === 'null' || _ === 'NaN' || _ === 'undefined' || _.length === 0);
}

export function exportInfo(info) {
  return new Promise((resolve, reject)=>{
    axios({
      method:info.method,
      url:info.params ? info.url+ setUrlParam(info.params) : info.url,
      data:info.params,
      responseType: info.responseType, // 优先尝试 blob
      headers:{'Authorization':sessionStorage.getItem('token') ?'Bearer '+sessionStorage.getItem('token'):''}
    }).then((res) => {
      let objectUrl = null,blob = null;
      if(info.type === 'excel'){
        blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        objectUrl = URL.createObjectURL(blob);
      }else if(info.type === 'img'){
        objectUrl = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      }else if(info.type === 'zip'){
        blob = new Blob([res.data], {type: 'application/zip'});
        objectUrl = URL.createObjectURL(blob);
      }else if(info.type === 'doc'){
        blob = new Blob([res.data], {
          type: "application/msword"
        });
        objectUrl = URL.createObjectURL(blob);
      }
      let a = document.createElement("a");
      a.href = objectUrl;
      a.download = info.name;
      //a.click();
      //下面这个写法兼容火狐
      a.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
      window.URL.revokeObjectURL(blob);
      resolve(res) 
    }).catch(error => {
      console.log("response: ", error);
      reject(error)
    })

  })

}
