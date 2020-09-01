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
function whatType(type) {//判断传过来的type类型
  let TypeObject = [
    {
      typeList: ['xlc', 'xll', 'xlm', 'xls', 'xlw', 'xlsx'],
      typeOut: 'excel',
    },
    {
      typeList: ['jpg', 'jpeg', 'png', 'gif'],
      typeOut: 'img',
    },
    {
      typeList: ['zip', '.tar', '.gz'],
      typeOut: 'zip',
    },
    {
      typeList: ['doc', 'docx'],
      typeOut: 'doc',
    },
    {
      typeList: ['ppt', 'pptx'],
      typeOut: 'ppt',
    },
    {
      typeList: ['tar'],
      typeOut: 'tar',
    },
    {
      typeList: ['gzip', 'gz'],
      typeOut: 'gz',
    }
  ]
  let currentType = null;
  TypeObject.forEach(v => {
    let currentIndex = v['typeList'].findIndex(e => e == type)
    if (currentIndex > -1) {
      currentType = v.typeOut
    } else {
      return
    }
  })
  return currentType
}

export function exportInfo(info) {
  return new Promise((resolve, reject) => {
    axios({
      method: info.method,
      url: info.params ? info.url + setUrlParam(info.params) : info.url,
      data: info.params,
      responseType: info.responseType, // 优先尝试 blob
      headers: { 'Authorization': sessionStorage.getItem('token') ? 'Bearer ' + sessionStorage.getItem('token') : '' }
    }).then((res) => {
      console.log(info.type, whatType(info.type), 'whatType(info.type)')
      let objectUrl = null, blob = null;
      if (whatType(info.type) === 'excel') {
        blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        objectUrl = URL.createObjectURL(blob);
      } else if (whatType(info.type) === 'img') {
        blob = new Blob([res.data], { type: 'image/png' });
        objectUrl = URL.createObjectURL(blob);
        // objectUrl = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      } else if (whatType(info.type) === 'zip') {
        blob = new Blob([res.data], { type: 'application/zip' });
        objectUrl = URL.createObjectURL(blob);
      } else if (whatType(info.type) === 'doc') {
        blob = new Blob([res.data], {
          type: "application/msword"
        });
        objectUrl = URL.createObjectURL(blob);
      } else if (whatType(info.type) === 'ppt') {
        blob = new Blob([res.data], {
          type: "application/vnd.ms-powerpoint"
        });
        objectUrl = URL.createObjectURL(blob);
      } else if (whatType(info.type) === 'tar') {
        blob = new Blob([res.data], {
          type: "application/x-tar"
        });
        objectUrl = URL.createObjectURL(blob);
      } else if (whatType(info.type) === 'gz') {
        blob = new Blob([res.data], {
          type: "application/x-gzip"
        });
        objectUrl = URL.createObjectURL(blob);
      } else {
        blob = new Blob([res.data], {
          type: "application/octet-stream"
        });
        objectUrl = URL.createObjectURL(blob);
      }
      console.log(objectUrl, '下载地址')
      let a = document.createElement("a");
      a.href = objectUrl;
      a.download = info.name;
      //a.click();
      //下面这个写法兼容火狐
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      window.URL.revokeObjectURL(blob);
      resolve(res)
    }).catch(error => {
      console.log("response: ", error);
      reject(error)
    })

  })

}
