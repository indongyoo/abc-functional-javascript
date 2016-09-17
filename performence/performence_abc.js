if (typeof global == 'object') {
    require('./../example/js/abc.js');
}

var time = 10;
var length = 999;
var start = Date.now();
function task(i, cb) {
    //console.log(i);
    setTimeout(function() {
        cb(i);
    }, time);
}
CB(task);

var tasks = [task];
for (var k = 0; k < length; k++) {
    tasks.push(task);
}
tasks.push(function() {
    console.log('abcjs: ' + (Date.now() - start - (time * (length+1))) + 'ms');
});
C(1, tasks);