let timerInt;
const hasTask = false;
let isPlaying = false;
const isBreak = false;
const display = $('.time-display');

// ////////////MENU//////////////////
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
    $('.menupanel').addClass('open');
    $('.main').addClass('menuopen');
    showPanContent();
  } else {
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
  $('.main').removeClass('menuopen');
}

function setTomatoCount() {
  $('#Estimated-Tomato').change(function () {
    const dot = $('.tomato-count>div');
    dot.removeClass();
    console.log($(this).val());
    switch ($(this).val()) {
      case '1':
        dot.addClass('icon-orange-dot');
        break;
      case '2':
        dot.addClass('icon-orange-dot-two');
        break;
      case '3':
        dot.addClass('icon-orange-dot-three');
        break;
      case '4':
        dot.addClass('icon-orange-dot-four');
        break;
      case '5':
        dot.addClass('icon-orange-dot-five');
        break;
    }
  });
}


function playPauseClicked() {
  if (!$('.btn-play-pause').hasClass('playing')) {
    $('.btn-play-pause').addClass('playing');
    isPlaying = true;
    if (timerInt == undefined) {
      startTimer(true, (60 * 25), display);
    }
    $('.outer-circle').addClass('start');
    $('.outer-circle>circle').css('animation-play-state', 'running');
  } else {
    isPlaying = false;
    $('.btn-play-pause').removeClass('playing');
    $('.outer-circle>circle').css('animation-play-state', 'paused');
  }
}

function resetClicked() {
  if (timerInt != undefined) {
    startTimer(false, (60 * 25), display);
    $('.btn-play-pause').removeClass('playing');
    $('.outer-circle>circle').css('animation-play-state', 'paused');
    $('.outer-circle').removeClass('start');
  }
}

function startTimer(_start, duration, display) {
  let timer = duration;
  let minutes;
  let seconds;
  if (_start == true) {
    timerInt = window.setInterval(() => {
      if (isPlaying == true) {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        display.text(`${minutes}:${seconds}`);

        if (--timer < 0) {
          timer = duration;
        }
      }
    }, 1000);
  } else {
    window.clearInterval(timerInt);
    timerInt = undefined;
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    display.text(`${minutes}:${seconds}`);
  }
}


$(document).ready(() => {
  menuItemClicked(); // menubar
  // menupanel
  $('#Task-Date').datepicker();
  $('#Task-List-Date').datepicker();
  $('#Analytics-Date').datepicker();
  setTomatoCount();
  //
  $('main').on('click', function (e) {
    if (e.target !== this) {
      return;
    }
    closeMenuPanel();
  });

  $('.add-task-start').on('click', addTaskClicked);
  $('.notask .time-display').on('click', addTaskClicked);
  $('.btn-play-pause').on('click', playPauseClicked);
  $('.btn-reset').on('click', resetClicked);
});
