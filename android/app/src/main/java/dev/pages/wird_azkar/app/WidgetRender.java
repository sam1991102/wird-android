package dev.pages.wird_azkar.app;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.os.Build;
import android.os.SystemClock;
import android.util.TypedValue;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

/** يرسم الويدجتات الخمس حسب إعدادات كل واحدة. */
final class WidgetRender {
    static final int NEXT = 0, TIMES = 1, FULL = 2, DHIKR = 3, MUSHAF = 4;

    static final String[] DHIKR_LIST = {
        "سبحان الله وبحمده، سبحان الله العظيم",
        "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
        "اللهم صلِّ وسلِّم على نبينا محمد",
        "أستغفر الله العظيم وأتوب إليه",
        "لا حول ولا قوة إلا بالله",
        "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
        "رضيت بالله ربًّا، وبالإسلام دينًا، وبمحمد ﷺ نبيًّا",
        "سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر",
        "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين",
        "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
        "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
        "لا إله إلا أنت سبحانك إني كنت من الظالمين",
        "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
        "يا مقلب القلوب ثبت قلبي على دينك",
        "اللهم إني أسألك علمًا نافعًا، ورزقًا طيبًا، وعملًا متقبلًا",
        "سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته",
        "اللهم إنك عفو تحب العفو فاعفُ عني",
        "رب اغفر لي وتب عليّ إنك أنت التواب الرحيم",
        "الحمد لله الذي بنعمته تتم الصالحات",
        "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل"
    };

    static RemoteViews build(Context c, int id, int type) {
        return render(c, WidgetData.cfg(c, id), type, id);
    }

    static int layout(int type) {
        switch (type) {
            case TIMES: return R.layout.w_times;
            case FULL: return R.layout.w_full;
            case DHIKR: return R.layout.w_dhikr;
            case MUSHAF: return R.layout.w_mushaf;
            default: return R.layout.widget_wird;
        }
    }

    static RemoteViews render(Context c, WidgetData.Cfg g, int type, int id) {
        RemoteViews v = new RemoteViews(c.getPackageName(), layout(type));
        v.setInt(R.id.w_bg, "setColorFilter", g.bgColor(c));
        v.setInt(R.id.w_bg, "setImageAlpha", Math.round(g.alpha * 2.55f));
        switch (type) {
            case TIMES: times(c, v, g); break;
            case FULL: full(c, v, g); break;
            case DHIKR: dhikr(c, v, g, id); break;
            case MUSHAF: mushaf(c, v, g); break;
            default: next(c, v, g);
        }
        String path = type == DHIKR ? "/#library" : type == MUSHAF ? "/#mushaf" : "/#prayer";
        v.setOnClickPendingIntent(R.id.w_root, open(c, path, 3100 + id * 8 + type));
        return v;
    }

    /* ---------- الأنواع ---------- */

    private static void next(Context c, RemoteViews v, WidgetData.Cfg g) {
        JSONObject P = WidgetData.prayer(c);
        Nx n = nextOf(P);
        float s = g.scale();
        tx(v, R.id.w_lbl, "الصلاة القادمة", g.muted(c), 12 * s);
        tx(v, R.id.w_name, name(n.k, n.fri), g.accent(c), 26 * s);
        timer(v, g, c, n.t, 18 * s);
        tx(v, R.id.w_time, "الأذان " + fmt(n.t, P, g), g.muted(c), 13 * s);
        show(v, R.id.w_hijri, g.hijri);
        if (g.hijri) tx(v, R.id.w_hijri, hijri(P, g), g.muted(c), 11 * s);
    }

    private static void times(Context c, RemoteViews v, WidgetData.Cfg g) {
        JSONObject P = WidgetData.prayer(c);
        PrayerCalc.Day D = PrayerCalc.day(P, 0);
        Nx n = nextOf(P);
        float s = g.scale();
        tx(v, R.id.w_city, P.optString("name", ""), g.accent(c), 13 * s);
        tx(v, R.id.w_date, (g.hijri ? hijri(P, g) + "  ·  " : "") + dayName(P, g), g.muted(c), 12 * s);
        rows(c, v, g, P, D, n, 12 * s, 15 * s);
        show(v, R.id.c1, g.sunrise);
    }

    private static void full(Context c, RemoteViews v, WidgetData.Cfg g) {
        JSONObject P = WidgetData.prayer(c);
        PrayerCalc.Day D = PrayerCalc.day(P, 0), T = PrayerCalc.day(P, 1);
        Nx n = nextOf(P);
        float s = g.scale();
        tx(v, R.id.w_day, dayName(P, g), g.accent(c), 15 * s);
        tx(v, R.id.w_city, P.optString("name", ""), g.fg(c), 15 * s);
        show(v, R.id.w_hijri, g.hijri);
        if (g.hijri) tx(v, R.id.w_hijri, hijri(P, g), g.fg(c), 13 * s);
        tx(v, R.id.w_greg, greg(P, g), g.muted(c), 12 * s);
        tx(v, R.id.w_nlbl, "القادمة: " + name(n.k, n.fri), g.accent(c), 14 * s);
        timer(v, g, c, n.t, 20 * s);
        rows(c, v, g, P, D, n, 13 * s, 14 * s);
        show(v, R.id.r1, g.sunrise);
        show(v, R.id.w_extra, g.extra);
        if (g.extra) {
            long night = T.t[0] - D.t[4];
            tx(v, R.id.w_ml, "منتصف الليل", g.muted(c), 12 * s);
            tx(v, R.id.w_mt, fmt(D.t[4] + night / 2, P, g), g.fg(c), 13 * s);
            tx(v, R.id.w_ll, "الثلث الأخير", g.muted(c), 12 * s);
            tx(v, R.id.w_lt, fmt(D.t[4] + night * 2 / 3, P, g), g.fg(c), 13 * s);
        }
        show(v, R.id.w_dhikr, g.dhikr);
        if (g.dhikr) tx(v, R.id.w_dhikr, DHIKR_LIST[dayIndex() % DHIKR_LIST.length], g.muted(c), 13 * s);
    }

    private static void dhikr(Context c, RemoteViews v, WidgetData.Cfg g, int id) {
        float s = g.scale();
        int i = WidgetData.dhikrIdx(c, id);
        if (i < 0) i = dayIndex();
        tx(v, R.id.w_lbl, "ذكر", g.accent(c), 12 * s);
        tx(v, R.id.w_next, "التالي ‹", g.accent(c), 12 * s);
        tx(v, R.id.w_dhikr, DHIKR_LIST[i % DHIKR_LIST.length], g.fg(c), 17 * s);
        Intent nx = new Intent(c, WidgetTick.class).setAction(WidgetTick.ACT_NEXT).putExtra("id", id);
        if (id > 0) v.setOnClickPendingIntent(R.id.w_next, PendingIntent.getBroadcast(c, 5100 + id, nx, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT));
    }

    private static void mushaf(Context c, RemoteViews v, WidgetData.Cfg g) {
        float s = g.scale();
        int page = 1;
        try { page = Integer.parseInt(String.valueOf(WidgetData.get(c, "wird-mushaf-page")).replaceAll("\\D", "")); } catch (Exception ignored) {}
        page = Math.max(1, Math.min(604, page));
        String sura = WidgetData.get(c, "wird-mushaf-sura");
        tx(v, R.id.w_lbl, "المصحف", g.accent(c), 15 * s);
        tx(v, R.id.w_k, "آخر صفحة", g.muted(c), 12 * s);
        tx(v, R.id.w_sura, sura == null || sura.isEmpty() ? "ابدأ القراءة" : sura, g.fg(c), 18 * s);
        tx(v, R.id.w_page, "صفحة " + dg(String.valueOf(page), g.arDigits), g.muted(c), 13 * s);
        int pct; String label;
        try {
            JSONObject k = new JSONObject(WidgetData.get(c, "wird-khatma"));
            int sp = k.optInt("sp", 1), pos = k.optInt("pos", sp - 1);
            pct = Math.max(0, Math.min(100, Math.round((pos - sp + 1) * 100f / Math.max(1, 604 - sp + 1))));
            label = "الختمة";
        } catch (Exception e) {
            pct = Math.round(page * 100f / 604);
            label = "من المصحف";
        }
        tx(v, R.id.w_kh, label, g.fg(c), 13 * s);
        tx(v, R.id.w_khp, dg(pct + "٪", g.arDigits), g.accent(c), 13 * s);
        v.setProgressBar(R.id.w_pb, 100, pct, false);
        if (Build.VERSION.SDK_INT >= 31) v.setColorStateList(R.id.w_pb, "setProgressTintList", ColorStateList.valueOf(g.accent(c)));
    }

    /* ---------- مساعدات ---------- */

    static final class Nx { int k; long t; boolean fri; }

    static Nx nextOf(JSONObject P) {
        long now = System.currentTimeMillis();
        for (int d = 0; d < 2; d++) {
            PrayerCalc.Day D = PrayerCalc.day(P, d);
            for (int k : new int[]{0, 2, 3, 4, 5}) {
                if (D.t[k] > now) { Nx n = new Nx(); n.k = k; n.t = D.t[k]; n.fri = D.fri; return n; }
            }
        }
        Nx n = new Nx(); n.k = 0; n.t = now + 3600e3 > 0 ? now + 3600_000L : now; return n;
    }

    private static final int[] N_IDS = {R.id.n0, R.id.n1, R.id.n2, R.id.n3, R.id.n4, R.id.n5};
    private static final int[] T_IDS = {R.id.t0, R.id.t1, R.id.t2, R.id.t3, R.id.t4, R.id.t5};

    private static void rows(Context c, RemoteViews v, WidgetData.Cfg g, JSONObject P, PrayerCalc.Day D, Nx n, float ns, float ts) {
        boolean nextToday = n.t == D.t[n.k];
        for (int k = 0; k < 6; k++) {
            boolean hi = nextToday && k == n.k;
            int col = hi ? g.accent(c) : g.fg(c);
            tx(v, N_IDS[k], name(k, D.fri), hi ? col : g.muted(c), ns);
            tx(v, T_IDS[k], fmt(D.t[k], P, g), col, ts);
        }
    }

    private static void timer(RemoteViews v, WidgetData.Cfg g, Context c, long at, float sp) {
        show(v, R.id.w_timer, g.timer);
        if (!g.timer) return;
        v.setChronometer(R.id.w_timer, SystemClock.elapsedRealtime() + (at - System.currentTimeMillis()), null, true);
        if (Build.VERSION.SDK_INT >= 24) v.setChronometerCountDown(R.id.w_timer, true);
        v.setTextColor(R.id.w_timer, g.fg(c));
        v.setTextViewTextSize(R.id.w_timer, TypedValue.COMPLEX_UNIT_SP, sp);
    }

    private static void tx(RemoteViews v, int id, String s, int color, float sp) {
        v.setTextViewText(id, s);
        v.setTextColor(id, color);
        v.setTextViewTextSize(id, TypedValue.COMPLEX_UNIT_SP, sp);
    }

    private static void show(RemoteViews v, int id, boolean on) { v.setViewVisibility(id, on ? View.VISIBLE : View.GONE); }

    static String name(int k, boolean fri) { return k == 2 && fri ? "الجمعة" : PrayerCalc.NAMES[k]; }

    static String fmt(long t, JSONObject P, WidgetData.Cfg g) {
        Calendar c = Calendar.getInstance(TimeZone.getTimeZone(P.optString("tz", "Asia/Riyadh")));
        c.setTimeInMillis(t + 30_000); // تقريب لأقرب دقيقة
        int h = c.get(Calendar.HOUR_OF_DAY), m = c.get(Calendar.MINUTE);
        String ap = h < 12 ? " ص" : " م";
        if (g.h12) { h = h % 12; if (h == 0) h = 12; }
        String s = h + ":" + (m < 10 ? "0" : "") + m + (g.h12 && g.ampm ? ap : "");
        return dg(s, g.arDigits);
    }

    static String dg(String s, boolean ar) {
        StringBuilder b = new StringBuilder();
        for (char ch : s.toCharArray()) {
            if (ar && ch >= '0' && ch <= '9') b.append((char) ('٠' + (ch - '0')));
            else if (!ar && ch >= '٠' && ch <= '٩') b.append((char) ('0' + (ch - '٠')));
            else b.append(ch);
        }
        return b.toString();
    }

    static String hijri(JSONObject P, WidgetData.Cfg g) {
        if (Build.VERSION.SDK_INT < 24) return "";
        try {
            android.icu.util.ULocale L = new android.icu.util.ULocale("ar@calendar=islamic-umalqura");
            android.icu.text.SimpleDateFormat f = new android.icu.text.SimpleDateFormat("d MMMM y", L);
            f.setTimeZone(android.icu.util.TimeZone.getTimeZone(P.optString("tz", "Asia/Riyadh")));
            return dg(f.format(new java.util.Date()) + " هـ", g.arDigits);
        } catch (Exception e) { return ""; }
    }

    static String greg(JSONObject P, WidgetData.Cfg g) {
        java.text.SimpleDateFormat f = new java.text.SimpleDateFormat("d MMMM y", new Locale("ar"));
        f.setTimeZone(TimeZone.getTimeZone(P.optString("tz", "Asia/Riyadh")));
        return dg(f.format(new java.util.Date()), g.arDigits);
    }

    static String dayName(JSONObject P, WidgetData.Cfg g) {
        java.text.SimpleDateFormat f = new java.text.SimpleDateFormat("EEEE", new Locale("ar"));
        f.setTimeZone(TimeZone.getTimeZone(P.optString("tz", "Asia/Riyadh")));
        return f.format(new java.util.Date());
    }

    static int dayIndex() { return Calendar.getInstance().get(Calendar.DAY_OF_YEAR); }

    static PendingIntent open(Context c, String path, int req) {
        Intent i = new Intent(c, MainActivity.class).putExtra("wird_path", path)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(c, req, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }
}
