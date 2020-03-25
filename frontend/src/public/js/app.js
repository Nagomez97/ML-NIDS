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