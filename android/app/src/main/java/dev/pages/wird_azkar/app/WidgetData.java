package dev.pages.wird_azkar.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Build;

import org.json.JSONObject;

/** بيانات الويدجت: نسخة من مفاتيح الويب (wird-prayer، المصحف، الختمة) + إعدادات كل ويدجت. */
final class WidgetData {
    static final Class<?>[] PROVIDERS = {WirdWidget.class, WTimesWidget.class, WFullWidget.class, WDhikrWidget.class, WMushafWidget.class};
    static final String[] MIRROR = {"wird-prayer", "wird-mushaf-page", "wird-mushaf-sura", "wird-last-surah", "wird-khatma"};

    static SharedPreferences p(Context c) { return c.getSharedPreferences("wird_widget", Context.MODE_PRIVATE); }

    static String get(Context c, String k) { return p(c).getString("k:" + k, null); }

    static void put(Context c, String k, String v) {
        String old = get(c, k);
        if (v == null ? old == null : v.equals(old)) return;
        SharedPreferences.Editor e = p(c).edit();
        if (v == null) e.remove("k:" + k); else e.putString("k:" + k, v);
        e.apply();
        refreshAll(c);
    }

    static JSONObject prayer(Context c) {
        try { String s = get(c, "wird-prayer"); if (s != null) return new JSONObject(s); } catch (Exception ignored) {}
        try { return new JSONObject("{\"city\":\"riyadh\",\"name\":\"الرياض\",\"lat\":24.7136,\"lng\":46.6753,\"tz\":\"Asia/Riyadh\",\"method\":\"uq\",\"asr\":1}"); }
        catch (Exception e) { return new JSONObject(); }
    }

    /* ---------------- إعدادات كل ويدجت ---------------- */
    static final int AUTO = 0;
    /** ألوان الخلفية (0 = تلقائي حسب وضع الجهاز). */
    static final int[] BG = {AUTO, 0xFF0F2A22, 0xFF000000, 0xFF1B2340, 0xFF3A2350, 0xFF4A1622, 0xFF12355B, 0xFFF3EBDD, 0xFFFFFFFF};
    static final String[] BG_N = {"تلقائي", "أخضر", "أسود", "كحلي", "بنفسجي", "عنابي", "أزرق", "رملي", "أبيض"};
    static final int[] AC = {AUTO, 0xFFE2C27F, 0xFF3FB27F, 0xFF4AA3DF, 0xFFF0A03C, 0xFFE06C9F, 0xFF8A8CF5, 0xFFFFFFFF};
    static final String[] FONT_N = {"خط الجهاز", "تجوّل", "المراعي", "أميري"};
    static final String[] FONT_K = {"", "tajawal", "almarai", "amiri"};
    static final String[] AC_N = {"حسب النمط", "ذهبي", "أخضر", "أزرق", "برتقالي", "وردي", "بنفسجي", "أبيض"};

    static final class Cfg {
        int alpha = 96, bg = 0, ac = 0, text = 0, size = 1, style = 0, grad = 0, sheen = 35, font = 1;
        boolean hijri = true, timer = true, arDigits = true, h12 = true, ampm = true, sunrise = true, extra = true, dhikr = true;

        JSONObject json() {
            JSONObject o = new JSONObject();
            try {
                o.put("v", 2).put("alpha", alpha).put("bg", bg).put("ac", ac).put("text", text).put("size", size)
                 .put("hijri", hijri).put("timer", timer).put("ar", arDigits).put("h12", h12).put("ampm", ampm)
                 .put("style", style).put("grad", grad).put("sheen", sheen).put("font", font).put("sunrise", sunrise).put("extra", extra).put("dhikr", dhikr);
            } catch (Exception ignored) {}
            return o;
        }

        static Cfg from(JSONObject o) {
            Cfg c = new Cfg();
            if (o == null) return c;
            c.alpha = o.optInt("alpha", c.alpha); c.bg = o.optInt("bg", c.bg); c.ac = o.optInt("ac", c.ac);
            c.text = o.optInt("text", c.text); c.size = o.optInt("size", c.size);
            c.hijri = o.optBoolean("hijri", c.hijri); c.timer = o.optBoolean("timer", c.timer);
            c.arDigits = o.optBoolean("ar", c.arDigits); c.h12 = o.optBoolean("h12", c.h12); c.ampm = o.optBoolean("ampm", c.ampm);
            c.style = o.optInt("style", c.style); c.grad = o.optInt("grad", c.grad); c.sheen = o.optInt("sheen", c.sheen); c.font = o.optInt("font", c.font);
            c.sunrise = o.optBoolean("sunrise", c.sunrise);
            if (!o.has("v")) { // إعدادات محفوظة قبل إضافة الثيمات: نحوّلها للترتيب الجديد
                if (o.has("style")) c.style = Math.min(7, o.optInt("style", 0) + 4);
                if (o.has("ac")) c.ac = Math.min(AC.length - 1, o.optInt("ac", 0) + 1);
            } c.extra = o.optBoolean("extra", c.extra); c.dhikr = o.optBoolean("dhikr", c.dhikr);
            return c;
        }

        Cfg copy() { return from(json()); }

        int bgColor(Context ctx) {
            int v = BG[Math.max(0, Math.min(bg, BG.length - 1))];
            if (v != AUTO) return v;
            int night = ctx.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            return night == Configuration.UI_MODE_NIGHT_NO ? 0xFFF7F3EA : 0xFF0F2A22;
        }

        boolean light(Context ctx) {
            if (text == 1) return false;
            if (text == 2) return true;
            int c = WidgetBg.effective(ctx, this);
            double l = (0.299 * ((c >> 16) & 255) + 0.587 * ((c >> 8) & 255) + 0.114 * (c & 255)) / 255;
            return l > 0.62;
        }

        int fg(Context ctx) { return light(ctx) ? 0xFF1C2622 : 0xFFFFFFFF; }
        int muted(Context ctx) { return light(ctx) ? 0xB31C2622 : 0xB3FFFFFF; }

        int accent(Context ctx) {
            int a = AC[Math.max(0, Math.min(ac, AC.length - 1))];
            if (a == AUTO) {
                if (style >= 0 && style < 4) return WidgetBg.THEME[style][2];
                a = 0xFFE2C27F;
            }
            if (light(ctx) && a == 0xFFFFFFFF) return 0xFF0F6B4C;
            if (light(ctx) && a == 0xFFE2C27F) return 0xFF9C7420;
            return a;
        }

        float scale() { return size == 0 ? 0.86f : size == 2 ? 1.16f : 1f; }
    }

    static Cfg cfg(Context c, int id) {
        try { String s = p(c).getString("cfg:" + id, null); if (s != null) return Cfg.from(new JSONObject(s)); } catch (Exception ignored) {}
        return new Cfg();
    }

    static void saveCfg(Context c, int id, Cfg cfg) { p(c).edit().putString("cfg:" + id, cfg.json().toString()).apply(); }

    static int dhikrIdx(Context c, int id) { return p(c).getInt("dh:" + id, -1); }
    static void setDhikrIdx(Context c, int id, int v) { p(c).edit().putInt("dh:" + id, v).apply(); }

    /* ---------------- التحديث ---------------- */
    static void refreshAll(Context c) {
        try {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            for (Class<?> k : PROVIDERS) {
                int[] ids = m.getAppWidgetIds(new ComponentName(c, k));
                for (int id : ids) m.updateAppWidget(id, WidgetRender.build(c, id, typeOf(k)));
            }
        } catch (Exception ignored) {}
        OngoingNote.update(c);
        scheduleTick(c);
    }

    static int typeOf(Class<?> k) {
        for (int i = 0; i < PROVIDERS.length; i++) if (PROVIDERS[i] == k) return i;
        return 0;
    }

    static boolean any(Context c) {
        if (OngoingNote.on(c)) return true;
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        for (Class<?> k : PROVIDERS) if (m.getAppWidgetIds(new ComponentName(c, k)).length > 0) return true;
        return false;
    }

    /** منبّه يحدّث الويدجت عند الصلاة القادمة وعند منتصف الليل. */
    static void scheduleTick(Context c) {
        try {
            AlarmManager am = c.getSystemService(AlarmManager.class);
            Intent i = new Intent(c, WidgetTick.class).setAction(WidgetTick.ACT_TICK);
            PendingIntent pi = PendingIntent.getBroadcast(c, 7701, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            if (!any(c)) { am.cancel(pi); return; }
            long now = System.currentTimeMillis(), at = Long.MAX_VALUE;
            JSONObject P = prayer(c);
            for (int d = 0; d < 2; d++) {
                PrayerCalc.Day D = PrayerCalc.day(P, d);
                for (long t : D.t) if (t > now + 500 && t < at) at = t;
            }
            java.util.Calendar mid = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone(P.optString("tz", "Asia/Riyadh")));
            mid.add(java.util.Calendar.DAY_OF_MONTH, 1);
            mid.set(java.util.Calendar.HOUR_OF_DAY, 0); mid.set(java.util.Calendar.MINUTE, 0); mid.set(java.util.Calendar.SECOND, 5);
            at = Math.min(at + 1000, mid.getTimeInMillis());
            if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms()) am.setAndAllowWhileIdle(AlarmManager.RTC, at, pi);
            else am.setExactAndAllowWhileIdle(AlarmManager.RTC, at, pi);
        } catch (Exception ignored) {}
    }
}
