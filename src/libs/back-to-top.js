$(function() {
  var mybutton = $('#myBtn');

  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      mybutton.css({
        opacity: '1',
        visibility: 'visible'
      })
    } else {
      mybutton.css({
        opacity: '0',
        visibility: 'hidden'
      })
    }
  }

  mybutton.on('click', function() {
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });
  })
})
