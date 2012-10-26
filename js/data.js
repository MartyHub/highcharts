$(function () {
    numeral.language('fr');
    
    var from = moment('2012-01-01'),
        minData = [],
        avgData = [],
        maxData = [],
        successData = [],
        runningData = [],
        failureData = [],
        nbDays = 0;
            
    for (var current = from.clone(), to = moment(); current <= to ; current.add('days', 1)) {
        minData[nbDays] = Math.floor(Math.random() * 1000 * 20);
        avgData[nbDays] = Math.floor(Math.random() * 1000 * 60 * 2) + 1000 * 20;
        maxData[nbDays] = Math.floor(Math.random() * 1000 * 60 * 8) + 1000 * 20 + 1000 * 60 * 2;
        successData[nbDays] = Math.floor(Math.random() * 1000) + 2000;
        runningData[nbDays] = Math.floor(Math.random() * 50) + 50;
        failureData[nbDays] = Math.floor(Math.random() * 400) + 100;

        ++nbDays;
    }
    
    var stockCHart;
    
    stockCHart = new Highcharts.StockChart({
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
});