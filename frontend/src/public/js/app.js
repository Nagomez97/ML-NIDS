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

Vue.component('table-dashboard', {
    props: ['view'],
    data: function (){
      return {
        table: null,
        hour: -1,
        selectedHour: 'Now'
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
        if(vm.hour == -1 || vm.hour == '-1'){
          vm.table.ajax.reload();
        }
      }, 10000 );
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
              </div>
            </div>
        </div>
    `
});

Vue.component('chart-dashboard', {
  props: ['view'],
  mounted () {

      var table = $('#flowTable').DataTable({
        "scrollY": "50vh",
        "scrollCollapse": true,
        ajax: 'http://localhost:8080/api/ddbb/flows/getCurrentHour',
        columns: [
            {"data" : "ip_src"},
            {"data" : "ip_dst"},
            {"data" : "port_dst"},
            {"data" : "timestamp"},
            {"data" : "label"}
        ],
        order: [[4, 'desc']],
        pageLength: 100
    });
    $('.dataTables_length').addClass('bs-select');

    setInterval( function () {
        table.ajax.reload();
    }, 10000 );
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
      </div>
  `
});



new Vue({
    el: '#app',
    data: function () {
      return {
        open_view: 'table-dashboard'
      }
    },
    methods: {
      updateView(newView) {
        this.open_view = newView;
      }
    } 
})