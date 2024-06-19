document.addEventListener('DOMContentLoaded', () => {
    const agentsSelect = document.getElementById('agents');
    const usdPerHourInput = document.getElementById('usd-per-hour');
    const monthlyPaySpan = document.getElementById('monthly-pay');
    const shift5DaysSelect = document.getElementById('shift-5-days');
    const shift6DaysSelect = document.getElementById('shift-6-days');
    const minDialsInput = document.getElementById('min-dials');
    const minAppointmentsInput = document.getElementById('min-appointments');
    const clickToCallCheckbox = document.getElementById('click-to-call');
    const leadOpeningCheckbox = document.getElementById('lead-opening');
    const vehicleSearchCheckbox = document.getElementById('vehicle-search');
    const eleadsMiscCheckbox = document.getElementById('eleads-misc');
    const summaryElement = document.getElementById('summary');

    function updateMonthlyPay() {
        const usdPerHour = parseFloat(usdPerHourInput.value);
        const monthlyPay = (usdPerHour * 8 * 20).toFixed(2); // Assuming 20 working days in a month
        monthlyPaySpan.textContent = `(${monthlyPay} USD/month)`;
    }

    function createChart(container, title) {
        return Highcharts.chart(container, {
            chart: {
                type: 'column'
            },
            title: {
                text: title
            },
            xAxis: {
                categories: ['Time Saved (hours)', 'Money Saved (USD)', 'Appointments Gained']
            },
            yAxis: {
                title: {
                    text: 'Values'
                }
            },
            series: [{
                name: title,
                data: [],
                colorByPoint: true,
                colors: ['blue', 'gold', 'green']
            }],
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            const categories = ['hours', 'USD', 'appts'];
                            return `${this.y.toFixed(2)} ${categories[this.point.index]}`;
                        }
                    }
                }
            }
        });
    }

    function createCombinationChart(container) {
        return Highcharts.chart(container, {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Hover to See the Numbers'
            },
            xAxis: [{
                categories: getMonthNames(),
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} USD',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Money Saved (USD)',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Values',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            series: [{
                name: 'Money Saved (USD)',
                type: 'spline',
                yAxis: 1,
                data: [],
                tooltip: {
                    valueSuffix: ' USD'
                }
            }, {
                name: 'Time Saved (hours)',
                type: 'column',
                data: [],
                tooltip: {
                    valueSuffix: ' hours'
                }
            }, {
                name: 'Appointments Gained',
                type: 'column',
                data: [],
                tooltip: {
                    valueSuffix: ' appts'
                }
            }]
        });
    }

    function getMonthNames() {
        const monthNames = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
            monthNames.push(currentDate.toLocaleString('default', { month: 'long' }));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return monthNames;
    }

    const dayChart = createChart('day-chart', 'Day');
    const weekChart = createChart('week-chart', 'Week');
    const monthChart = createChart('month-chart', 'Month');
    const yearChart = createChart('year-chart', 'Year');
    const combinationChart = createCombinationChart('combination-chart');

    function calculateSavings() {
        const agents = parseInt(agentsSelect.value);
        const usdPerHour = parseFloat(usdPerHourInput.value);
        const minDials = parseInt(minDialsInput.value);
        const minAppointments = parseInt(minAppointmentsInput.value);

        const clickToCall = clickToCallCheckbox.checked;
        const leadOpening = leadOpeningCheckbox.checked;
        const vehicleSearch = vehicleSearchCheckbox.checked;
        const eleadsMisc = eleadsMiscCheckbox.checked;

        // Calculate time saved in seconds
        let timeSavedPerDay = 0;
        if (clickToCall) {
            timeSavedPerDay += minDials * 10; // 10 seconds per dial
        }
        if (leadOpening) {
            timeSavedPerDay += (300 / 15) * 30; // 30 seconds per 15 leads, up to 300 leads per 8-hour shift
        }
        if (vehicleSearch) {
            timeSavedPerDay += 30 * 30; // 30 seconds per search, up to 30 searches per day
        }
        if (eleadsMisc) {
            timeSavedPerDay += 300; // up to 300 seconds per 8-hour shift
        }

        const timeSavedPerWeek = timeSavedPerDay * 5; // 5 days a week
        const timeSavedPerMonth = (timeSavedPerWeek * 52) / 12; // Average month length based on 52 weeks in a year
        const timeSavedPerYear = timeSavedPerWeek * 52;

        // Convert time saved to hours
        const hoursSavedPerDay = (timeSavedPerDay / 3600).toFixed(2);
        const hoursSavedPerWeek = (timeSavedPerWeek / 3600).toFixed(2);
        const hoursSavedPerMonth = (timeSavedPerMonth / 3600).toFixed(2);
        const hoursSavedPerYear = (timeSavedPerYear / 3600).toFixed(2);

        // Multiply by the number of agents
        const totalHoursSavedPerDay = (hoursSavedPerDay * agents).toFixed(2);
        const totalHoursSavedPerWeek = (hoursSavedPerWeek * agents).toFixed(2);
        const totalHoursSavedPerMonth = (hoursSavedPerMonth * agents).toFixed(2);
        const totalHoursSavedPerYear = (hoursSavedPerYear * agents).toFixed(2);

        // Calculate total daily pay
        const dailyPay = shift5DaysSelect.value ? (8 * usdPerHour) : (12 * usdPerHour);
        const totalDailyPay = dailyPay * agents;

        // Calculate money saved
        const moneySavedPerDay = ((hoursSavedPerDay / (shift5DaysSelect.value || 12)) * dailyPay).toFixed(2);
        const totalMoneySavedPerDay = (moneySavedPerDay * agents).toFixed(2);
        const moneySavedPerWeek = (totalMoneySavedPerDay * 5).toFixed(2);
        const moneySavedPerMonth = (moneySavedPerWeek * 52 / 12).toFixed(2);
        const moneySavedPerYear = (moneySavedPerWeek * 52).toFixed(2);

        // Calculate appointments gained
        const appointmentsPerHour = (15 / 8); // 15 appointments per 8-hour shift
        const appointmentsGainedPerDay = (hoursSavedPerDay * appointmentsPerHour).toFixed(2);
        const totalAppointmentsGainedPerDay = (appointmentsGainedPerDay * agents).toFixed(2);
        const appointmentsGainedPerWeek = (totalAppointmentsGainedPerDay * 5).toFixed(2);
        const appointmentsGainedPerMonth = (appointmentsGainedPerWeek * 52 / 12).toFixed(2);
        const appointmentsGainedPerYear = (appointmentsGainedPerWeek * 52).toFixed(2);

        // Update chart data
        dayChart.series[0].setData([parseFloat(totalHoursSavedPerDay), parseFloat(totalMoneySavedPerDay), parseFloat(totalAppointmentsGainedPerDay)]);
        weekChart.series[0].setData([parseFloat(totalHoursSavedPerWeek), parseFloat(moneySavedPerWeek), parseFloat(appointmentsGainedPerWeek)]);
        monthChart.series[0].setData([parseFloat(totalHoursSavedPerMonth), parseFloat(moneySavedPerMonth), parseFloat(appointmentsGainedPerMonth)]);
        yearChart.series[0].setData([parseFloat(totalHoursSavedPerYear), parseFloat(moneySavedPerYear), parseFloat(appointmentsGainedPerYear)]);

        // Update combination chart data
        const months = getMonthNames();
        const monthlyData = {
            timeSaved: [],
            moneySaved: [],
            appointmentsGained: []
        };

        let cumulativeTimeSaved = 0;
        let cumulativeMoneySaved = 0;
        let cumulativeAppointmentsGained = 0;

        for (let i = 0; i < 12; i++) {
            cumulativeTimeSaved += parseFloat(totalHoursSavedPerMonth);
            cumulativeMoneySaved += parseFloat(moneySavedPerMonth);
            cumulativeAppointmentsGained += parseFloat(appointmentsGainedPerMonth);

            monthlyData.timeSaved.push(cumulativeTimeSaved.toFixed(2));
            monthlyData.moneySaved.push(cumulativeMoneySaved.toFixed(2));
            monthlyData.appointmentsGained.push(cumulativeAppointmentsGained.toFixed(2));
        }

        combinationChart.series[0].setData(monthlyData.moneySaved.map(value => parseFloat(value)));
        combinationChart.series[1].setData(monthlyData.timeSaved.map(value => parseFloat(value)));
        combinationChart.series[2].setData(monthlyData.appointmentsGained.map(value => parseFloat(value)));

        // Update summary
        summaryElement.innerHTML = `By not automating repetitive tasks, your BDC misses out on ${parseFloat(totalHoursSavedPerYear)} hours, ${parseFloat(moneySavedPerYear)} USD, and ${parseFloat(appointmentsGainedPerYear)} appointments every year. Streamline your processes to allow agents more time for calls and appointments, boosting your productivity and revenue.`;
    }

    usdPerHourInput.addEventListener('input', updateMonthlyPay);

    shift5DaysSelect.addEventListener('change', () => {
        if (shift5DaysSelect.value) {
            shift6DaysSelect.disabled = true;
        } else {
            shift6DaysSelect.disabled = false;
        }
        calculateSavings();
    });

    shift6DaysSelect.addEventListener('change', () => {
        if (shift6DaysSelect.value) {
            shift5DaysSelect.disabled = true;
        } else {
            shift5DaysSelect.disabled = false;
        }
        calculateSavings();
    });

    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', calculateSavings);
    });

    calculateSavings();
});
