//init websocket
var ws = new WebSocket("ws://127.0.0.1:5000/");
var list = document.getElementById('messages');

function charcountupdate(str) {
  var lng = str.length;
  document.getElementById("charcount").innerHTML = lng + '/300';
}

ws.onmessage = function(event) {
  console.log(event.data);
  if (event.data.indexOf('server:') !== -1) {
    var entry = document.createElement('li1');
    entry.appendChild(document.createTextNode(event.data));
    document.getElementById("messages").appendChild(entry);

    } else if (event.data.indexOf('#yellow') !== -1) {
    var data = event.data
    var data = data.replace("#yellow", "");
    var entry = document.createElement('li2');
    entry.appendChild(document.createTextNode(data));
    document.getElementById("messages").appendChild(entry);
    } else if (event.data.indexOf('#Admin') !== -1) {
    var data = event.data
    var entry = document.createElement('li3');
    entry.appendChild(document.createTextNode(data));
    document.getElementById("messages").appendChild(entry);
    }else {
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(event.data));
    document.getElementById("messages").appendChild(entry);
  }

}
var x = document.getElementById("input").value;

function send() {
  charcountupdate('')
  var x = document.getElementById("input").value;
  ws.send(x);
  document.getElementById("input").value = "";
}

input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("button").click();
  }
});
