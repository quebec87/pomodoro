let timerInt;const timerStateArr=["notask","working","break","done"];var timerState=timerStateArr[0];const workingDuration=25,breakDuration=5,workingDurationSec=60*workingDuration,breakDurationSec=60*breakDuration,totalPei=5;let timeGapArr=[workingDurationSec,workingDurationSec/5*4,workingDurationSec/5*3,workingDurationSec/5*2,workingDurationSec/5*1],breakGapArr=[breakDurationSec,breakDurationSec/5*4,breakDurationSec/5*3,breakDurationSec/5*2,breakDurationSec/5],isPlaying=!1;const display=$(".time-display"),dialog=$(".dialog-info p"),iconDotHtml='<li class="icon-orange-dot"></li>';let taskArr,currentTask,currentTomato,totalTomato;const soundContext=new AudioContext;let isPlaySound=!0;const orange="#e46713",lightblue="#1EEEFE";function menuItemClicked(){$(".menuitem").click(function(){$(this).siblings().removeClass("active"),$(this).addClass("active"),openMenuPanel()})}function addTaskClicked(){$(".menuitem").eq(0).click()}function openMenuPanel(){$(".menupanel").hasClass("open")?showPanContent():($(".menupanel").addClass("open"),$(".main").addClass("menuopen"),showPanContent())}function showPanContent(){if($(".menuitem").hasClass("active")){const t=$(".menuitem.active").index();$(".menupan-content").siblings().removeClass("show"),$(".menupan-content").eq(t).addClass("show")}else $(".menupan-content").siblings().removeClass("show"),$(".menupan-content").eq(4).addClass("show")}function closeMenuPanel(){$(".menuitem").removeClass("active"),$(".menupanel").removeClass("open"),$(".menupan-content").removeClass("show"),$(".main").removeClass("menuopen")}function setTomatoCount(){$("#Estimated-Tomato").change(function(){const t=$(".tomato-count>div");switch(t.removeClass(),$(this).val()){case"1":t.addClass("icon-orange-dot");break;case"2":t.addClass("icon-orange-dot-two");break;case"3":t.addClass("icon-orange-dot-three");break;case"4":t.addClass("icon-orange-dot-four");break;case"5":t.addClass("icon-orange-dot-five")}})}function addtaskSubmitted(t){t.preventDefault();var e=$("#Task-Name").val(),a=$("#Task-Date").val(),i=$("#Estimated-Tomato").val();""!=e?""!=a?""!=i?(storeTask(!0),clearForm(),closeMenuPanel(),timerState=timerStateArr[1],setClockState()):$("#Estimated-Tomato").addClass("alert"):$("#Task-Date").addClass("alert"):$("#Task-Name").addClass("alert")}function storeTask(t){var e=$("#Task-Name").val(),a=$("#Task-Date").val(),i=$("#Estimated-Tomato").val(),o=!1;let r={name:e=e,date:a=a,tomato:i=i,done:o=o};t&&(taskArr.push(r),currentTask=taskArr[taskArr.length-1],totalTomato=currentTask.tomato,currentTomato=1,setupTotalTomato(currentTask.tomato))}function clearForm(){$("#Task-Name").removeClass("alert"),$("#Task-Date").removeClass("alert"),$("#Estimated-Tomato").removeClass("alert"),$("#Task-Name").val("My Task"),$("#Task-Date").val(""),$("#Estimated-Tomato").val("1"),$(".tomato-count div").removeClass(),$(".tomato-count div").addClass("icon-orange-dot")}function setClockState(){switch(timerState){case timerStateArr[0]:$(".add-task-start").css("display","block"),$(".current-task").css("display","none"),$(".timer").removeClass("break"),$(".timer").addClass("notask");for(var t=0;t<5;t++)$(".pie"+t).css({opacity:1,fill:orange});$(".time-scale").css("visibility","hidden"),display.html("Hello!<br>+");break;case timerStateArr[1]:$(".timer").removeClass("break"),$(".timer").removeClass("notask"),$(".timer").removeClass("done"),$(".add-task-start").css("display","none"),$(".current-task h2").html(currentTask.name),$(".current-task").css("display","block");for(t=0;t<5;t++){$(".pie"+t).css({opacity:.2*t+.2,fill:orange});var e=".time-scale li:nth-child("+(t+1)+")";$(e).text(5*(5-t))}$(".time-scale").css("visibility","visible"),display.text(`${workingDuration}:00`);break;case timerStateArr[2]:$(".timer").addClass("break"),$(".timer").removeClass("notask"),$(".timer").removeClass("done"),$(".current-task h2").html("Time to Take a Break");for(t=0;t<5;t++){$(".pie"+t).css({opacity:.2*t+.2,fill:lightblue});e=".time-scale li:nth-child("+(t+1)+")";$(e).text(5-t)}$(".time-scale").css("visibility","visible"),display.text(`${breakDuration}:00`);break;case timerStateArr[3]:$(".timer").removeClass("break"),$(".timer").addClass("done"),display.html("Done!")}}function setupTotalTomato(t){$(".current-task .total-tomato").empty();for(var e=0;e<t;e++)$(".current-task .total-tomato").append(iconDotHtml)}function playPauseClicked(){$(".btn-play-pause").hasClass("playing")?(isPlaying=!1,$(".btn-play-pause").removeClass("playing"),$(".outer-circle>circle").css("animation-play-state","paused")):($(".btn-play-pause").addClass("playing"),isPlaying=!0,null==timerInt&&(timerState==timerStateArr[1]?(startTimer(workingDurationSec,display),$(".outer-circle>circle").css("animation-duration",`${workingDurationSec}s`)):timerState==timerStateArr[2]&&(startTimer(breakDurationSec,display),$(".outer-circle>circle").css("animation-duration",`${breakDurationSec}s`))),$(".outer-circle").addClass("start"),$(".outer-circle>circle").css("animation-play-state","running"))}function resetClicked(){null!=timerInt&&(window.clearInterval(timerInt),timerInt=void 0,isPlaying=!1,$(".btn-play-pause").removeClass("playing"),$(".outer-circle>circle").css("animation-play-state","paused"),$(".outer-circle").removeClass("start"),timerState==timerStateArr[1]?display.text(`${workingDuration}:00`):timerState==timerStateArr[2]&&display.text(`${breakDuration}:00`))}function deleteTaskClicked(){$(".warning p").html(currentTask.name),openMenuPanel()}function deleteTaskSureClicked(){resetClicked(),timerState=timerStateArr[0],setClockState(),taskArr.pop(),closeMenuPanel()}function startTimer(t,e){let a,i,o=t;timerInt=window.setInterval(()=>{if(1==isPlaying&&(o--,a=parseInt(o/60,10),i=parseInt(o%60,10),a=a<10?`0${a}`:a,i=i<10?`0${i}`:i,e.text(`${a}:${i}`),checkTimeGap(o),o<=0))if(o=0,resetClicked(),1==isPlaySound&&beep(100,520,200),$(".pie0").css("opacity",.1),timerState==timerStateArr[1])timerState=timerStateArr[2],setClockState();else if(timerState==timerStateArr[2]){var t=currentTomato-1;if($(".total-tomato li").eq(t).addClass("done"),currentTomato==totalTomato)return timerState=timerStateArr[3],showDialog(),void setClockState();currentTomato++,timerState=timerStateArr[1],showDialog(),setClockState()}},1e3)}function checkTimeGap(t){var e;return t<(e=timerState==timerStateArr[1]?timeGapArr:breakGapArr)[1]&&t>e[2]?($(".pie4").css("opacity",.1),void $(".pie3").css("opacity",1)):t<e[2]&&t>e[3]?($(".pie3").css("opacity",.1),void $(".pie2").css("opacity",1)):t<e[3]&&t>e[4]?($(".pie2").css("opacity",.1),void $(".pie1").css("opacity",1)):t<e[4]?($(".pie1").css("opacity",.1),void $(".pie0").css("opacity",1)):void(t<=0&&$(".pie0").css("opacity",.1))}function showDialog(){switch(timerState){case timerStateArr[1]:dialog.html("Go for next tomato");break;case timerStateArr[3]:dialog.html("Good Job. Task is done.")}$(".dialog-info").addClass("show")}function playSoundBtnClicked(){$(".btn-sound").hasClass("off")?($(".btn-sound").removeClass("off"),isPlaySound=!0):($(".btn-sound").addClass("off"),isPlaySound=!1)}function beep(t,e,a){v=soundContext.createOscillator(),u=soundContext.createGain(),v.connect(u),v.frequency.value=e,v.type="square",u.connect(soundContext.destination),u.gain.value=.01*t,v.start(soundContext.currentTime),v.stop(soundContext.currentTime+.001*a)}function getPie(){for(var t=$(".inner-circle").width(),e=Math.round(10*t)/10*.5,a=0,i={x:0,y:-e},o=0;o<totalPei;o++){a+=.2;var r=2*Math.PI*a,n={x:e*Math.sin(r),y:e*Math.cos(r)*-1};let t={x:n.x,y:n.y};var s={x:0,y:0};let l="M"+(i.x+e)+","+(i.y+e);i=t;let c=l+("A"+e+","+e+",0,0,1,"+(n.x+e)+","+(n.y+e))+("L"+(e+s.x)+","+(e+s.y))+"Z",d=document.createElementNS("http://www.w3.org/2000/svg","path");d.setAttribute("d",c),timerState==timerStateArr[0]||timerState==timerStateArr[1]?d.setAttribute("fill",orange):d.setAttribute("fill",lightblue),d.setAttribute("class","pie"+o),$(".inner-circle").append(d)}}$(document).ready(()=>{taskArr=[],getPie(),menuItemClicked(),$("#Task-Date").datepicker(),$("#Task-List-Date").datepicker(),$("#Analytics-Date").datepicker(),setTomatoCount(),$("#Add-Task-Btn").on("click",addtaskSubmitted),$("main").on("click",function(t){t.target===this&&closeMenuPanel()}),$(".add-task-start .btn").on("click",addTaskClicked),$(".notask .time-display").on("click",addTaskClicked),$(".btn-play-pause").on("click",playPauseClicked),$(".btn-reset").on("click",resetClicked),$(".btn-delete").on("click",deleteTaskClicked),$(".btn-cancel").on("click",closeMenuPanel),$(".btn-delete-sure").on("click",deleteTaskSureClicked),$(".btn-ok").on("click",function(){$(".dialog-info").removeClass("show")}),$(".btn-sound").on("click",playSoundBtnClicked)}),window.onload=function(){var t=document.getElementById("chart-holder");new Chart(t,{type:"bar",data:{label:" ",labels:["7/15","7/16","7/17","7/18","7/19","7/20","7/21"],datasets:[{data:[6,6,4,6,6,0,0],backgroundColor:[lightblue,lightblue,lightblue,"rgba(200, 200, 200, 1)","rgba(200, 200, 200, 1)","rgba(200, 200, 200, 1)","rgba(200, 200, 200, 1)"],borderWidth:0}]},options:{layout:{padding:{top:50,bottom:10}},hover:{animationDuration:0},animation:{duration:1,onComplete:function(){var t=this.chart,e=t.ctx;e.font=Chart.helpers.fontString(Chart.defaults.global.defaultFontSize,Chart.defaults.global.defaultFontStyle,Chart.defaults.global.defaultFontFamily),e.textAlign="center",e.textBaseline="bottom",e.fillStyle=orange,this.data.datasets.forEach(function(a,i){t.controller.getDatasetMeta(i).data.forEach(function(t,i){var o=a.data[i];0!=o&&e.fillText(o,t._model.x,t._model.y-5)})})}},tooltips:{enabled:!1},scales:{yAxes:[{ticks:{display:!1},gridLines:{color:"rgba(0, 0, 0, 0)"}}],xAxes:[{barPercentage:.5,barThickness:6,gridLines:{color:"rgba(0, 0, 0, 0)"}}]},legend:{display:!1}}})};