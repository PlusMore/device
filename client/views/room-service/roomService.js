Template.roomService.events({
  'click #jump-to-order': function () {
    var $main = $('.main');
    var height = $main[0].scrollHeight;
    
    $main.animate({ scrollTop: height+"px" });
  }
});