// Left Menu
Vue.component('left_menu', {
  props: ['view'],
  template: `
    <div class="left-menu" id="left-menu">

      <div class="left-menu-item">
          <a href="#" @click="$emit('changeview', 'table-dashboard')" :class="{ 'open' : view == 'table-dashboard' }"><i data-feather='list' width='50' height='50' stroke-width='4' class="left-menu-icon"></i></a>
      </div>

      <div class="left-menu-item">
          <a href="#" @click="$emit('changeview', 'chart-dashboard')" :class="{ 'open' : view == 'chart-dashboard' }"><i data-feather='bar-chart-2' width='50' height='50' stroke-width='4' class="left-menu-icon"></i></a>
      </div>

    </div>
  `
})

// Table dashboard
Vue.component('table-dashboard', {
    props: ['view'],
    data: function (){
      return {
        table: null,
        hour: -1,
        selectedHour: 'Now',
        autoreload: true
      }
    },
    methods: {
      changeTable: function(hour){
        
        var url = 'http://localhost:8080/api/ddbb/flows/getFromHour?hour=' + hour;

        this.hour = hour;

        this.table.ajax.url(url);
        this.table.ajax.reload();
      },
      addHour: function(){
        var hours = ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h']
        
        if(this.selectedHour == 'Now'){
          this.selectedHour = '00h-01h';
          return;
        }
        if(this.selectedHour == '23h-00h'){
          this.selectedHour = 'Now';
          return;
        }

        var pos = hours.indexOf(this.selectedHour.split('-')[0]);
        this.selectedHour = hours[(pos + 1) % hours.length] + '-' + hours[(pos + 2) % hours.length]
        
      },
      subHour: function(){
        var hours = ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h']

        if(this.selectedHour == 'Now'){
          this.selectedHour = '23h-00h';
          return;
        }
        if(this.selectedHour == '00h-01h'){
          this.selectedHour = 'Now';
          return;
        }

        var pos = hours.indexOf(this.selectedHour.split('-')[0]);
        this.selectedHour = hours[(pos - 1 + hours.length) % hours.length] + '-' + hours[(pos + hours.length) % hours.length]
        
      },
      changeAutoreload: function(){
        this.autoreload = !this.autoreload;

        if(!this.autoreload){
          $('#play-button').removeClass('glyphicon-pause');
          $('#play-button').addClass('glyphicon-play');
        } else {
          $('#play-button').removeClass('glyphicon-play');
          $('#play-button').addClass('glyphicon-pause');
        }
      }
    },
    mounted () {

      this.table = $('#flowTable').DataTable({
        "scrollY": "50vh",
        "scrollCollapse": true,
        ajax: 'http://localhost:8080/api/ddbb/flows/getFromHour?hour=-1',
        columns: [
            {"data" : "ip_src"},
            {"data" : "ip_dst"},
            {"data" : "port_dst"},
            {"data" : "timestamp"},
            {"data" : "label"}
        ],
        order: [[3, 'desc']],
        pageLength: 100
      });

      $('.dataTables_length').addClass('bs-select');
      var vm = this;
      setInterval( function () {
        if((vm.hour == -1 || vm.hour == '-1' || vm.hour == 'Now') && vm.autoreload){
          vm.table.ajax.reload();
        }
      }, 5000 );
    },
    template: `
        <div class="container">
            <div class="table-outter">
              <table class="table" id="flowTable">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">IP Source</th>
                    <th scope="col">IP Dest</th>
                    <th scope="col">Port</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Label</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </table>
            </div>
            <div class="time-container">
              <div class="row">
                <div class="col-xs-3 col-xs-offset-3 no-margin">
                  <div class="input-group number-spinner">
                    <span class="input-group-btn">
                      <button class="btn btn-default" data-dir="dwn" @click="subHour();"><span class="glyphicon glyphicon-minus"></span></button>
                    </span>

                    <button class="send-hour" @click="changeTable(selectedHour.split('-')[0].replace('h', ''))"> {{this.selectedHour}} </button>

                    <span class="input-group-btn">
                      <button class="btn btn-default" data-dir="up" @click="addHour();"><span class="glyphicon glyphicon-plus"></span></button>
                    </span>
                  </div>
                </div>
                <div>
                  <span class="play-pause">
                    <button class="play-btn" data-dir="up" @click="changeAutoreload();"><span class="glyphicon glyphicon-pause" id="play-button"></span></button>
                  </span>
                </div>
              </div>
            </div>
        </div>
    `
});

// Chart dashboard
Vue.component('chart-dashboard', {
  props: ['chart'],
  mounted () {

  },
  template: `
      <div class="container">
          <div class="top-menu-charts">
            <div class="chart-type not-last">
              <a href="#" @click="$emit('changechart', 'traffic-time')" :class="{ 'open-chart' : chart == 'traffic-time' }"> Traffic/Time </a>
            </div>
            <div class="chart-type not-last">
              <a href="#" @click="$emit('changechart', 'traffic-ip')" :class="{ 'open-chart' : chart == 'traffic-ip' }"> Traffic/IP </a>
            </div>
            <div class="chart-type last">
              <a href="#" @click="$emit('changechart', 'attacks-ip')" :class="{ 'open-chart' : chart == 'attacks-ip' }"> Attacks/IP </a>
            </div>
          </div>

          <keep-alive>
              <component v-bind:is="chart"></component>
          </keep-alive>

      </div>
  `
});

// Traffic/Time chart
Vue.component('traffic-time', {
  props: [],
  mounted() {
    var data = {
      labels: [],
      datasets: [{
        label: 'Flow length (bytes)',
        data: []
      }]
    }

    var ctx = document.getElementById('traffic-time-chart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        elements: {
          line: {
            backgroundColor: 'rgba(241,143,102,0.2)',
            borderColor: 'rgba(237,240,241,0.5)',
            borderWidth: 2
          },
          point: {
            backgroundColor: 'rgba(237,240,241,0.8)',
          }
        },
        scales: {
          yAxes: [{ 
              gridLines: {
                color: 'rgba(60,60,60,0.6)'
              },
              ticks: {
                fontColor: 'rgba(237,240,241,0.8)', // this here
              },
          }],
          xAxes: [{
              display: false,
              gridLines: {
                  display: false,
              },
          }],
        }
      }
    });

    var getData = function() {
      $.ajax({
        url: 'http://localhost:8080/api/ddbb/flows/getChartTrafficTime',
        success: function(data) {
          var oldLabels = myChart.data.labels;

          data = data.chartData;

          // Add new data
          Object.keys(data).map(timestamp => {
            if(!oldLabels.includes(timestamp)){
              myChart.data.labels.push(timestamp);
              myChart.data.datasets[0].data.push(data[timestamp].len);
            }
            else{
              var index = myChart.data.labels.indexOf(timestamp);
              myChart.data.datasets[0].data[index] = data[timestamp].len
            }
          })  
          
          // Remove old data. One hour interval
          oldLabels.map(function (timestamp, index) {
            var oldMinute = timestamp.split(' ')[1].split(':')[1]
            var newMinute = oldLabels[oldLabels.length -1].split(' ')[1].split(':')[1]
            var oldHour = timestamp.split(' ')[1].split(':')[0]
            var newHour = oldLabels[oldLabels.length -1].split(' ')[1].split(':')[0]
            var oldDay = timestamp.split(' ')[0];
            var newDay = oldLabels[oldLabels.length -1].split(' ')[0]

            // same day
            if(newDay == oldDay && newHour > oldHour && newMinute > oldMinute){
              oldLabels.splice(index, 1);
              myChart.data.datasets[0].data.splice(index, 1);
            }
            // same day, long interval
            else if (newDay == oldDay && newHour - oldHour > 1){
              oldLabels.splice(index, 1);
              myChart.data.datasets[0].data.splice(index, 1);
            }
            // More than one day
            else if (newDay - oldDay > 1){
              oldLabels.splice(index, 1);
              myChart.data.datasets[0].data.splice(index, 1);
            }
            // Midnight
            else if(newDay > oldDay && (oldHour < 23 || newMinute > oldMinute)){
              oldLabels.splice(index, 1);
              myChart.data.datasets[0].data.splice(index, 1);
            }
          })
          
          // re-render the chart
          myChart.update();
        }
      });
    };

    getData();
    
    // get new data every 3 seconds
    setInterval(getData, 3000);

  },
  template: `
      <div class="chart-container" width="400px" height="400px"> 
        <canvas id="traffic-time-chart" width="400px" height="400px"></canvas>
      </div>
  
  `
})

// Traffic/IP chart
Vue.component('traffic-ip', {
  props: [],
  mounted() {
    var data = {
      labels: [],
      datasets: [{
        label: 'Flow length (bytes)',
        data: [],
        backgroundColor: 'rgba(237,240,241,0.8)'
      }]
    }

    var ctx = document.getElementById('traffic-ip-chart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        scales: {
          yAxes: [{ 
              gridLines: {
                color: 'rgba(60,60,60,0.6)'
              },
              ticks: {
                fontColor: 'rgba(237,240,241,0.8)', // this here
              },
          }],
          xAxes: [{
              display: false,
              gridLines: {
                  display: false,
              },
          }],
        }
      }
    });

    var getData = function() {
      $.ajax({
        url: 'http://localhost:8080/api/ddbb/flows/getIPTrafficData',
        success: function(data) {
          var oldLabels = myChart.data.labels;

          data = data.chartData;

          myChart.data.labels = Object.keys(data);
          myChart.data.datasets[0].data = Object.values(data);

          // // Add new data
          // Object.keys(data).map(ip_src => {
          //   if(!oldLabels.includes(ip_src)){
          //     myChart.data.labels.push(ip_src);
          //     myChart.data.datasets[0].data.push(data[ip_src].len);
          //   }
          //   else{
          //     var index = myChart.data.labels.indexOf(ip_src);
          //     myChart.data.datasets[0].data[index] = data[ip_src].len
          //   }
          // })  
          
          
          // re-render the chart
          myChart.update();
        }
      });
    };

    getData();
    
    // get new data every 30 seconds
    setInterval(getData, 30000);

  },
  template: `
      <div class="chart-container" width="400px" height="400px"> 
        <canvas id="traffic-ip-chart" width="400px" height="400px"></canvas>
      </div>
  
  `
})

// Traffic/Time chart
Vue.component('attacks-ip', {
  props: [],
  mounted() {

  },
  template: `
      <a class="color: white;"> Attacks/IP chart. Building. </a>
  
  `
})

// App
new Vue({
    el: '#app',
    data: function () {
      return {
        open_view: 'table-dashboard',
        chart_type: 'traffic-time'
      }
    },
    methods: {
      updateView(newView) {
        this.open_view = newView;
      },
      changeChart(newChart) {
        this.chart_type = newChart;
      }
    } 
})