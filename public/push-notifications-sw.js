const DEFAULT_NOTIFICATION_URL = "/home";

const getSafeNotificationUrl = (value) => {
  try {
    const url = new URL(value || DEFAULT_NOTIFICATION_URL, self.location.origin);
    return url.origin === self.location.origin
      ? url.href
      : new URL(DEFAULT_NOTIFICATION_URL, self.location.origin).href;
  } catch {
    return new URL(DEFAULT_NOTIFICATION_URL, self.location.origin).href;
  }
};

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() };
  }

  const title = payload.title || "עת לעשות";
  const options = {
    body: payload.body || "יש עדכון חדש במערכת",
    icon: "/pwa-192x192.png",
    badge: "/pwa-64x64.png",
    tag: payload.tag || "etlaasot-notification",
    data: { url: getSafeNotificationUrl(payload.url) },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = getSafeNotificationUrl(event.notification.data?.url);

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (windowClients) => {
        const currentClient = windowClients.find(
          (client) => new URL(client.url).origin === self.location.origin,
        );

        if (currentClient) {
          if ("navigate" in currentClient) {
            await currentClient.navigate(targetUrl);
          }
          return currentClient.focus();
        }

        return self.clients.openWindow(targetUrl);
      }),
  );
});
