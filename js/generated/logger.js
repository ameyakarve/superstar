var logger$689 = function () {
    var data$690 = {};
    var action$691 = function (payload$692, data$693) {
        console.log('Log from ' + payload$692.source + ': ' + payload$692.value.message);
        return data$693;
    };
    return {
        data: data$690,
        action: action$691
    };
};
module.exports = logger$689;