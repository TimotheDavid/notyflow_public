

function fetchNotification() {


  const payload = {
    title: "Hello",
    body: "Hello, this is a notification",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/512px-LEGO_logo.svg.png",
  };

  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
    icon: payload.image,
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);

  console.log("send");
  
}


setInterval(fetchNotification,  30 * 1000) // 30 seconds

