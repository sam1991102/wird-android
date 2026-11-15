package dev.pages.wird_azkar.app;

import android.content.ComponentName;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.media3.common.MediaItem;
import androidx.media3.common.MediaMetadata;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.session.MediaController;
import androidx.media3.session.SessionToken;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.ArrayList;
import java.util.List;

/**
 * JS API (window.Capacitor.Plugins.WirdMedia):
 *   play({src,title,artist,owner}) / resume() / pause() / stop() / seek({t}) / state()
 *   event "media": {type: playing|pause|waiting|ended|error, owner}
 */
@CapacitorPlugin(name = "WirdMedia")
public class WirdMediaPlugin extends Plugin {
    private final Handler main = new Handler(Looper.getMainLooper());
    private ListenableFuture<MediaController> future;
    private MediaController ctl;
    private final List<Runnable> pending = new ArrayList<>();
    private String owner = "";
    private boolean lastPlaying = false;

    private void with(Runnable r) {
        main.post(() -> {
            if (ctl != null) { r.run(); return; }
            pending.add(r);
            if (future != null) return;
            SessionToken tok = new SessionToken(getContext(), new ComponentName(getContext(), MediaService.class));
            future = new MediaController.Builder(getContext(), tok).buildAsync();
            future.addListener(() -> {
                try {
                    ctl = future.get();
                    ctl.addListener(listener);
                    for (Runnable p : pending) p.run();
                    pending.clear();
                } catch (Exception e) {
                    future = null;
                    pending.clear();
                    android.util.Log.e("WirdMedia", "controller connect failed", e);
                    emit("error", "connect: " + e.getMessage());
                }
            }, ContextCompat.getMainExecutor(getContext()));
        });
    }

    private void emit(String type) { emit(type, null); }

    private void emit(String type, String msg) {
        JSObject o = new JSObject();
        o.put("type", type);
        if (msg != null) o.put("msg", msg);
        o.put("owner", owner);
        notifyListeners("media", o);
    }

    private final Player.Listener listener = new Player.Listener() {
        @Override
        public void onIsPlayingChanged(boolean playing) {
            if (playing) { lastPlaying = true; emit("playing"); return; }
            lastPlaying = false;
            if (ctl != null && !ctl.getPlayWhenReady()) emit("pause");
        }

        @Override
        public void onPlaybackStateChanged(int state) {
            if (state == Player.STATE_BUFFERING && lastPlaying) emit("waiting");
            if (state == Player.STATE_ENDED) emit("ended");
        }

        @Override
        public void onPlayerError(@NonNull PlaybackException error) {
            android.util.Log.e("WirdMedia", "player error", error);
            emit("error", error.getErrorCodeName() + ": " + error.getMessage());
        }
    };

    @PluginMethod
    public void play(PluginCall call) {
        String src = call.getString("src");
        if (src == null || src.isEmpty()) { call.reject("no src"); return; }
        String title = call.getString("title", "وِرد");
        String artist = call.getString("artist", "");
        String who = call.getString("owner", "");
        with(() -> {
            if (!owner.isEmpty() && !owner.equals(who)) emit("pause");
            owner = who;
            MediaItem item = new MediaItem.Builder()
                    .setUri(Uri.parse(src))
                    .setMediaMetadata(new MediaMetadata.Builder()
                            .setTitle(title).setArtist(artist).setDisplayTitle(title).build())
                    .build();
            ctl.setMediaItem(item);
            ctl.prepare();
            ctl.play();
            call.resolve();
        });
    }

    @PluginMethod
    public void resume(PluginCall call) {
        with(() -> {
            if (ctl.getPlaybackState() == Player.STATE_IDLE) ctl.prepare();
            if (ctl.getPlaybackState() == Player.STATE_ENDED) ctl.seekTo(0);
            ctl.play();
            call.resolve();
        });
    }

    @PluginMethod
    public void pause(PluginCall call) {
        with(() -> { ctl.pause(); call.resolve(); });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        with(() -> { ctl.stop(); ctl.clearMediaItems(); call.resolve(); });
    }

    @PluginMethod
    public void seek(PluginCall call) {
        double t = call.getDouble("t", 0.0);
        with(() -> { ctl.seekTo((long) (t * 1000)); call.resolve(); });
    }

    @PluginMethod
    public void state(PluginCall call) {
        with(() -> {
            JSObject r = new JSObject();
            r.put("t", ctl.getCurrentPosition() / 1000.0);
            long d = ctl.getDuration();
            r.put("d", d > 0 ? d / 1000.0 : 0);
            r.put("playing", ctl.isPlaying());
            r.put("owner", owner);
            call.resolve(r);
        });
    }

    @Override
    protected void handleOnDestroy() {
        main.post(() -> {
            if (ctl != null) { ctl.removeListener(listener); ctl.release(); ctl = null; }
            else if (future != null) MediaController.releaseFuture(future);
            future = null;
        });
    }
}
