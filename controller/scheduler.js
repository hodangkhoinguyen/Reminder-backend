import schedule from 'node-schedule';

const rule = new schedule.RecurrenceRule();
var at = new Date();

var time = at.setSeconds(at.getSeconds() + Number(5))  //after 5 second     
schedule.scheduleJob(new Date(time),function(){
    console.log('hi--viral');
});
