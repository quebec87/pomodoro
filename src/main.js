let timerInt;
const timerStateArr = ['notask', 'working', 'break'];
var timerState = timerStateArr[0];
const workingDuration = 0.2;
const breakDuration = 0.1;
const workingDurationSec = workingDuration * 60;
const breakDurationSec = breakDuration * 60;
let isPlaying = false;
const display = $('.time-display');
let taskArr;
let currentTask;

// ////////////MENU//////////////////
function menuItemClicked() {
    $('.menuitem').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        openMenuPanel();
    });
}
// add task btn when no task
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
    $('#Estimated-Tomato').change(function() {
        const dot = $('.tomato-count>div');
        dot.removeClass();
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

function addtaskSubmitted(e) {
    e.preventDefault();
    storeTask(true);
    clearForm();
    closeMenuPanel();
    timerState = timerStateArr[1];
    setClockState();
}


function storeTask(_add) {
    var name = $('#Task-Name').val();
    var date = $('#Task-Date').val();
    var tomato = $('#Estimated-Tomato').val();
    var done = false;
    let taskObj = {
        'name' = name,
        'date' = date,
        'tomato' = tomato,
        'done' = done
    };
    if (_add) {
        taskArr.push(taskObj);
        currentTask = taskArr[taskArr.length - 1];
    }
}

function clearForm() {
    $('#Task-Name').val('My Task');
    $('#Task-Date').val('');
    $('#Estimated-Tomato').val('1');
}


function setClockState() {
    switch (timerState) {
        case timerStateArr[0]:
            $('.add-task-start').css('display', 'block');
            $('.current-task').css('display', 'none');
            $('.timer').removeClass('break');
            $('.timer').addClass('notask');
            display.html('Hello!<br>+');
            break;
        case timerStateArr[1]:
            $('.timer').removeClass('break');
            $('.timer').removeClass('notask');
            $('.add-task-start').css('display', 'none');
            $('.current-task').html(currentTask.name);
            $('.current-task').css('display', 'block');
            display.text(`${workingDuration}:00`);
            break;
        case timerStateArr[2]:
            $('.timer').addClass('break');
            $('.timer').removeClass('notask');
            $('.add-task-start').css('display', 'none');
            $('.current-task').html(currentTask.name);
            $('.current-task').css('display', 'block');
            display.text(`${breakDuration}:00`);
            break;
    }
}


function playPauseClicked() {
    if (!$('.btn-play-pause').hasClass('playing')) {
        $('.btn-play-pause').addClass('playing');
        isPlaying = true;
        if (timerInt == undefined) {
            if (timerState == timerStateArr[1]) {
                startTimer(workingDurationSec, display);
                $('.outer-circle>circle').css('animation-duration', `${workingDurationSec}s`);
            } else if (timerState == timerStateArr[2]) {
                startTimer(breakDurationSec, display);
                $('.outer-circle>circle').css('animation-duration', `${breakDurationSec}s`);
            }
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
        window.clearInterval(timerInt);
        timerInt = undefined;
        isPlaying = false;
        $('.btn-play-pause').removeClass('playing');
        $('.outer-circle>circle').css('animation-play-state', 'paused');
        $('.outer-circle').removeClass('start');
        if (timerState == timerStateArr[1]) {
            display.text(`${workingDuration}:00`);
        } else if (timerState == timerStateArr[2]) {
            display.text(`${breakDuration}:00`);
        }
    }
}

function startTimer(duration, display) {
    let timer = duration;
    let minutes;
    let seconds;
    timerInt = window.setInterval(() => {
        if (isPlaying == true) {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            display.text(`${minutes}:${seconds}`);

            if (--timer < 0) {
                // timer = duration;
                timer = 0;
                resetClicked();
                if (timerState == timerStateArr[1]) {
                    timerState = timerStateArr[2];
                    setClockState();
                }
            }
        }
    }, 1000);
}


$(document).ready(() => {
    taskArr = [];
    menuItemClicked(); // menubar
    // menupanel
    $('#Task-Date').datepicker();
    $('#Task-List-Date').datepicker();
    $('#Analytics-Date').datepicker();
    setTomatoCount();
    $('#Add-Task-Btn').on('click', addtaskSubmitted);
    //
    $('main').on('click', function(e) {
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