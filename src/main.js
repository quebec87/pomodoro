function menuItemClicked() {
  $('.menuitem').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    openMenuPanel();
  });
}

function addTaskClicked() {
  $('.menuitem').eq(0).click();
}

function openMenuPanel() {
  if (!$('.menupanel').hasClass('open')) {
    // open panel
    $('.menupanel').addClass('open');
    showPanContent();
  } else {
    // render content
    showPanContent();
  }
}

function showPanContent() {
  const index = $('.menuitem.active').index();
  $('.menupan-content').siblings().removeClass('show');
  $('.menupan-content').eq(index).addClass('show');
}

function closeMenuPanel() {
  $('.menupanel').removeClass('open');
}
$(document).ready(() => {
  menuItemClicked();
  $('main').on('click', function (e) {
    if (e.target !== this) {
      return;
    }
    closeMenuPanel();
  });

  $('.add-task-start').on('click', addTaskClicked);
});
