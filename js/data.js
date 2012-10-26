$(function () {
    numeral.language('fr');

    var from,
        dateData = [],
        minData = [],
        avgData = [],
        maxData = [],
        successData = [],
        runningData = [],
        failureData = [];

    function createChart() {
        var stockCHart = new Highcharts.StockChart({
            chart : {
                renderTo : 'stockContainer'
            },
            credits: {
                enabled: false
            },
            legend: {
                align: 'left',
                enabled: true,
                floating: true,
                verticalAlign: 'top'
            },
            plotOptions: {
                area: {
                    stacking: 'percent'
                }
            },
            rangeSelector : {
                selected : 0 // 1 month
            },
            series : [
                {
                    name : 'Max',
                    data : maxData,
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: from.valueOf(),
                    type: 'spline',
                    yAxis: 0
                }, {
                    name : 'Avg',
                    data : avgData,
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: from.valueOf(),
                    type: 'spline',
                    yAxis: 0
                }, {
                    name : 'Min',
                    data : minData,
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: from.valueOf(),
                    type: 'spline',
                    yAxis: 0
                }, {
                    name : 'Failure',
                    data : failureData,
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: from.valueOf(),
                    type: 'area',
                    yAxis: 1
                }, {
                    name : 'Running',
                    data : runningData,
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: from.valueOf(),
                    type: 'area',
                    yAxis: 1
                }, {
                    name : 'Success',
                    data : successData,
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: from.valueOf(),
                    type: 'area',
                    yAxis: 1
                }
            ],
            title : {
                text : 'Jobs Duration and Status over Time'
            },
            tooltip: {
                crosshairs: true,
                formatter: function() {
                    var s = '<b>'+ moment(this.x).format('dddd Do MMMM YYYY') +'</b><table><tr><td colspan="3">&nbsp;</td></tr>';
                    var duration = ['Min', 'Avg', 'Max'];

                    $.each(this.points, function(i, point) {
                        s += '<tr><td><span style="color:' + point.series.color + '">' + point.series.name + '</span></td>';

                        if (jQuery.inArray(point.series.name, duration) > -1) {
                            s += '<td colspan="2" align="right">' + moment(point.y).format("HH \\h mm \\min SS \\s") + '</td>';
                        } else {
                            s += '<td align="right">' + numeral(point.y).format('0,0') + '</td>';
                            s += '<td align="right">' + numeral(point.percentage / 100.0).format('0%') + '</td>';
                        }

                        s+= "</tr>";
                    });

                    s += '</table>';

                    return s;
                },
                shared: true,
                useHTML: true
            },
            xAxis: {
                dateTimeLabelFormats: {
                    day: '%e %b',
                    week: '%e %b',
                    month: '%b %y'
                },
                gridLineDashStyle: 'dot',
                gridLineWidth: 1,
                minTickInterval: 24 * 3600 * 1000 // 1 day
            },
            yAxis: [
                {
                    type: 'datetime',
                    height: 250,
                    lineWidth: 1,
                    gridLineDashStyle: 'dot',
                    title: {
                        text: 'Duration (hours and minutes)'
                    },
                    min: 0,
                    plotBands: [
                        {
                            from: 0,
                            to: 5 * 60 * 1000,
                            color: '#BCEE68'
                        }, {
                            from: 5 * 60 * 1000,
                            to: 10 * 60 * 1000,
                            color: '#FFA07A'
                        }, {
                            from: 10 * 60 * 1000,
                            to: 60 * 60 * 1000,
                            color: '#EE6363'
                        }
                    ],
                    showFirstLabel: false
                }, {
                    height: 250,
                    top: 350,
                    lineWidth: 1,
                    labels: {
                        formatter: function() {
                            return this.value + ' %'
                        }
                    },
                    offset: 0,
                    title: {
                        text: 'Status'
                    },
                    showFirstLabel: false
                }
            ]
        });
    }

    $.get('data.csv', function(data) {
        var lines = data.split('\n');

        $.each(lines, function(lineNo, line) {
            if (lineNo > 0) {
                var items = line.split(',');
                var date = moment(items[0]);

                if (from == null) {
                    from = date;
                } else if (date < from) {
                    from = date;
                }

                dateData.push(date);
                minData.push(parseInt(items[1]));
                avgData.push(parseInt(items[2]));
                maxData.push(parseInt(items[3]));
                successData.push(parseInt(items[4]));
                runningData.push(parseInt(items[5]));
                failureData.push(parseInt(items[6]));
            }
        });
        
        createChart();
    });
});