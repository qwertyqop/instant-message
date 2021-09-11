/** © 2021 Owen Seely <Owen.Seely@protonmail.com> **/

const wss = new(require('ws')).Server({
  port: (process.env.PORT || 5000),
  clientTracking: true,
});
const {createNodeRedisClient} = require('handy-redis');
const client = createNodeRedisClient();

let messages = 0;
let connectedclients = 0;
const redis = require('redis');
const rclient = redis.createClient();
// var client = redis.createClient(6420, 127.0.0.1);
const webSockets = {}; // userID: webSocket
// wscat -c ws://localhost:5000
let id = 1000;
const lookup = {};
let str;
a = 0;
let usednames = 0;
let exit = 0;
rclient.on('error', (err) => { // on redis error
  console.log('redis error' + err);
});

/**
 * Add two numbers.
 * @param {number} id the id of the user that sent the message
 * @param {string} data the message that the user {id} sent
 * @param {number} maxid the highest id that the system has issued
 */
async function name(id, data, maxid) {
  return new Promise((resolve, reject) => {
    rclient.get(id, async function(err, reply) {
      if (err) {
        return reject(err);
      }
      resolve(reply);
      if (data.indexOf('#reguser') !== -1) {
        lookup[id].send('server: regestering username...');
        if (data.length > 30) {
          lookup[id].send('server: message too long');
          exit = 1;
        } else {
          i = 1000;
          reguser(i);
        }
        /**
        * Add two numbers.
        * @param {number} i the minimum id that the system supplys, 1000
        */
        async function reguser(i) {
          var uname = data.replace('#reguser ', '');
          var uname = data.replace('#reguser', '');
          await rclient.get(i, async function(err, reply) {
            usednames = reply;
            if (uname == usednames) {
              lookup[id].send('"' + uname + '" already in use');
              rclient.set(id, 'null', function(err, reply) {});
              exit = 1;
            } else {
              if (exit == 1) {
                exit = 0;
                return;
              }
              rclient.set(id, uname, function(err, reply) {});
            }
          });
          if (i != maxid) {
            i += 1;
            reguser(i);
          }
        }
      } else if (data.indexOf('#help') !== -1) {
        lookup[id].send('server: #help shows this menu');
        lookup[id].send('server: #reguser regester a username.');
        lookup[id].send('server: #yellow to make text yellow');
        lookup[id].send('server: [1000, "private message"] layout for private messages');
        lookup[id].send('server: all commands are case sencitive');
      } else if (data.indexOf('#passkey') !== -1) {
          for (i = 0; i < a; i++) {
            rclient.get('msg' + a, function(err, reply) {
            lookup[id].send('server:' + reply);
           });
         }
        
      }

      const data4 = data.replace('id#', 'id #'); // Filter certain commands or words.
      // const data2 = data.replace('id#', 'id #');
      const data3 = data4.replace('server:', 'server');
      const data2 = data3.replace('#Admin', 'Admin');
      const data1 = data2.replace('yBbtOx6El6oK', '#Admin');

      // var data2 = data.replace(ws.id, name(ws.id));
      if (data.indexOf('#passkey') !== true) {
      if (reply != null) {
        const reply1 = reply.replace('yBbtOx6El6oK', '#Admin');
        lookup[id].send(reply1 + '> ' + data1)
        rclient.set('msg' + a, reply1 + '> ' + data1, function(err, reply) { // store in redis server
        a += 1;
        });
      } else {
        lookup[id].send('server: Please regester a username with #reguser')
        //rclient.set('msg' + a, reply + '> ' + data1, function(err, reply) { // store in redis server
        //a += 1;
        //});
      }
      }
    });
  });
}


wss.on('connection', function(ws) { // On Connection
  wss.clients.forEach((client) => {
    connectedclients += 1;
  });
  console.log(connectedclients + ' users online');
  connectedclients = 0;

  ws.id = id++;
  lookup[ws.id] = ws;


  // console.log('id# ' + ws.id + ' connected');
  wss.clients.forEach((client) => {
    client.send('server: id# ' + ws.id + ' connected to the server');
  });
  lookup[ws.id].send('server: welcome!'); // MOTD

  for (i = 0; i < a; i++) {
    rclient.get('msg' + i, function(err, reply) {
      lookup[ws.id].send(JSON.parse('"' + reply + '"'));
    });
  }


  ws.on('message', (data) => { // On Message
    messages += 1;
    if (data) {
      try {
        messageArray = JSON.parse(json);
        if (messageArray[0] != null && messageArray[1] != null) {
          console.log('trying to send a private message');
          // [1000, "private message"]
          lookup[ws.id].send('server: private message sent!');
          lookup[messageArray[0]].send(messageArray[1]);
        }
      } catch (e) {
        if (data.length > 300) {
          lookup[ws.id].send('server: message too long');
        } else {
          name(ws.id, data, id).catch((err) => console.log(err));
        }
      }
    }
  });


  ws.on('close', function() { // On Close
    wss.clients.forEach((client) => {
      client.send('server: id#' + ws.id + ' left');
      rclient.del(ws.id, function(err, reply) {
      });
    });
  });
});

process.on('SIGINT', function() {
  console.log('\n\n\nCaught interrupt signal');
  console.log('cleaning up...');
  console.log('users...');
  for (i = 1000; i < id; i++) {
    console.log(i);
    rclient.del(i, function(err, reply) {
    });
  }
  console.log('messages...');
  for (i = 0; i < messages; i++) {
    console.log(i);
    rclient.del('msg' + messages, function(err, reply) {
    });
  }
  process.exit();
});
