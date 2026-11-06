package dev.pages.wird_azkar.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/** Home-screen widget: next prayer + live countdown + dhikr of the day. */
public class WirdWidget extends AppWidgetProvider {
    private static final String[] DHIKR = {
        "سبحان الله وبحمده، سبحان الله العظيم",
        "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
        "اللهم صلِّ وسلِّم على نبينا محمد",
        "أستغفر الله العظيم وأتوب إليه",
        "لا حول ولا قوة إلا بالله",
        "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
        "رضيت بالله ربًّا، وبالإسلام دينًا، وبمحمد ﷺ نبيًّا",
        "سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر",
        "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله",
        "اللهم إني أسألك العفو والعافية في الدنيا والآخرة"
    };

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        for (int id : ids) m.updateAppWidget(id, build(c));
    }

    static void refreshAll(Context c) {
        try {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            int[] ids = m.getAppWidgetIds(new ComponentName(c, WirdWidget.class));
            if (ids.length == 0) return;
            RemoteViews v = build(c);
            for (int id : ids) m.updateAppWidget(id, v);
        } catch (Exception ignored) {}
    }

    private static RemoteViews build(Context c) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_wird);
        JSONObject next = null;
        long now = System.currentTimeMillis();
        JSONArray ev = AdhanStore.load(c);
        for (int k = 0; k < ev.length(); k++) {
            JSONObject e = ev.optJSONObject(k);
            if (e == null) continue;
            String kind = e.optString("kind");
            String title = e.optString("title", "");
            boolean isAdhan = kind.equals("adhan") || title.startsWith("حان الآن وقت صلاة");
            if (!isAdhan || e.optLong("t") <= now) continue;
            if (next == null || e.optLong("t") < next.optLong("t")) next = e;
        }
        if (next != null) {
            String t = next.optString("title", "").replace("حان الآن وقت صلاة ", "");
            v.setTextViewText(R.id.w_name, t);
            long at = next.optLong("t");
            v.setChronometer(R.id.w_timer, SystemClock.elapsedRealtime() + (at - now), null, true);
            v.setTextViewText(R.id.w_time, "الأذان " + toAr(new SimpleDateFormat("h:mm a", new Locale("ar")).format(new Date(at))));
        } else {
            v.setTextViewText(R.id.w_name, "افتح وِرد");
            v.setTextViewText(R.id.w_time, "لتحديث المواقيت");
        }
        int day = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        v.setTextViewText(R.id.w_dhikr, DHIKR[day % DHIKR.length]);
        Intent open = new Intent(c, MainActivity.class);
        v.setOnClickPendingIntent(R.id.w_root, PendingIntent.getActivity(c, 31, open, PendingIntent.FLAG_IMMUTABLE));
        return v;
    }

    private static String toAr(String s) {
        StringBuilder b = new StringBuilder();
        for (char ch : s.toCharArray()) b.append(ch >= '0' && ch <= '9' ? (char) ('٠' + (ch - '0')) : ch);
        return b.toString();
    }
}
