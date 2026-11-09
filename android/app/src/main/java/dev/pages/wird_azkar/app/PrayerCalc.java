package dev.pages.wird_azkar.app;

import org.json.JSONObject;

import java.util.Calendar;
import java.util.TimeZone;

/** نسخة Java مطابقة لحساب المواقيت في تطبيق الويب (app.js → PT) بدون أي دقائق احتياط. */
final class PrayerCalc {
    static final String[] KEYS = {"fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"};
    static final String[] NAMES = {"الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"};

    /** يوم محسوب: أوقات بالـ epoch ms + تاريخ المدينة المحلي. */
    static final class Day {
        long[] t = new long[6];
        int y, m, d;
        boolean fri;
    }

    private static double sn(double x) { return Math.sin(Math.toRadians(x)); }
    private static double cs(double x) { return Math.cos(Math.toRadians(x)); }
    private static double asn(double x) { return Math.toDegrees(Math.asin(x)); }
    private static double nrm(double t, double e) { t -= e * Math.floor(t / e); return t < 0 ? t + e : t; }

    /** {decl, eqt} */
    private static double[] sun(double jd) {
        double i = jd - 2451545;
        double g = nrm(357.529 + .98560028 * i, 360);
        double q = nrm(280.459 + .98564736 * i, 360);
        double L = nrm(q + 1.915 * sn(g) + .02 * sn(2 * g), 360);
        double e = 23.439 - 36e-8 * i;
        double ra = nrm(Math.toDegrees(Math.atan2(cs(e) * sn(L), cs(L))) / 15, 24);
        return new double[]{asn(sn(e) * sn(L)), q / 15 - ra};
    }

    private static double julian(int y, int m, int d) {
        if (m <= 2) { y--; m += 12; }
        int a = (int) Math.floor(y / 100.0);
        int b = 2 - a + (int) Math.floor(a / 4.0);
        return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
    }

    /** fajr angle, isha angle, isha minutes after maghrib */
    private static double[] method(String m) {
        switch (m == null ? "" : m) {
            case "uq": return new double[]{18.5, 0, 90};
            case "egypt": return new double[]{19.5, 17.5, 0};
            case "gulf": return new double[]{18.2, 18.2, 0};
            case "karachi": return new double[]{18, 18, 0};
            case "isna": return new double[]{15, 15, 0};
            default: return new double[]{18, 17, 0};
        }
    }


    static boolean isRamadan(int y, int mo, int d) {
        try {
            if (android.os.Build.VERSION.SDK_INT >= 24) {
                android.icu.util.IslamicCalendar ic = new android.icu.util.IslamicCalendar();
                ic.setCalculationType(android.icu.util.IslamicCalendar.CalculationType.ISLAMIC_UMALQURA);
                java.util.Calendar g = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone("UTC"));
                g.clear(); g.set(y, mo - 1, d, 12, 0, 0);
                ic.setTimeZone(android.icu.util.TimeZone.getTimeZone("UTC"));
                ic.setTimeInMillis(g.getTimeInMillis());
                return ic.get(android.icu.util.Calendar.MONTH) == 8;
            }
        } catch (Throwable ignored) {}
        return false;
    }

    /** ساعات محلية عشرية لكل وقت. */
    static double[] hours(int y, int mo, int d, double lat, double lng, double tz, String meth, double asrF) {
        final double[] M = method(meth);
        final double jd = julian(y, mo, d) - lng / 360;
        double[] Y = {5, 6, 12, 13, 18, 18};
        for (int it = 0; it < 6; it++) {
            double[] n = new double[6];
            n[0] = ha(jd, lat, M[0], Y[0] / 24, true);
            n[1] = ha(jd, lat, .833, Y[1] / 24, true);
            n[2] = mid(jd, Y[2] / 24);
            n[3] = asr(jd, lat, asrF, Y[3] / 24);
            n[4] = ha(jd, lat, .833, Y[4] / 24, false);
            n[5] = M[1] > 0 ? ha(jd, lat, M[1], Y[5] / 24, false) : 0;
            Y = n;
        }
        double off = tz - lng / 15;
        double[] r = new double[6];
        for (int k = 0; k < 5; k++) r[k] = Y[k] + off;
        double im = M[2];
        if (im == 90 && isRamadan(y, mo, d)) im = 120; // أم القرى: 120 دقيقة في رمضان
        r[5] = im > 0 ? r[4] + im / 60 : Y[5] + off;
        // خطوط العرض العالية: قاعدة الزاوية (نسبة من الليل) كما في أغلب التقاويم
        double night = 24 - (r[4] - r[1]);
        if (M[0] > 0) { double pf = M[0] / 60 * night; if (Double.isNaN(r[0]) || r[1] - r[0] > pf) r[0] = r[1] - pf; }
        if (M[1] > 0) { double pi = M[1] / 60 * night; if (Double.isNaN(r[5]) || r[5] - r[4] > pi) r[5] = r[4] + pi; }
        return r;
    }

    private static double mid(double jd, double t) { return nrm(12 - sun(jd + t)[1], 24); }

    private static double ha(double jd, double lat, double ang, double t, boolean ccw) {
        double[] o = sun(jd + t);
        double x = (-sn(ang) - sn(o[0]) * sn(lat)) / (cs(o[0]) * cs(lat));
        double d = Math.toDegrees(Math.acos(Math.max(-1, Math.min(1, x)))) / 15;
        return mid(jd, t) + (ccw ? -d : d);
    }

    private static double asr(double jd, double lat, double f, double t) {
        double[] r = sun(jd + t);
        double n = f + Math.tan(Math.toRadians(Math.abs(lat - r[0])));
        return ha(jd, lat, -Math.toDegrees(Math.atan(1 / n)), t, false);
    }

    /** يحسب يوم المدينة بعد offsetDays من اليوم، حسب إعدادات wird-prayer. */
    static Day day(JSONObject P, int offsetDays) {
        String tzId = P.optString("tz", "Asia/Riyadh");
        TimeZone tz = TimeZone.getTimeZone(tzId);
        Calendar c = Calendar.getInstance(tz);
        c.add(Calendar.DAY_OF_MONTH, offsetDays);
        Day D = new Day();
        D.y = c.get(Calendar.YEAR); D.m = c.get(Calendar.MONTH) + 1; D.d = c.get(Calendar.DAY_OF_MONTH);
        D.fri = c.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY;
        Calendar noon = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        noon.clear(); noon.set(D.y, D.m - 1, D.d, 12, 0, 0);
        double off = tz.getOffset(noon.getTimeInMillis()) / 3600000.0;
        double[] h = hours(D.y, D.m, D.d, P.optDouble("lat", 24.7136), P.optDouble("lng", 46.6753), off,
                P.optString("method", "uq"), P.optDouble("asr", 1));
        JSONObject adj = P.optJSONObject("adj");
        Calendar base = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        base.clear(); base.set(D.y, D.m - 1, D.d, 0, 0, 0);
        long b = base.getTimeInMillis();
        for (int k = 0; k < 6; k++) {
            double hh = h[k];
            if (adj != null) hh += adj.optDouble(KEYS[k], 0) / 60;
            // تقريب الثواني إلى دقيقة كما في التقويم: الشروق لأسفل، الظهر لأقرب دقيقة، والباقي لأعلى
            double mm = hh * 60;
            mm = k == 1 ? Math.floor(mm + 1e-6) : k == 2 ? Math.round(mm) : Math.ceil(mm - 1e-6);
            hh = mm / 60;
            D.t[k] = Math.round(b + (hh - off) * 3600e3);
        }
        return D;
    }
}
