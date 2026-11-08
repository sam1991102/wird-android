package dev.pages.wird_azkar.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.os.Bundle;

/** ويدجت «الصلاة القادمة» — وهي أساس الأنواع الخمسة. */
public class WirdWidget extends AppWidgetProvider {
    int type() { return WidgetRender.NEXT; }

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        for (int id : ids) m.updateAppWidget(id, WidgetRender.build(c, id, type()));
        WidgetData.scheduleTick(c);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager m, int id, Bundle o) {
        m.updateAppWidget(id, WidgetRender.build(c, id, type()));
    }

    @Override
    public void onDeleted(Context c, int[] ids) {
        android.content.SharedPreferences.Editor e = WidgetData.p(c).edit();
        for (int id : ids) e.remove("cfg:" + id).remove("dh:" + id);
        e.apply();
    }

    @Override
    public void onDisabled(Context c) { WidgetData.scheduleTick(c); }

    /** للتوافق مع الكود القديم. */
    static void refreshAll(Context c) { WidgetData.refreshAll(c); }
}
