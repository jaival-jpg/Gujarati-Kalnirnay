import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DAILY_PANCHANG_ID = "daily-panchang-morning";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") return true;
    const result = await Notifications.requestPermissionsAsync();
    return result.status === "granted";
  } catch {
    return false;
  }
}

export async function scheduleDailyPanchang(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_PANCHANG_ID).catch(
      () => undefined,
    );
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_PANCHANG_ID,
      content: {
        title: "આજનું પંચાંગ",
        body: "આજનો તિથિ, નક્ષત્ર અને શુભ ચોઘડિયા તપાસો.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 7,
        minute: 0,
        repeats: true,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // best effort
  }
}
