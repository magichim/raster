var mobile_check = function () {
  navigator.userAgent.match(/Android|iPhone|iPod|IEMobile|Opera Mini|BlackBerry/i) ?
    alert('Mobile phone can\'t use this site.') : true;
};