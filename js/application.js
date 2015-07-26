$(document).ready(function(){
  var HighChart = function(){
    this.series = [];

  };

  HighChart.prototype.getData = function(url){

    var successFunction = function(response){
      var items = response.data;
      var date;
      var price;

      for (var i = 0; i < items.length; i++){
        date = new Date(items[i][0]);
        price = items[i][1];
        this.series.unshift({x: date, y: price});
      }

      this.graphData();
    }

    $.ajax({
      context: this,
      type: 'GET',
      url: url,
      success: successFunction
    });

  };

  HighChart.prototype.calcSma = function(data,weekNb){
    var date;
    var price;
    var sma = [];

    for (var i = weekNb; i < data.length; i++){
      date = data[i].x;
      var totalPrice = 0;

      for (var j = 0; j < weekNb; j++){
        totalPrice += data[i-j].y/weekNb;
      }
      
      price = totalPrice;

      sma.push({x: date, y: price});
    }

    return sma;
  }

  HighChart.prototype.graphData = function(){
    var config = {
      title: {
        text: 'Historical Gasoline Prices'
      },
      subtitle: {
        text: 'quandl'
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle'
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        title: {
          text: 'US Dollar ($)'
        }
      },
      series:
      [{
        name: 'Weekly',
        data: this.series
      },
      {
        name: 'Monthly',
        data: this.calcSma(this.series,4)
      },
      {
        name: 'Quarterly',
        data: this.calcSma(this.series,13)
      },
      {
        name: 'Yearly',
        data: this.calcSma(this.series,52)
      }]
    }

    $('#chart').highcharts(config);
  };


  var gasChart = new HighChart();

  gasChart.getData('https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB');

});