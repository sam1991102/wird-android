package dev.pages.wird_azkar.app;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.SeekBar;
import android.widget.Switch;
import android.widget.TextView;

/** شاشة إعدادات الويدجت مع معاينة حيّة. تظهر عند الإضافة (اختياري) وعند «إعادة الضبط» بالضغط المطوّل. */
public class WidgetConfigActivity extends Activity {
    private static final int BG = 0xFF0B1F19, CARD = 0xFF143329, FG = 0xFFFFFFFF, MUTED = 0xB3FFFFFF, GOLD = 0xFFE2C27F;
    private int id, type;
    private WidgetData.Cfg cfg;
    private FrameLayout preview;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        setResult(RESULT_CANCELED);
        id = getIntent().getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        if (id == AppWidgetManager.INVALID_APPWIDGET_ID) { finish(); return; }
        android.appwidget.AppWidgetProviderInfo info = AppWidgetManager.getInstance(this).getAppWidgetInfo(id);
        type = 0;
        if (info != null) for (int i = 0; i < WidgetData.PROVIDERS.length; i++)
            if (info.provider.getClassName().equals(WidgetData.PROVIDERS[i].getName())) type = i;
        cfg = WidgetData.cfg(this, id);
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);
        setContentView(ui());
        draw();
    }

    private View ui() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(BG);
        root.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        root.setFitsSystemWindows(true);

        TextView title = t("إعدادات الويدجت", 20, FG, true);
        title.setPadding(dp(20), dp(16), dp(20), dp(4));
        root.addView(title);
        TextView sub = t(new String[]{"الصلاة القادمة", "المواقيت", "الويدجت الشامل", "ذكر", "المصحف والختمة"}[type], 13, MUTED, false);
        sub.setPadding(dp(20), 0, dp(20), dp(10));
        root.addView(sub);

        preview = new FrameLayout(this);
        int h = type == WidgetRender.FULL ? 330 : type == WidgetRender.NEXT || type == WidgetRender.MUSHAF ? 170 : 130;
        LinearLayout.LayoutParams pl = new LinearLayout.LayoutParams(type == WidgetRender.NEXT || type == WidgetRender.MUSHAF ? dp(190) : ViewGroup.LayoutParams.MATCH_PARENT, dp(h));
        pl.gravity = Gravity.CENTER_HORIZONTAL;
        pl.setMargins(dp(20), dp(4), dp(20), dp(12));
        GradientDrawable chk = new GradientDrawable(GradientDrawable.Orientation.TL_BR, new int[]{0xFF5B6E8C, 0xFF8C5B7A});
        chk.setCornerRadius(dp(26));
        FrameLayout wall = new FrameLayout(this);
        wall.setBackground(chk);
        wall.setPadding(dp(10), dp(10), dp(10), dp(10));
        wall.addView(preview, new FrameLayout.LayoutParams(-1, -1));
        root.addView(wall, pl);

        ScrollView sv = new ScrollView(this);
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(16), 0, dp(16), dp(16));
        sv.addView(box);
        root.addView(sv, new LinearLayout.LayoutParams(-1, 0, 1));

        LinearLayout c1 = card(box, "الخلفية");
        c1.addView(label("الشفافية"));
        SeekBar sb = new SeekBar(this);
        sb.setMax(100);
        sb.setProgress(100 - cfg.alpha);
        sb.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            public void onProgressChanged(SeekBar s, int p, boolean u) { cfg.alpha = 100 - p; draw(); }
            public void onStartTrackingTouch(SeekBar s) {}
            public void onStopTrackingTouch(SeekBar s) {}
        });
        c1.addView(sb);
        c1.addView(label("اللون"));
        c1.addView(swatches(WidgetData.BG, WidgetData.BG_N, true));

        LinearLayout c2 = card(box, "الألوان والخط");
        c2.addView(label("لون التمييز"));
        c2.addView(swatches(WidgetData.AC, WidgetData.AC_N, false));
        c2.addView(label("لون النص"));
        c2.addView(chips(new String[]{"تلقائي", "فاتح", "داكن"}, cfg.text, v -> { cfg.text = v; draw(); }));
        c2.addView(label("حجم الخط"));
        c2.addView(chips(new String[]{"صغير", "عادي", "كبير"}, cfg.size, v -> { cfg.size = v; draw(); }));

        LinearLayout c3 = card(box, "المحتوى");
        if (type != WidgetRender.DHIKR && type != WidgetRender.MUSHAF) {
            sw(c3, "التاريخ الهجري", cfg.hijri, v -> cfg.hijri = v);
            sw(c3, "نظام ١٢ ساعة", cfg.h12, v -> cfg.h12 = v);
            sw(c3, "إظهار ص / م", cfg.ampm, v -> cfg.ampm = v);
        }
        if (type == WidgetRender.NEXT || type == WidgetRender.FULL) sw(c3, "العدّاد التنازلي", cfg.timer, v -> cfg.timer = v);
        if (type == WidgetRender.TIMES || type == WidgetRender.FULL) sw(c3, "وقت الشروق", cfg.sunrise, v -> cfg.sunrise = v);
        if (type == WidgetRender.FULL) {
            sw(c3, "منتصف الليل والثلث الأخير", cfg.extra, v -> cfg.extra = v);
            sw(c3, "ذكر اليوم", cfg.dhikr, v -> cfg.dhikr = v);
        }
        sw(c3, "الأرقام العربية (١٢٣)", cfg.arDigits, v -> cfg.arDigits = v);

        TextView save = t("حفظ", 16, 0xFF0B1F19, true);
        save.setGravity(Gravity.CENTER);
        GradientDrawable sbg = new GradientDrawable();
        sbg.setColor(GOLD);
        sbg.setCornerRadius(dp(16));
        save.setBackground(sbg);
        LinearLayout.LayoutParams spl = new LinearLayout.LayoutParams(-1, dp(52));
        spl.setMargins(dp(16), dp(6), dp(16), dp(14));
        save.setOnClickListener(v -> done());
        root.addView(save, spl);
        return root;
    }

    private void done() {
        WidgetData.saveCfg(this, id, cfg);
        AppWidgetManager.getInstance(this).updateAppWidget(id, WidgetRender.build(this, id, type));
        WidgetData.scheduleTick(this);
        setResult(RESULT_OK, new Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id));
        finish();
    }

    private void draw() {
        try {
            preview.removeAllViews();
            View v = WidgetRender.render(this, cfg, type, 0).apply(this, preview);
            preview.addView(v, new FrameLayout.LayoutParams(-1, -1));
        } catch (Exception ignored) {}
    }

    /* ---------- عناصر الواجهة ---------- */

    interface IntCb { void on(int v); }
    interface BoolCb { void on(boolean v); }

    private LinearLayout card(LinearLayout parent, String head) {
        TextView h = t(head, 13, GOLD, true);
        h.setPadding(dp(6), dp(14), dp(6), dp(6));
        parent.addView(h);
        LinearLayout c = new LinearLayout(this);
        c.setOrientation(LinearLayout.VERTICAL);
        c.setPadding(dp(14), dp(8), dp(14), dp(10));
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(CARD);
        bg.setCornerRadius(dp(18));
        c.setBackground(bg);
        parent.addView(c);
        return c;
    }

    private TextView label(String s) {
        TextView t = t(s, 13, MUTED, false);
        t.setPadding(0, dp(8), 0, dp(4));
        return t;
    }

    private View swatches(int[] colors, String[] names, boolean isBg) {
        HorizontalScrollView hs = new HorizontalScrollView(this);
        hs.setHorizontalScrollBarEnabled(false);
        LinearLayout row = new LinearLayout(this);
        hs.addView(row);
        for (int i = 0; i < colors.length; i++) {
            final int idx = i;
            LinearLayout cell = new LinearLayout(this);
            cell.setOrientation(LinearLayout.VERTICAL);
            cell.setGravity(Gravity.CENTER_HORIZONTAL);
            cell.setPadding(dp(4), dp(2), dp(4), dp(2));
            View dot = new View(this);
            GradientDrawable d = colors[i] == WidgetData.AUTO
                    ? new GradientDrawable(GradientDrawable.Orientation.TL_BR, new int[]{0xFFF7F3EA, 0xFF0F2A22})
                    : new GradientDrawable();
            if (colors[i] != WidgetData.AUTO) d.setColor(colors[i]);
            d.setShape(GradientDrawable.OVAL);
            boolean on = isBg ? cfg.bg == i : cfg.ac == i;
            d.setStroke(dp(on ? 3 : 1), on ? GOLD : 0x40FFFFFF);
            dot.setBackground(d);
            cell.addView(dot, new LinearLayout.LayoutParams(dp(38), dp(38)));
            TextView n = t(names[i], 11, on ? FG : MUTED, false);
            n.setPadding(0, dp(3), 0, 0);
            cell.addView(n);
            cell.setOnClickListener(v -> {
                if (isBg) cfg.bg = idx; else cfg.ac = idx;
                ViewGroup p = (ViewGroup) hs.getParent();
                int at = p.indexOfChild(hs);
                p.removeView(hs);
                p.addView(swatches(colors, names, isBg), at);
                draw();
            });
            row.addView(cell);
        }
        return hs;
    }

    private View chips(String[] labels, int sel, IntCb cb) {
        LinearLayout row = new LinearLayout(this);
        for (int i = 0; i < labels.length; i++) {
            final int idx = i;
            TextView c = t(labels[i], 14, i == sel ? 0xFF0B1F19 : FG, i == sel);
            c.setGravity(Gravity.CENTER);
            GradientDrawable bg = new GradientDrawable();
            bg.setColor(i == sel ? GOLD : 0x1AFFFFFF);
            bg.setCornerRadius(dp(14));
            c.setBackground(bg);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(40), 1);
            lp.setMargins(dp(3), dp(2), dp(3), dp(2));
            c.setOnClickListener(v -> {
                cb.on(idx);
                ViewGroup p = (ViewGroup) row.getParent();
                int at = p.indexOfChild(row);
                p.removeView(row);
                p.addView(chips(labels, idx, cb), at);
            });
            row.addView(c, lp);
        }
        return row;
    }

    private void sw(LinearLayout parent, String label, boolean val, BoolCb cb) {
        Switch s = new Switch(this);
        s.setText(label);
        s.setTextColor(FG);
        s.setTextSize(15);
        s.setChecked(val);
        s.setPadding(0, dp(10), 0, dp(10));
        s.setOnCheckedChangeListener((CompoundButton b, boolean v) -> { cb.on(v); draw(); });
        parent.addView(s, new LinearLayout.LayoutParams(-1, -2));
    }

    private TextView t(String s, float sp, int color, boolean bold) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(sp);
        t.setTextColor(color);
        if (bold) t.setTypeface(Typeface.DEFAULT_BOLD);
        return t;
    }

    private int dp(int v) { return Math.round(v * getResources().getDisplayMetrics().density); }
}
