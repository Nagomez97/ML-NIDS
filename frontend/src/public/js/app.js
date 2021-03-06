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

      <div class="left-menu-item">
          <a href="#" @click="$emit('changeview', 'options')" :class="{ 'open' : view == 'options' }"><i data-feather='crosshair' width='45' height='45' stroke-width='2' class="left-menu-icon"></i></a>
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
      getCookie: function(c_name){
          var i,x,y,ARRcookies=document.cookie.split(";");
      
          for (i=0;i<ARRcookies.length;i++)
          {
              x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
              y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
              x=x.replace(/^\s+|\s+$/g,"");
              if (x==c_name)
              {
                  return unescape(y);
              }
           }
      },
      changeTable: function(hour){

        var token = this.getCookie('token');
        var username = this.getCookie('username');

        var url = 'https://' + location.hostname +':8080/api/ddbb/flows/getFromHour?hour=' + hour + '&token=' + token + '&username='+username;

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
      },
      setTarget: function(){
        var ip = $('#modal-ip').text()
        var token = this.getCookie('token');
        var username = this.getCookie('username');

        $.ajax({
          type: "POST",
          url: "https://" + location.hostname +":8080/api/ddbb/ips/setTarget",
          data: {ip: ip, username:username, token:token},
          crossDomain: true,
          dataType: 'json'
        })
      },
      setDestTarget: function(){
        var ip = $('#modal-dest-ip').text()
        var token = this.getCookie('token');
        var username = this.getCookie('username');

        $.ajax({
          type: "POST",
          url: "https://" + location.hostname +":8080/api/ddbb/ips/setTarget",
          data: {ip: ip, username:username, token:token},
          crossDomain: true,
          dataType: 'json'
        })
      }
    },
    mounted () {

      var token = this.getCookie('token');
      var username = this.getCookie('username');

      this.table = $('#flowTable').DataTable({
        "scrollY": "50vh",
        "scrollCollapse": true,
        ajax: 'https://' + location.hostname +':8080/api/ddbb/flows/getFromHour?hour=-1&token='+token+'&username='+username,
        columns: [
            {"data" : "ip_src"},
            {"data" : "ip_dst"},
            {"data" : "port_dst"},
            {"data" : "timestamp"},
            {"data" : "label"}
        ],
        order: [[3, 'desc']],
        pageLength: 100,
        "rowCallback": function(row, data) {
          if (data['label'].includes("Attack")){
            $('td:eq(4)', row).addClass('red');
          }
          else{
            $('td:eq(4)', row).addClass('green');
          }
        }
      });

      $(document).on('click', '#flowTable tbody tr', async function() {

        var ip = $(this)[0].cells[0].innerText;
        var dest_ip = $(this)[0].cells[1].innerText;

        var targeted = await axios.post(`https://${location.hostname}:8080/api/ddbb/ips/isTargeted`, {
          ip: ip,
          username: username,
          token: token
        })

        var dest_targeted = await axios.post(`https://${location.hostname}:8080/api/ddbb/ips/isTargeted`, {
          ip: dest_ip,
          username: username,
          token: token
        })

        targeted = targeted.data.targeted;
        dest_targeted = dest_targeted.data.targeted;

        // If host is already targeted, cant add again
        if(targeted){
          $("#modal-content").text("Host already targeted.");
          $("#modal-button").addClass("disabled-button");
        }
        else {
          $("#modal-content").text("Send host to Targets?");
          $("#modal-button").removeClass("disabled-button");
        }

        // If dest host is already targeted, cant add again
        if(dest_targeted){
          $("#modal-dest-content").text("Destination host already targeted.");
          $("#modal-dest-button").addClass("disabled-button");
        }
        else {
          $("#modal-dest-content").text("Send host to Targets?");
          $("#modal-dest-button").removeClass("disabled-button");
        }

        $("#modal-ip").text($(this)[0].cells[0].innerText);
        $("#modal-dest-ip").text($(this)[0].cells[1].innerText);
        $("#hostModal").modal("show");
      })

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
            <!-- Modal -->
            <div id="hostModal" class="modal fade" role="dialog">
              <div class="modal-dialog">
            
                <!-- Modal content-->
                <div class="modal-content">

                 <!-- Source host-->
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title" id="modal-ip">Host Settings</h4>
                  </div>
                  <div class="modal-body">                    
                    <p id="modal-content">Send host to Targets?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" id="modal-button" class="btn btn-default" data-dismiss="modal" @click="setTarget">Set Target</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  </div>
                  
                  <!-- Destination host-->
                  <div class="modal-header">
                    <h4 class="modal-title" id="modal-dest-ip">Dest host Settings</h4>
                  </div>
                  <div class="modal-body">                    
                    <p id="modal-dest-content">Send destination host to Targets?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" id="modal-dest-button" class="btn btn-default" data-dismiss="modal" @click="setDestTarget">Set Target</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  </div>
                </div>
            
              </div>
            </div>

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
                <div class="col-xs-3 col-xs-offset-3 no-margin buttons">
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
  methods: {
    getCookie: function(c_name){
      var i,x,y,ARRcookies=document.cookie.split(";");
  
      for (i=0;i<ARRcookies.length;i++)
      {
          x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
          y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
          x=x.replace(/^\s+|\s+$/g,"");
          if (x==c_name)
          {
              return unescape(y);
          }
       }
    }
  },
  mounted() {
    var data = {
      labels: [],
      datasets: [{
        label: 'Flow length (Bytes)',
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
      var username = this.getCookie('username');
      var token = this.getCookie('token');

      $.ajax({
        url: 'https://' + location.hostname +':8080/api/ddbb/flows/getChartTrafficTime?token='+token+'&username='+username,
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
  methods: {
    getCookie: function(c_name){
      var i,x,y,ARRcookies=document.cookie.split(";");
  
      for (i=0;i<ARRcookies.length;i++)
      {
          x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
          y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
          x=x.replace(/^\s+|\s+$/g,"");
          if (x==c_name)
          {
              return unescape(y);
          }
       }
    }
  },
  mounted() {
    var data = {
      labels: [],
      datasets: [{
        label: 'Flow length (Mb)',
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
      var username = this.getCookie('username');
      var token = this.getCookie('token');
      $.ajax({
        url: 'https://' + location.hostname +':8080/api/ddbb/flows/getIPTrafficData?username='+username+'&token='+token,
        success: function(data) {

          data = data.chartData;

          myChart.data.labels = Object.keys(data);
          myChart.data.datasets[0].data = Object.values(data); 
          
          
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

// Attacks/IP chart
Vue.component('attacks-ip', {
  props: [],
  methods: {
    getCookie: function(c_name){
      var i,x,y,ARRcookies=document.cookie.split(";");
  
      for (i=0;i<ARRcookies.length;i++)
      {
          x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
          y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
          x=x.replace(/^\s+|\s+$/g,"");
          if (x==c_name)
          {
              return unescape(y);
          }
       }
    }
  },
  mounted() {
    var data = {
      labels: [],
      datasets: [{
        label: '% of packets labeled as Attack',
        data: [],
        backgroundColor: 'rgba(144,2,2,0.8)'
      }]
    }

    var ctx = document.getElementById('attacks-ip-chart').getContext('2d');
    var myChartAttack = new Chart(ctx, {
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
      var username = this.getCookie('username');
      var token = this.getCookie('token');
      $.ajax({
        url: 'https://' + location.hostname +':8080/api/ddbb/flows/getAttacksIPData?username='+username+'&token='+token,
        success: function(data) {
          // var oldLabels = myChart.data.labels;
          myChartAttack.data.labels = [];
          myChartAttack.data.datasets[0].data = []
          data = data.chartData;

          myChartAttack.data.labels = Object.keys(data);
          myChartAttack.data.datasets[0].data = Object.values(data);
          
          
          
          // re-render the chart
          myChartAttack.update();
        }
      });
    };
    
    getData();
    
    // get new data every 3 seconds
    setInterval(getData, 15000);
    
    },
    template: `
      <div class="chart-container" width="400px" height="400px"> 
        <canvas id="attacks-ip-chart" width="400px" height="400px"></canvas>
      </div>
    
    `
    })

    // Options dashboard
Vue.component('options', {
  props: ['view'],
  data: function (){
    return {
      targets: [],
      key: 0
    }
  },
  methods: {
    forceRerender: function(){
      this.key += 1;
    },
    getCookie: function(c_name){
      var i,x,y,ARRcookies=document.cookie.split(";");
  
      for (i=0;i<ARRcookies.length;i++)
      {
          x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
          y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
          x=x.replace(/^\s+|\s+$/g,"");
          if (x==c_name)
          {
              return unescape(y);
          }
       }
    },
    remove: async function(ip){

      

      var username = this.getCookie('username');
      var token = this.getCookie('token');

      var result = await axios.post(`https://${location.hostname}:8080/api/ddbb/ips/removeTarget?username=${username}&token=${token}`, {
        ip: ip
      }).catch((error) => {
        alert('Cannot remove. Target is blocked!');
      })

      if(result == null){
        return;
      }

      // Removes element from targets
      this.targets = this.targets.map(x => {
        if(x['ip'] == ip){
          return null
        }
        else {
          return x
        }
      }).filter(x => {
        return x != null
      })
    },
    shuffle: function (array){
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    showPiechart: async function(attacker){
      var username = this.getCookie('username');
      var token = this.getCookie('token');
      var result = await axios.post(`https://${location.hostname}:8080/api/ddbb/ips/getAttacksFromIP`, {
                  ip: attacker,
                  username: username,
                  token: token
                })
      var attacks = result.data.attacks;

      var labels = []
      var d = []
      attacks.map(x => {labels.push(x.ip_dst);d.push(x.attacks)})

      var colors = this.shuffle(["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"])

      var data = {
        labels: labels,
        datasets: [{
          label: `Attacks sent by ${attacker}`,
          data: d,
          backgroundColor: colors
        }]
      }

      var ctx = document.getElementById('piechart_canvas').getContext('2d');
      var myChartAttack = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'right',
            labels: {
              fontColor: 'white',
              fontSize: 15,
            }
            
          }
        }
      })

      myChartAttack.update();

      $("#piechart_overlay").removeClass("hidden");
      $("#piechart_container").removeClass("hidden");
      $("#piechart_overlay").addClass("block");
      $("#piechart_container").addClass("block");
    },
    hidePiechart: function(){
      $("#piechart_overlay").addClass("hidden");
      $("#piechart_container").addClass("hidden");
    },
    block: async function(target){
      var ip = target.ip;
      var username = this.getCookie('username');
      var token = this.getCookie('token');
      var result = await axios.post(`https://${location.hostname}:8080/api/ddbb/ips/block`, {
                    ip: ip,
                    username: username,
                    token: token
                  })

      if(result == null){
        alert('Unknwon server error running block query!');
      }

      
                 
      if(result.data != null){
        var status = result.data.status
        if(status == 0){
          alert('IP ' + ip + ' was successfully blocked!');
          
        }
        else if(status == -1){
          alert('Cannot connect to host SSH server. Please, check credentials!')
        }
        else if(status == -4){
          alert('Target already blocked. Please, reload page.')
        }
        else{
          alert('Unknwon server error running block query!')
        }
      }
    },
    unblock: async function(target){
      var ip = target.ip;
      var username = this.getCookie('username');
      var token = this.getCookie('token');
      var result = await axios.post(`https://${location.hostname}:8080/api/ddbb/ips/unblock`, {
                    ip: ip,
                    username: username,
                    token: token
                  })

      if(result == null){
        alert('Unknwon server error running unblock query!');
      }
                 
      if(result.data != null){
        var status = result.data.status
        if(status == 0){
          alert('IP ' + ip + ' was successfully unblocked!');
        }
        else if(status == -1){
          alert('Cannot connect to host SSH server. Please, check credentials!')
        }
        else if(status == -4){
          alert('Target already blocked. Please, reload page.')
        }
        else{
          alert('Unknwon server error running unblock query!')
        }
      }
    },
  },
  async mounted() {
    var username = this.getCookie('username');
    var token = this.getCookie('token');
    const targets = await axios.get(`https://${location.hostname}:8080/api/ddbb/ips/getTargets?username=${username}&token=${token}`);
    if(targets){
      this.targets = targets.data.targets.map(x => {
        if(x['blocked'] == true){
          x['blocked'] = 'Blocked';
        }
        else {
          x['blocked'] = 'Online'
        }
        return x
      });
    }

    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
    
  },
  updated() {
    feather.replace()
  },
  template: `
      <div class="container">
        <div id="piechart_overlay" class="overlay hidden" @click="hidePiechart();">
          <div id="piechart_container" class="hidden">
            <canvas id="piechart_canvas" width="250px" height="250px"></canvas>
          </div>
        </div>

          <div class="options-ip-container dataTables_scroll">
            <div class="dataTables_scrollHead" style="overflow: hidden; position: relative; border: 0px none; width: 100%;">
              <div class="dataTables_scrollHeadInner" style="box-sizing: content-box; width: 100%; padding-right: 16px;">
                <table class="table dataTable no-footer" role="grid" style="margin-left: 0px;width: 100%">
                  <thead class="thead-dark">
                    <tr role="row">
                      <th scope="col" tabindex="0" rowspan="1" colspan="1" style="width: 25%"> IP source </th>
                      <th scope="col" tabindex="0" rowspan="1" colspan="1" style="width: 25%"> % attacks last hour </th>
                      <th scope="col" tabindex="0" rowspan="1" colspan="1" style="width: 25%"> Status </th>
                      <th scope="col" tabindex="0" rowspan="1" colspan="1" style="width: 25%"> Options </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            <div class="dataTables_scrollBody" style="position: relative; overflow: auto; max-height: 50vh; width: 100%;">
              <table class="table dataTable no-footer" role="grid" style="width: 100%">
                <thead class="thead-dark">
                  <tr role="row" style="height: 0px;"> 
                    <th class="col-width" style="padding: 0"> </th>
                    <th class="col-width" style="padding: 0"> </th>
                    <th class="col-width" style="padding: 0"> </th>
                    <th class="col-width" style="padding: 0"> </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="target in targets" role="row" class="even">
                    <td class="options-element" @click="showPiechart(target.ip);"> {{target.ip}} </td>
                    <td class="options-element" @click="showPiechart(target.ip);">
                      <span class="green" v-if="target.stat_from < 25"> {{target.stat_from}} (src) </span> 
                      <span class="orange" v-if="target.stat_from >= 25 && target.stat_from <= 75"> {{target.stat_from}} (src) </span> 
                      <span class="red" v-if="target.stat_from > 75"> {{target.stat_from}} (src) </span> 
                      /
                      <span class="green" v-if="target.stat_to < 25"> {{target.stat_to}} (dst) </span>
                      <span class="green" v-if="target.stat_to >= 25 && target.stat_to <= 75"> {{target.stat_to}} (dst) </span>
                      <span class="green" v-if="target.stat_to > 75"> {{target.stat_to}} (dst) </span>
                    </td>
                    <td class="options-element green" v-if="target.blocked == 'Online'" @click="showPiechart(target.ip);"><b> {{target.blocked}} </b></td>
                    <td class="options-element red" @click="showPiechart(target.ip);" v-else> <b>{{target.blocked}} </b></td>
                    <td class="options-element options">
                      <div class="options-options-container x">
                        <a class="options-x" data-toggle="tooltip" data-placement="right" title="Remove target" href="#" @click="remove(target.ip);"><i data-feather='x' width='30' height='30' stroke-width='3' class="option-button-x"></i></a>
                      </div>
                      <div class="options-options-container block">
                        <a id="block-icon" class="options-shield" data-toggle="tooltip" data-placement="right" title="Block IP" v-if="target.blocked == 'Online'" href="#" @click="block(target);"><i data-feather='shield' width='30' height='30' stroke-width='3' class="option-button-shield"></i></a>
                        <a id="block-icon" class="options-shield" data-toggle="tooltip" data-placement="right" title="Unblock IP" v-else href="#" @click="unblock(target);"><i data-feather='shield-off' width='30' height='30' stroke-width='3' class="option-button-shieldoff"></i></a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
  `
});


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