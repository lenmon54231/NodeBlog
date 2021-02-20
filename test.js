
console.log($(".upload-btn-input--1NeEX")[0], '111111')
$(".upload-btn-input--1NeEX")[0].load(() => {
  $(".upload-btn-input--1NeEX")[0].click()
})


setTimeout(() => {
  console.log($(".upload-btn-input--1NeEX")[0], '111111')
  $(".upload-btn-input--1NeEX")[0].click()
}, 3000);

$(document).ready(function(){
  console.log('3333',$(".upload-btn-input--1NeEX")[0])
$(".upload-btn-input--1NeEX")[0].click()
});
