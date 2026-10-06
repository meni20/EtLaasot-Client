import type { PushSubscriptionPayload } from "../services/push-notification.service";

export const isPushSupported = () =>
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export const urlBase64ToUint8Array = (base64Value: string) => {
  const padding = "=".repeat((4 - (base64Value.length % 4)) % 4);
  const base64 = (base64Value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from(rawData, (character) => character.charCodeAt(0));
};

export const serializePushSubscription = (
  subscription: PushSubscription,
): PushSubscriptionPayload => {
  const json = subscription.toJSON();
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;

  if (!p256dh || !auth) {
    throw new Error("Push subscription is missing encryption keys");
  }

  return {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: { p256dh, auth },
  };
};
