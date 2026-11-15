package dev.pages.wird_azkar.app;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

import java.io.File;

/** Plays the adhan (or the Fajr alarm) in the foreground, even if the app is closed. */
public class AdhanService extends Service {
    static final String ACT_STOP = "dev.pages.wird_azkar.app.STOP";
    static final String ACT_SNOOZE = "dev.pages.wird_azkar.app.SNOOZE";
    private static final int NOTIF_ID = 4242;
    private static final long ALARM_MAX_MS = 5 * 60_000L;

    private MediaPlayer player;
    private PowerManager.WakeLock wake;
    private JSONObject current;
    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override public IBinder onBind(Intent i) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        AdhanStore.ensureChannels(this);
        String action = intent == null ? null : intent.getAction();
        if (ACT_STOP.equals(action)) { stopAll(); return START_NOT_STICKY; }
        if (ACT_SNOOZE.equals(action)) {
            if (current != null) AdhanStore.snooze(this, current, 10);
            stopAll();
            return START_NOT_STICKY;
        }

        String raw = intent == null ? null : intent.getStringExtra("ev");
        try { current = new JSONObject(raw == null ? "{}" : raw); } catch (Exception e) { current = new JSONObject(); }
        boolean isAlarm = "alarm".equals(current.optString("kind"));

        Notification n = buildNotification(isAlarm);
        if (Build.VERSION.SDK_INT >= 29) {
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(NOTIF_ID, n);
        }

        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wake = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "wird:adhan");
        wake.acquire(isAlarm ? ALARM_MAX_MS + 10_000 : 6 * 60_000L);

        play(isAlarm);
        if (isAlarm) {
            vibrate();
            handler.postDelayed(this::stopAll, ALARM_MAX_MS);
        }
        return START_NOT_STICKY;
    }

    private Notification buildNotification(boolean isAlarm) {
        Intent open = new Intent(this, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        String url = current.optString("url", "/");
        open.setData(Uri.parse(AdhanStore.absolute(url)));
        open.putExtra("wird_alarm", isAlarm);
        PendingIntent openPi = PendingIntent.getActivity(this, isAlarm ? 14 : 11, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent stop = new Intent(this, AdhanService.class).setAction(ACT_STOP);
        PendingIntent stopPi = PendingIntent.getService(this, 12, stop, PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder b = new NotificationCompat.Builder(this, isAlarm ? AdhanStore.CH_ALARM : AdhanStore.CH_ADHAN)
                .setSmallIcon(R.drawable.ic_stat_wird)
                .setColor(0xFFC49A4B)
                .setLargeIcon(WNotify.largeIcon(this, current))
                .setContentTitle(current.optString("title", "حان وقت الصلاة"))
                .setContentText(current.optString("body", ""))
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(isAlarm ? NotificationCompat.CATEGORY_ALARM : NotificationCompat.CATEGORY_REMINDER)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setContentIntent(openPi)
                .setDeleteIntent(stopPi)
                .addAction(0, isAlarm ? "استيقظت" : "إيقاف الأذان", stopPi);

        if (isAlarm) {
            Intent snooze = new Intent(this, AdhanService.class).setAction(ACT_SNOOZE);
            PendingIntent snoozePi = PendingIntent.getService(this, 13, snooze, PendingIntent.FLAG_IMMUTABLE);
            b.addAction(0, "غفوة ١٠ دقائق", snoozePi);
            b.setFullScreenIntent(openPi, true);
        }
        return b.build();
    }

    private void play(boolean isAlarm) {
        try {
            player = new MediaPlayer();
            player.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(isAlarm ? AudioAttributes.CONTENT_TYPE_SONIFICATION : AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build());

            File f = AdhanStore.soundFile(this, AdhanStore.absolute(current.optString("sound", "")));
            if (f != null && f.exists() && f.length() > 10_000) {
                player.setDataSource(f.getAbsolutePath());
            } else {
                String s = current.optString("sound", "");
                if (!s.isEmpty()) {
                    player.setDataSource(this, Uri.parse(AdhanStore.absolute(s))); // stream if not cached yet
                } else {
                    Uri def = RingtoneManager.getDefaultUri(isAlarm ? RingtoneManager.TYPE_ALARM : RingtoneManager.TYPE_NOTIFICATION);
                    player.setDataSource(this, def);
                }
            }
            player.setLooping(isAlarm);
            player.setOnCompletionListener(mp -> { if (!isAlarm) stopAll(); });
            player.setOnErrorListener((mp, w, e) -> { fallback(isAlarm); return true; });
            final int stopMs = parseEndMs(current.optString("sound", ""));
            player.setOnPreparedListener(mp -> { mp.start(); if (stopMs > 0 && !isAlarm) handler.postDelayed(this::stopAll, stopMs); });
            player.prepareAsync();
        } catch (Exception e) {
            fallback(isAlarm);
        }
    }

    private void fallback(boolean isAlarm) {
        try {
            if (player != null) player.release();
            player = new MediaPlayer();
            player.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).build());
            player.setDataSource(this, RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM));
            player.setLooping(isAlarm);
            player.setOnCompletionListener(mp -> { if (!isAlarm) stopAll(); });
            player.prepare();
            player.start();
            if (!isAlarm) handler.postDelayed(this::stopAll, 30_000);
        } catch (Exception ignored) {
            stopAll();
        }
    }

    /** الهزّاز: من VibratorManager على أندرويد ١٢ وأحدث، ومن الخدمة القديمة على الأقدم. */
    @SuppressWarnings("deprecation")
    private Vibrator vibrator() {
        if (Build.VERSION.SDK_INT >= 31) {
            android.os.VibratorManager m = (android.os.VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            return m != null ? m.getDefaultVibrator() : null;
        }
        return (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
    }

    @SuppressWarnings("deprecation") // vibrate(long[],int) للأجهزة قبل أندرويد ٨ بس
    private void vibrate() {
        try {
            Vibrator v = vibrator(); if (v == null) return;
            long[] pat = {0, 800, 400, 800, 400, 1200, 1500};
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(pat, 0)); else v.vibrate(pat, 0);
        } catch (Exception ignored) {}
    }

    private void stopAll() {
        handler.removeCallbacksAndMessages(null);
        try { if (player != null) { player.stop(); player.release(); } } catch (Exception ignored) {}
        player = null;
        try { Vibrator v = vibrator(); if (v != null) v.cancel(); } catch (Exception ignored) {}
        try { if (wake != null && wake.isHeld()) wake.release(); } catch (Exception ignored) {}
        stopFg();
        stopSelf();
    }

    @SuppressWarnings("deprecation") // stopForeground(boolean) للأجهزة قبل أندرويد ٧ بس
    private void stopFg() {
        if (Build.VERSION.SDK_INT >= 24) stopForeground(STOP_FOREGROUND_REMOVE); else stopForeground(true);
    }

    @Override public void onDestroy() {
        try { if (player != null) player.release(); } catch (Exception ignored) {}
        super.onDestroy();
    }

    static int parseEndMs(String s) {
        try {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("#t=[\\d.]*,([\\d.]+)").matcher(s == null ? "" : s);
            if (m.find()) return (int) (Double.parseDouble(m.group(1)) * 1000);
        } catch (Exception ignored) {}
        return 0;
    }

    static boolean isMuted(Context c) {
        AudioManager am = (AudioManager) c.getSystemService(Context.AUDIO_SERVICE);
        return am.getStreamVolume(AudioManager.STREAM_ALARM) == 0;
    }
}
