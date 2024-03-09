import { MqttClient } from "mqtt/*";
import { PropsWithChildren, useEffect } from "react";
import mqtt from "mqtt";
import { pushNotifications } from "../../store/reducers/notifications.reducer";
import { useOidcAccessToken, useOidcUser } from "@axa-fr/react-oidc";
import { useAppDispatch } from "../../store/hooks";
import { nanoid } from "nanoid";

export interface LiveNotificationHandlerProps extends PropsWithChildren {}

export function LiveNotificationHandler({
  children,
}: LiveNotificationHandlerProps) {
  const dispatch = useAppDispatch();
  const clientIdPrefix = "andrew-insurer-app";
  const username = "oauth2";
  const topic = `source/frontend/supervisor/notification`;
  const brokerURL = process.env.NEXT_PUBLIC_MQTT_BROKER_ROOT_URL as string;
  const { accessToken } = useOidcAccessToken();
  const { oidcUser } = useOidcUser();

  useEffect(() => {
    let client: MqttClient | null = null;
    function handleMessage(topic: string, message: Buffer) {
      const _message = JSON.parse(message.toString("utf8"));
      console.log(`==>received message`, _message);
      dispatch(pushNotifications([_message]));
    }
    function handleConnect() {
      if (topic && client) {
        console.log(`attempting connection to topic ${topic}`);
        client.subscribe(topic, (err) => {
          if (!err) {
            console.log(`connected to topic ${topic}`);
          }
        });
      }
    }

    function renewClient() {
      client = mqtt.connect(brokerURL, {
        username: username,
        password: accessToken,
        rejectUnauthorized: false,
        clientId: nanoid(),
        protocolVersion: 3,
      });
    }

    if (accessToken && oidcUser && username && clientIdPrefix) {
      client = mqtt.connect(brokerURL, {
        username: username,
        password: accessToken,
        rejectUnauthorized: false,
        clientId: nanoid(),
        protocolVersion: 3,
      });

      client.on("connect", handleConnect);
      client.on("message", handleMessage);
      client.on("error", renewClient);
    }
    return () => {
      if (client) {
        client.off("connect", handleConnect);
        client.off("message", handleMessage);
        client.off("error", renewClient);
        client.end(true);
      }
    };
  }, [accessToken, oidcUser, username, clientIdPrefix]);
  return children;
}
