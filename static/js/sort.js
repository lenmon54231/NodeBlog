function sort(arr) {
  // 冒泡
  if (arr instanceof Object) {
    if (arr.length == 1) {
      return arr;
    } else {
      let itemTem = null;
      let length = arr.length;
      for (let i = 0; i < length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          itemTem = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = itemTem;
        }
      }
      length--;
      return arr;
    }
  }
}
console.log(sort([10, 7, 9, 11, 22, 33, 4, 2, 0, 1000]));

function bubFun(arr) {
  let newItem = null,
    len = arr.length;
  while (len > 0) {
    for (let i = 0; i < len - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        newItem = arr[i]; // 记录新元素等于当前位置的数字
        arr[i] = arr[i + 1]; // 将当前位置跟后面一个大于当前位置的数字调换位置
        arr[i + 1] = newItem;
      }
    }
    len--;
  }
  return arr;
}

var arr = [10, 7, 9, 11, 22, 33, 4, 2, 0, 1000],
  bubbling = bubFun(arr);
console.log(bubbling);

//从小到大
function BubbleSort(arr) {
  var i, j, temp;
  for (i = 0; i < arr.length - 1; i++) {
    for (j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
    }
  }
  return arr;
}
var arr = [10, 7, 9, 11, 22, 33, 4, 2, 0, 1000];
BubbleSort(arr);
console.log(arr);

export function quickSort(arr) {}
