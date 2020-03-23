Vue.component('dashboard', {
    props: ['flows'],
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
        </div class="container">
    `
})

new Vue({
    el: '#dashboard',
    data: function () {
      return {
        flows: null
      }
    },
    methods: {
    },
    mounted: function() {
    },
})