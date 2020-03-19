Vue.component('dashboard', {
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
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
              <tr>
                <td>192.179.1.1</th>
                <td>192.168.1.10</td>
                <td>80</td>
                <td>01:30:34:10UTC</td>
                <td>Attack</td>
              </tr>
            </tbody>
          </table>
            </div>
        </div class="container">
    `
})

new Vue({
    el: '#dashboard'
})