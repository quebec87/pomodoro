let timerInt;
const timerStateArr = ['notask', 'working', 'break', 'done'];
var timerState = timerStateArr[0];
const workingDuration = 25;
const breakDuration = 5;
const workingDurationSec = workingDuration * 60;
const breakDurationSec = breakDuration * 60;
const totalPei = 5;
let timeGapArr = [workingDurationSec, workingDurationSec / 5 * 4, workingDurationSec / 5 * 3, workingDurationSec / 5 * 2, workingDurationSec / 5 * 1];
let breakGapArr = [breakDurationSec, breakDurationSec / 5 * 4, breakDurationSec / 5 * 3, breakDurationSec / 5 * 2, breakDurationSec / 5];
let isPlaying = false;
const display = $('.time-display');
const dialog = $('.dialog-info p');
const iconDotHtml = '<li class="icon-orange-dot"></li>';
let taskArr;
let currentTask;
let currentTomato;
let totalTomato;
const soundContext = new AudioContext();
let isPlaySound = true;
const orange = '#e46713';
const lightblue = "#1EEEFE";

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
    var name = $('#Task-Name').val();
    var date = $('#Task-Date').val();
    var tomato = $('#Estimated-Tomato').val();
    if (name == "") {
        $('#Task-Name').addClass('alert');
        return;
    } else if (date == "") {
        $('#Task-Date').addClass('alert');
        return;
    } else if (tomato == "") {
        $('#Estimated-Tomato').addClass('alert');
        return;
    }
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
        totalTomato = currentTask.tomato;
        currentTomato = 1;
        setupTotalTomato(currentTask.tomato);
    }
}

function clearForm() {
    $('#Task-Name').removeClass('alert');
    $('#Task-Date').removeClass('alert');
    $('#Estimated-Tomato').removeClass('alert');
    $('#Task-Name').val('My Task');
    $('#Task-Date').val('');
    $('#Estimated-Tomato').val('1');
    $('.tomato-count div').removeClass();
    $('.tomato-count div').addClass('icon-orange-dot');
}


function setClockState() {
    switch (timerState) {
        case timerStateArr[0]:
            $('.add-task-start').css('display', 'block');
            $('.current-task').css('display', 'none');
            $('.timer').removeClass('break');
            $('.timer').addClass('notask');
            $('.time-scale').css('visibility', 'hidden');
            display.html('Hello!<br>+');
            break;
        case timerStateArr[1]:
            $('.timer').removeClass('break');
            $('.timer').removeClass('notask');
            $('.timer').removeClass('done');
            $('.add-task-start').css('display', 'none');
            $('.current-task h2').html(currentTask.name);
            $('.current-task').css('display', 'block');
            for (var i = 0; i < 5; i++) {
                $('.pie' + i).css({
                    'opacity': (i * 0.2) + 0.2,
                    'fill': orange
                });
                var child = '.time-scale li:nth-child(' + (i + 1) + ')';
                $(child).text((5 - i) * 5);
            }
            $('.time-scale').css('visibility', 'visible');
            display.text(`${workingDuration}:00`);
            break;
        case timerStateArr[2]:
            $('.timer').addClass('break');
            $('.timer').removeClass('notask');
            $('.timer').removeClass('done');
            //$('.add-task-start').css('display', 'none');
            //$('.current-task h2').html(currentTask.name);
            //$('.current-task').css('display', 'block');
            for (var i = 0; i < 5; i++) {
                $('.pie' + i).css({
                    'opacity': (i * 0.2) + 0.2,
                    'fill': lightblue
                });
                var child = '.time-scale li:nth-child(' + (i + 1) + ')';
                $(child).text(5 - i);
            }
            $('.time-scale').css('visibility', 'visible');
            display.text(`${breakDuration}:00`);
            break;
        case timerStateArr[3]:
            $('.timer').removeClass('break');
            $('.timer').addClass('done');
            display.html('Done!');
            break;
    }
}

function setupTotalTomato(_count) {
    $('.current-task .total-tomato').empty();
    for (var i = 0; i < _count; i++) {
        $('.current-task .total-tomato').append(iconDotHtml);
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
            timer--;
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            display.text(`${minutes}:${seconds}`);
            checkTimeGap(timer);
            if (timer <= 0) {
                // timer = duration;
                timer = 0;
                resetClicked();
                if (isPlaySound == true) {
                    beep(100, 520, 200);
                }
                $('.pie0').css('opacity', 0.1);
                if (timerState == timerStateArr[1]) {
                    timerState = timerStateArr[2];
                    setClockState();
                } else if (timerState == timerStateArr[2]) {
                    var index = currentTomato - 1;
                    $('.total-tomato li').eq(index).addClass('done');

                    if (currentTomato == totalTomato) {
                        timerState = timerStateArr[3];
                        showDialog();
                        setClockState();
                        return;
                    }
                    currentTomato++;
                    timerState = timerStateArr[1];
                    showDialog();
                    setClockState();
                }
            }

        }
    }, 1000);
}

function checkTimeGap(_timer) {
    var Arr;
    (timerState == timerStateArr[1]) ? Arr = timeGapArr: Arr = breakGapArr;

    if (_timer < Arr[1] && _timer > Arr[2]) {
        $('.pie4').css('opacity', 0.1);
        $('.pie3').css('opacity', 1);
        return;
    } else if (_timer < Arr[2] && _timer > Arr[3]) {
        $('.pie3').css('opacity', 0.1);
        $('.pie2').css('opacity', 1);
        return;
    } else if (_timer < Arr[3] && _timer > Arr[4]) {
        $('.pie2').css('opacity', 0.1);
        $('.pie1').css('opacity', 1);
        return;
    } else if (_timer < Arr[4]) {
        $('.pie1').css('opacity', 0.1);
        $('.pie0').css('opacity', 1);
        return;
    } else if (_timer <= 0) {
        $('.pie0').css('opacity', 0.1);
        return;
    }
}

function showDialog() {
    switch (timerState) {
        case timerStateArr[1]:
            dialog.html('Go for next tomato');
            break;
        case timerStateArr[3]:
            dialog.html('Good Job. Task is done.');
            break;
    }
    $('.dialog-info').addClass('show');
}

function playSoundBtnClicked() {
    if (!$('.btn-sound').hasClass('off')) {
        $(".btn-sound").addClass('off');
        isPlaySound = false;
    } else {
        $('.btn-sound').removeClass('off');
        isPlaySound = true;
    }
}


function beep(vol, freq, duration) {
    v = soundContext.createOscillator();
    u = soundContext.createGain();
    v.connect(u);
    v.frequency.value = freq;
    v.type = "square";
    u.connect(soundContext.destination);
    u.gain.value = vol * 0.01;
    v.start(soundContext.currentTime);
    v.stop(soundContext.currentTime + duration * 0.001);
}

function getPie() {
    var size = $('.inner-circle').width();
    var radius = (Math.round(size * 10) / 10) * 0.5;
    var piePercent = 0.2; ///inner-circle are 5 pie, each is 20%
    var percentageSum = 0;
    var startXY = {
        x: 0,
        y: -radius
    };

    ///inner-circle are 5 pie, each is 20%
    for (var i = 0; i < totalPei; i++) {
        percentageSum += piePercent;
        var angle = Math.PI * 2 * percentageSum;
        var largeArcFlag = piePercent > .5 ? 1 : 0;
        var endXY = {
            x: radius * Math.sin(angle),
            y: radius * Math.cos(angle) * -1,
        };
        let nextXY = {
            x: endXY.x,
            y: endXY.y
        };
        var centerXY = {
            x: 0,
            y: 0
        }
        let moveCommand = "M" + (startXY.x + radius) + "," + (startXY.y + radius);
        let arcCommand = "A" + radius + "," + radius + ",0," + largeArcFlag + ",1," + (endXY.x + radius) + "," + (endXY.y + radius);
        let lineCommand = "L" + (radius + centerXY.x) + "," + (radius + centerXY.y);
        let closePathCommand = "Z";
        startXY = nextXY;
        let d = moveCommand + arcCommand + lineCommand + closePathCommand;
        let sliceEl = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        sliceEl.setAttribute("d", d);
        if (timerState == timerStateArr[0] || timerState == timerStateArr[1]) {
            sliceEl.setAttribute("fill", orange);
        } else {
            sliceEl.setAttribute("fill", lightblue);
        }
        sliceEl.setAttribute('class', 'pie' + i);
        $('.inner-circle').append(sliceEl);
    }

}


$(document).ready(() => {
    taskArr = [];
    getPie();
    menuItemClicked(); // menubar
    // menupanel.  
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

    $('.add-task-start .btn').on('click', addTaskClicked);
    $('.notask .time-display').on('click', addTaskClicked);
    $('.btn-play-pause').on('click', playPauseClicked);
    $('.btn-reset').on('click', resetClicked);
    $('.btn-ok').on('click', function() {
        $('.dialog-info').removeClass('show');
    })
    $('.btn-sound').on('click', playSoundBtnClicked);
});
window.onload = function() {
    var ctx = document.getElementById('chart-holder');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            label: ' ',
            labels: ['7/15', '7/16', '7/17', '7/18', '7/19', '7/20', '7/21'],
            datasets: [{
                data: [6, 6, 4, 6, 6, 0, 0],
                backgroundColor: [
                    lightblue,
                    lightblue,
                    lightblue,
                    'rgba(200, 200, 200, 1)',
                    'rgba(200, 200, 200, 1)',
                    'rgba(200, 200, 200, 1)',
                    'rgba(200, 200, 200, 1)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            layout: {
                padding: {
                    top: 50,
                    bottom: 10
                }
            },
            "hover": {
                "animationDuration": 0
            },
            "animation": {
                "duration": 1,
                "onComplete": function() {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;

                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = orange;

                    this.data.datasets.forEach(function(dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function(bar, index) {
                            var data = dataset.data[index];
                            if (data != 0) {
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            }
                        });
                    });
                }
            },
            tooltips: {
                "enabled": false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)"
                    }
                }],
                xAxes: [{
                    barPercentage: 0.5,
                    barThickness: 6,
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)"
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });

}