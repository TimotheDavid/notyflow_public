
async function fetchImage(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.url;
}

async function handleRequest(event) {

  const payload = event.data.json();

  console.log(payload);
  const {icon , image } = payload;
  const iconURL = await fetchImage(icon);
  const imageURL = await fetchImage(image);

  console.log("Icon", image);

    await self.registration.showNotification(payload.title, {
      message: payload.body,
      icon: iconURL,
      image: imageURL,
      actions: payload.actions,
      data: payload.data
    });
}

async function open_app(event) {
  const url = event.notification.payload.url;
  const client = await self.clients.openWindow(url);
  client.focus();
}


function fetchCurrentPayload(id, payload) {
  return payload.find((item) => item.action === id);
}

// send the analytics to the backend 
async function sendAnalytics( action,data,  userId, info) {

  const content = {
    action: action,
    data,
    userId: userId,
    notification: info.id
  }

  const response = await fetch(info.api +info.analytics, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });

  const response_content = await response.json();

  console.log(response_content);
}

async function open_url(url) {
  await self.clients.openWindow(url);
}


async function  send_text(info, userId, event) {

  if(!event.hasOwnProperty('reply')) return;
  console.log(event.reply);
  
}



async function actionClick(event) {
  // get the current action 
  // destructure => [action]-[id]
  // send to the event handler the action and the id

  const payload = event.notification.data;
  const current = event.action;
  const userId = payload.info.user;

  
  // we test if the current action have an iphen 
  if(!/-/.test(current)) return;

  // destructuring
  const [action, id] = current.split('-');

  const data = payload.payload.find((item) => item.action === id);

  await sendAnalytics(current, data, userId, payload.info);

  switch(action) {
    case 'url':
      await open_url(data.url);
      break;
    case 'text':
      await send_text(payload.info, userId, event);
      break;
    }
}

// Handle background messages
self.addEventListener("push", function (event) {
  event.waitUntil(handleRequest(event));
});

self.addEventListener('notificationclick', (event) => {
  if(!event.action){
    // Was a normal notification click
    console.log('Notification Click.');
    return;
  }

  event.waitUntil(actionClick(event));



})
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  // Add your click handling logic here
  const clickedNotification = event.notification;
  // You can add custom click handling here
});

self.addEventListener("pushsubscriptionchange", function (event) {
  // Handle subscription change
  console.log("Subscription changed", event);
});

// Install event
self.addEventListener("install", (event) => {
    self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

