$(function () {
    var from = new Date(2012, 0, 1).getTime(),
        to = new Date().getTime(),
        start = to - 30 * 24 * 3600 * 1000,
        minData = [],
        avgData = [],
        maxData = [],
        successData = [],
        runningData = [],
        failureData = [],
        nbDays = 0;
            
    for (var current = from; current <= to ; current = new Date(current + 24 * 3600 * 1000).getTime()) {
        minData[nbDays] = Math.floor(Math.random() * 1000 * 20);
        avgData[nbDays] = Math.floor(Math.random() * 1000 * 60 * 2) + 1000 * 20;
        maxData[nbDays] = Math.floor(Math.random() * 1000 * 60 * 8) + 1000 * 20 + 1000 * 60 * 2;
        successData[nbDays] = Math.floor(Math.random() * 1000) + 2000;
        runningData[nbDays] = Math.floor(Math.random() * 50) + 50;
        failureData[nbDays] = Math.floor(Math.random() * 400) + 100;
                
        ++nbDays;
    }
    
    var masterChart, detailChart;

    function createMaster() {
        masterChart = new Highcharts.Chart({
            chart: {
                renderTo: 'master-chartContainer',
                zoomType: 'x',
                borderWidth: 0,
                marginLeft: 50,
                marginRight: 50,
                reflow: false,
                events: {
                    selection: function(event) {
                        var extremesObject = event.xAxis[0],
                            min = extremesObject.min,
                            max = extremesObject.max,
                            maxDetailData = [],
                            avgDetailData = [],
                            minDetailData = [],
                            xAxis = this.xAxis[0];
    
                        jQuery.each(this.series[0].data, function(i, point) {
                            if (point.x > min && point.x < max) {
                                maxDetailData.push({
                                    x: point.x,
                                    y: point.y
                                });
                                avgDetailData.push({
                                    x: point.x,
                                    y: avgData[i]
                                });
                                minDetailData.push({
                                    x: point.x,
                                    y: minData[i]
                                });
                            }
                        });
    
                        xAxis.removePlotBand('mask-current');
                        xAxis.addPlotBand({
                            id: 'mask-current',
                            from: min,
                            to: max,
                            color: 'rgba(0, 0, 0, 0.2)'
                        });
    
                        detailChart.series[0].setData(maxDetailData);
                        detailChart.series[1].setData(avgDetailData);
                        detailChart.series[2].setData(minDetailData);
    
                        return false;
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: null
            },
            xAxis: {
                type: 'datetime',
                minPadding: 0,
                maxPadding: 0,
                minRange: (nbDays - 1) * 24 * 3600 * 1000,
                tickWidth: 0,
                dateTimeLabelFormats: {
                    month: '%B %Y'
                },
                title: {
                    text: null
                },
                showFirstLabel: false,
                plotBands: [{
                    id: 'mask-current',
                    from: start,
                    to: to,
                    color: 'rgba(0, 0, 0, 0.2)'
                }]
            },
            yAxis: [{
                gridLineWidth: 1,
                lineWidth: 1,
                type: 'datetime',
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                showFirstLabel: false
                }, {
                opposite: true,
                lineWidth: 1,
                title: {
                    text: null
                }
            }],
            tooltip: {
                formatter: function() {
                    return false;
                }
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 70],
                        stops: [
                            [0, '#4572A7'],
                            [1, 'rgba(0,0,0,0)']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'Max',
                pointInterval: 24 * 3600 * 1000,
                pointStart: from,
                data: maxData,
                type: 'area'
            }]
        },
        function(masterChart) {
            createDetail(masterChart)
        });
    }
                
    function createDetail(masterChart) {
        var minDetailData = [],
            avgDetailData = [],
            maxDetailData = [];
    
        jQuery.each(masterChart.series[0].data, function(i, point) {
            if (point.x >= start) {
                minDetailData.push(minData[i]);
                avgDetailData.push(avgData[i]);
                maxDetailData.push(point.y);
            }
        });
    
        detailChart = new Highcharts.Chart({
            chart: {
                renderTo: 'detail-chartContainer',
                reflow: false,
                marginLeft: 50,
                marginRight: 50
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Jobs Duration over Time'
            },
            subtitle: {
                text: '(in hours and minutes)'
            },
            xAxis: {
                type: 'datetime',
                gridLineDashStyle: 'dot',
                gridLineWidth: 1,
                minPadding: 0,
                maxPadding: 0,
                labels: {
                    align: 'right',
                    rotation: -45
                },
                dateTimeLabelFormats: {
                    day: '%a %d %b',
                    week: '%a %d %b'
                }
            },
            yAxis: [{
                type: 'datetime',
                lineWidth: 1,
                gridLineDashStyle: 'dot',
                title: {
                    text: null
                },
                min: 0,
                showFirstLabel: false,
                maxZoom: 0.1
                }, {
                opposite: true,
                linkedTo: 0,
                type: 'datetime',
                lineWidth: 1,
                gridLineWidth: 0,
                showFirstLabel: false
            }],
            tooltip: {
                useHTML: true,
                formatter: function() {
                    var s = '<b>'+ Highcharts.dateFormat('%A %d %B %Y', this.x) +'</b><table><tr><td colspan="2">&nbsp;</td></tr>';

                    $.each(this.points, function(i, point) {
                        s += '<tr><td><span style="color:' + point.series.color + '">' + point.series.name + '</span></td>';
                        s += '<td align="right">' + Highcharts.dateFormat('%H h %M min %S s', point.y) + '</td></tr>';
                    });
                            
                    s += '</table>';

                    return s;
                },
                shared: true,
                crosshairs: true
            },
            legend: {
                floating: true,
                align: 'left',
                verticalAlign: 'top',
                reversed: true,
                x: 60,
                y: 10
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 3
                            }
                        }
                    }
                }
            },
            series: [
                {
                    name: 'Max',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: start,
                    data: maxDetailData,
                    type: 'spline'
                }, {
                    name: 'Avg',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: start,
                    data: avgDetailData,
                    type: 'spline'
                }, {
                    name: 'Min',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: start,
                    data: minDetailData,
                    type: 'spline'
                }
            ]
        });
    }
                
    var $chartContainer = $('#chartContainer').css('position', 'relative');
    $('<div id="detail-chartContainer">').css({ height: 600 }).appendTo($chartContainer);
    $('<div id="master-chartContainer">').css({ position: 'absolute', top: 600, height: 100, width: '100%' }).appendTo($chartContainer);
    
    //createMaster();
    
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
            reversed: true,
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
                pointStart: from,
                type: 'spline',
                yAxis: 0
            }, {
                name : 'Avg',
                data : avgData,
                pointInterval: 24 * 3600 * 1000,
                pointStart: from,
                type: 'spline',
                yAxis: 0
            }, {
                name : 'Min',
                data : minData,
                pointInterval: 24 * 3600 * 1000,
                pointStart: from,
                type: 'spline',
                yAxis: 0
            }, {
                name : 'Failure',
                data : failureData,
                pointInterval: 24 * 3600 * 1000,
                pointStart: from,
                type: 'area',
                yAxis: 1
            }, {
                name : 'Running',
                data : runningData,
                pointInterval: 24 * 3600 * 1000,
                pointStart: from,
                type: 'area',
                yAxis: 1
            }, {
                name : 'Success',
                data : successData,
                pointInterval: 24 * 3600 * 1000,
                pointStart: from,
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
                var s = '<b>'+ Highcharts.dateFormat('%A %d %B %Y', this.x + 24 * 3600 * 1000) +'</b><table><tr><td colspan="3">&nbsp;</td></tr>';
                var duration = ['Min', 'Avg', 'Max'];
                
                $.each(this.points, function(i, point) {
                    s += '<tr><td><span style="color:' + point.series.color + '">' + point.series.name + '</span></td>';
                    
                    if (jQuery.inArray(point.series.name, duration) > -1) {
                        s += '<td colspan="2" align="right">' + Highcharts.dateFormat('%H h %M min %S s', point.y) + '</td>';
                    } else {
                        s += '<td align="right">' + Highcharts.numberFormat(point.y, 0, '', ' ') + '</td>';
                        s += '<td align="right">' + Highcharts.numberFormat(point.percentage, 0) + ' %</td>';
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