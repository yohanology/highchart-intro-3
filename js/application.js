$(document).ready(function(){
  var HighChart = function(){
    this.series = [];

  };

  HighChart.prototype.getData = function(){

    var successFunction = function(response){
      var items = response.data;
      var date;
      var price;

      for (var i = 0; i < items.length; i++){
        date = new Date(items[i][0]);
        price = items[i][1];
        this.series.unshift({x: date, y: price});
      }
      
      console.log(this.series);
      console.log(this.calcSma(this.series,4))

      // this.calcSma(this.series,4)

      // for (var i = 4; i < this.series.length; i++){
      //   date = this.series[i].x;
      //   price = (this.series[i].y + this.series[i-1].y + this.series[i-2].y + this.series[i-3].y)/4;
      //   this.seriesMonth.push({x: date, y: price});
      // }
      
      // console.log(this.seriesMonth);
      
      // for (var i = 9; i < this.seriesMonth.length; i++){
      //   date = this.seriesMonth[i].x;
      //   price = (this.seriesMonth[i].y + this.seriesMonth[i-4].y + this.seriesMonth[i-8].y)/3;
      //   this.seriesQuarter.push({x: date, y: price});
      // }

      // console.log(this.seriesQuarter);

      // for (var i = 48; i < this.seriesQuarter.length; i++){
      //   date = this.seriesQuarter[i].x;
      //   price = (this.seriesQuarter[i].y + this.seriesQuarter[i-12].y + this.seriesQuarter[i-24].y + this.seriesQuarter[i-36])/4;
      //   this.seriesYear.push({x: date, y: price});
      // }

      // console.log(this.seriesYear);

      this.graphData();
    }

    $.ajax({
      context: this,
      type: 'GET',
      url: 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB',
      success: successFunction
    });

  };

  HighChart.prototype.calcSma = function(data,freq){
    var date;
    var price;
    var sma = [];

    for (var i = freq; i < data.length; i++){
      date = data[i].x;
      var totalPrice = 0;

      for (var j = 0; j < freq; j++){
        totalPrice += data[i-j].y/freq;
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
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        title: {
          text: 'Price'
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
        data: this.calcSma(this.series,12)
      },
      {
        name: 'Yearly',
        data: this.calcSma(this.series,48)
      }]
    }

    $('#chart').highcharts(config);
  };


  var gasChart = new HighChart();

  gasChart.getData();

});