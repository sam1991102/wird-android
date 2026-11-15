package dev.pages.wird_azkar.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.os.Build;

import org.json.JSONObject;

/**
 * ويدجت «اليوم»: المدينة والتاريخ الهجري، اسم اليوم كبير ممدود بالكشيدة لحد عرض الويدجت،
 * ومواقيت الصلوات الخمس والقادمة ملوّنة. بيترسم صورة علشان الكشيدة تتقاس بالظبط على العرض؛
 * والعدّاد التنازلي تحتها Chronometer حقيقي بيعدّ كل ثانية.
 */
final class WidgetDay {
    private WidgetDay() {}

    private static final int[] KS = {0, 2, 3, 4, 5}; // الفجر الظهر العصر المغرب العشاء (من غير الشروق)
    private static final String NO_JOIN_AFTER = "اأإآٱدذرزوؤءة";
    private static final char TATWEEL = 'ـ';

    static Typeface font(Context c, WidgetData.Cfg g, boolean bold) {
        if (Build.VERSION.SDK_INT >= 26) {
            try {
                String k = g.font > 0 && g.font < WidgetData.FONT_K.length ? WidgetData.FONT_K[g.font] : "tajawal";
                int id = c.getResources().getIdentifier(k + (bold ? "_bold" : "_regular"), "font", c.getPackageName());
                if (id != 0) return c.getResources().getFont(id);
            } catch (Exception ignored) {}
        }
        return bold ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT;
    }

    /** مكان الكشيدة: بين آخر حرفين بيتوصلوا ببعض (مثلًا «الاثنيـــن»، «الخميـــس»). */
    static int kashidaAt(String s) {
        for (int j = s.length() - 1; j > 1; j--) {
            char a = s.charAt(j - 1), b = s.charAt(j);
            boolean letterA = a >= 'ء' && a <= 'ي', letterB = b >= 'ء' && b <= 'ي';
            if (letterA && letterB && NO_JOIN_AFTER.indexOf(a) < 0 && b != 'ء') return j;
        }
        return -1;
    }

    /** اسم اليوم ممدود لحد ما يملا العرض (من غير ما يعدّيه). */
    static String stretch(String day, Paint p, float width) {
        int at = kashidaAt(day);
        if (at < 0 || p.measureText(day) >= width) return day;
        StringBuilder t = new StringBuilder(), best = new StringBuilder(day);
        for (int n = 1; n < 80; n++) {
            t.setLength(0);
            t.append(day, 0, at);
            for (int i = 0; i < n; i++) t.append(TATWEEL);
            t.append(day.substring(at));
            if (p.measureText(t, 0, t.length()) > width) break;
            best.setLength(0);
            best.append(t);
        }
        return best.toString();
    }

    /** الجزء العلوي كصورة: سطر المدينة والتاريخ، اسم اليوم، وصف المواقيت. */
    static Bitmap art(Context c, WidgetData.Cfg g, int wDp, int hDp) {
        float d = c.getResources().getDisplayMetrics().density, s = g.scale();
        int W = Math.max(1, Math.round(wDp * d)), H = Math.max(1, Math.round(hDp * d));
        Bitmap bm = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(bm);
        JSONObject P = WidgetData.prayer(c);
        PrayerCalc.Day D = PrayerCalc.day(P, 0);
        WidgetRender.Nx n = WidgetRender.nextOf(P);
        int fg = g.fg(c), mu = g.muted(c), ac = g.accent(c);
        Typeface tb = font(c, g, true), tr = font(c, g, false);
        float pad = 2 * d, right = W - pad, x0 = pad, cw = right - x0;

        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
        p.setTextAlign(Paint.Align.RIGHT);

        // ١) المدينة (لون مميز) والتاريخ الهجري
        float top = 13 * d * s;
        String city = P.optString("name", "");
        p.setTypeface(tb); p.setTextSize(top); p.setColor(ac);
        float y = top * 1.1f;
        cv.drawText(city, right, y, p);
        if (g.hijri) {
            float cwid = p.measureText(city) + 14 * d;
            p.setTypeface(tr); p.setColor(mu);
            cv.drawText(WidgetRender.hijri(P, g), right - cwid, y, p);
        }

        // ٢) اسم اليوم ممدود بالكشيدة على كل العرض، في نص المساحة بين السطر اللي فوق وصف المواقيت
        float rowH = 34 * d * s;
        float zoneTop = y + 8 * d, zoneBot = H - rowH - 6 * d, zone = Math.max(10 * d, zoneBot - zoneTop);
        String day = WidgetRender.dayName(P, g);
        android.graphics.Rect r = new android.graphics.Rect();
        float big = Math.min(zone * 1.2f, 64 * d * s);
        p.setTypeface(tb); p.setColor(fg); p.setTextSize(big);
        p.getTextBounds(day, 0, day.length(), r);
        while ((r.height() > zone || p.measureText(day) > cw * 0.82f) && big > 16 * d) {
            big -= d; p.setTextSize(big); p.getTextBounds(day, 0, day.length(), r);
        }
        String wide = stretch(day, p, cw);
        p.getTextBounds(wide, 0, wide.length(), r);
        float dayBase = zoneTop + (zone - r.height()) / 2f - r.top;
        cv.drawText(wide, right, dayBase, p);

        // ٣) المواقيت: خمس أعمدة، والقادمة بلون مميز
        boolean nextToday = n.t == D.t[n.k];
        float colW = cw / KS.length, nameS = 13 * d * s, timeS = 17 * d * s;
        /* في الويدجت الضيقة: نصغّر الأسماء والأوقات لحد ما أعرض واحد يدخل في عموده */
        p.setTypeface(tb); p.setTextSize(nameS);
        float wn = 0; for (int k : KS) wn = Math.max(wn, p.measureText(WidgetRender.name(k, D.fri)));
        if (wn > colW * 0.92f) { float f = colW * 0.92f / wn; nameS *= f; timeS *= Math.max(f, 0.8f); }
        float nameY = H - rowH + nameS, timeY = H - 3 * d;
        p.setTextAlign(Paint.Align.CENTER);
        for (int i = 0; i < KS.length; i++) {
            int k = KS[i];
            boolean hi = k == n.k && (nextToday || k == 0);
            float cx = right - colW * i - colW / 2f;
            p.setTypeface(tb); p.setTextSize(nameS); p.setColor(hi ? ac : mu);
            cv.drawText(WidgetRender.name(k, D.fri), cx, nameY, p);
            p.setTextSize(timeS); p.setColor(hi ? ac : fg);
            WidgetData.Cfg g2 = g.copy(); g2.ampm = false;
            cv.drawText(WidgetRender.fmt(D.t[k], P, g2), cx, timeY, p);
        }
        return bm;
    }
}
