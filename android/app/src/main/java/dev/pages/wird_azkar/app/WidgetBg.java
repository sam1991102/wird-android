package dev.pages.wird_azkar.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.RectF;
import android.graphics.Shader;

/** يرسم خلفية الويدجت: زجاج فاتح/داكن، تدرّج، أو لون سادة — مع لمعة وحافة مضيئة. */
final class WidgetBg {
    static final String[] STYLE_N = {"زجاج فاتح", "زجاج داكن", "تدرّج", "لون سادة"};
    static final int[][] GRAD = {
        {0xFF6A5ACD, 0xFFE06C9F}, {0xFF1B2340, 0xFF3A7BD5}, {0xFFF0A03C, 0xFFD9467A},
        {0xFF0F6B4C, 0xFF3FB27F}, {0xFF141E30, 0xFF243B55}, {0xFFE9D8B4, 0xFFC9A66B}};
    static final String[] GRAD_N = {"بنفسجي", "أزرق", "غروب", "أخضر", "ليلي", "رملي"};

    /** اللون "الفعلي" التقريبي فوق خلفية متوسطة — لاختيار لون النص. */
    static int effective(Context c, WidgetData.Cfg g) {
        int base;
        switch (g.style) {
            case 0: base = 0xFFFFFFFF; break;
            case 1: base = 0xFF10151C; break;
            case 2: { int[] p = GRAD[clamp(g.grad, GRAD.length)]; base = mix(p[0], p[1], .5f); break; }
            default: base = g.bgColor(c);
        }
        return mix(0xFF3A3F45, base, g.alpha / 100f);
    }

    static Bitmap draw(Context c, WidgetData.Cfg g, int wDp, int hDp) {
        float d = c.getResources().getDisplayMetrics().density;
        float k = Math.min(2.2f, Math.min(d, 900f / Math.max(wDp, hDp)));
        int W = Math.max(40, Math.round(wDp * k)), H = Math.max(40, Math.round(hDp * k));
        Bitmap b = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(b);
        float r = 24 * k, inset = 0.75f * k;
        RectF R = new RectF(inset, inset, W - inset, H - inset);
        int a = Math.round(g.alpha * 2.55f);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);

        // الطبقة الأساسية
        switch (g.style) {
            case 0: p.setShader(new LinearGradient(0, 0, W, H, withA(0xFFFFFFFF, a), withA(0xFFDDE6F0, Math.round(a * .7f)), Shader.TileMode.CLAMP)); break;
            case 1: p.setShader(new LinearGradient(0, 0, W, H, withA(0xFF1E2630, a), withA(0xFF06090D, a), Shader.TileMode.CLAMP)); break;
            case 2: { int[] q = GRAD[clamp(g.grad, GRAD.length)]; p.setShader(new LinearGradient(0, 0, W, H, withA(q[0], a), withA(q[1], a), Shader.TileMode.CLAMP)); break; }
            default: p.setColor(withA(g.bgColor(c), a));
        }
        cv.drawRoundRect(R, r, r, p);

        float s = g.sheen / 100f;
        if (s > 0) {
            // لمعة علوية
            Paint t = new Paint(Paint.ANTI_ALIAS_FLAG);
            t.setShader(new LinearGradient(0, 0, 0, H * .55f, withA(0xFFFFFFFF, Math.round(70 * s)), 0x00FFFFFF, Shader.TileMode.CLAMP));
            cv.drawRoundRect(R, r, r, t);
            // ضوء ناعم من الزاوية
            Paint o = new Paint(Paint.ANTI_ALIAS_FLAG);
            o.setShader(new RadialGradient(W * .85f, H * .05f, Math.max(W, H) * .7f, withA(0xFFFFFFFF, Math.round(55 * s)), 0x00FFFFFF, Shader.TileMode.CLAMP));
            cv.drawRoundRect(R, r, r, o);
            // ظل خفيف في الأسفل يعطي عمقًا
            Paint u = new Paint(Paint.ANTI_ALIAS_FLAG);
            u.setShader(new LinearGradient(0, H * .6f, 0, H, 0x00000000, withA(0xFF000000, Math.round(40 * s)), Shader.TileMode.CLAMP));
            cv.drawRoundRect(R, r, r, u);
        }
        // حافة مضيئة
        Paint e = new Paint(Paint.ANTI_ALIAS_FLAG);
        e.setStyle(Paint.Style.STROKE);
        e.setStrokeWidth(1.3f * k);
        int top = Math.round(Math.max(40, 190 * s)), bot = Math.round(Math.max(15, 50 * s));
        e.setShader(new LinearGradient(0, 0, W, H, withA(0xFFFFFFFF, top), withA(0xFFFFFFFF, bot), Shader.TileMode.CLAMP));
        cv.drawRoundRect(R, r, r, e);
        return b;
    }

    static int withA(int c, int a) { return (Math.max(0, Math.min(255, a)) << 24) | (c & 0xFFFFFF); }

    static int mix(int a, int b, float t) {
        int ra = (a >> 16) & 255, ga = (a >> 8) & 255, ba = a & 255, rb = (b >> 16) & 255, gb = (b >> 8) & 255, bb = b & 255;
        return 0xFF000000 | (Math.round(ra + (rb - ra) * t) << 16) | (Math.round(ga + (gb - ga) * t) << 8) | Math.round(ba + (bb - ba) * t);
    }

    static int clamp(int v, int n) { return Math.max(0, Math.min(v, n - 1)); }
}
