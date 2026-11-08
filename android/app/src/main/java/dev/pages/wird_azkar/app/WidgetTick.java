package dev.pages.wird_azkar.app;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** يحدّث الويدجت عند كل صلاة ومنتصف الليل وتغيير الوقت، وزر «التالي» في ويدجت الذكر. */
public class WidgetTick extends BroadcastReceiver {
    static final String ACT_TICK = "dev.pages.wird_azkar.app.WIDGET_TICK";
    static final String ACT_NEXT = "dev.pages.wird_azkar.app.WIDGET_DHIKR_NEXT";

    @Override
    public void onReceive(Context c, Intent i) {
        if (ACT_NEXT.equals(i.getAction())) {
            int id = i.getIntExtra("id", 0);
            int cur = WidgetData.dhikrIdx(c, id);
            if (cur < 0) cur = WidgetRender.dayIndex();
            WidgetData.setDhikrIdx(c, id, (cur + 1) % WidgetRender.DHIKR_LIST.length);
            AppWidgetManager.getInstance(c).updateAppWidget(id, WidgetRender.build(c, id, WidgetRender.DHIKR));
            return;
        }
        WidgetData.refreshAll(c);
    }
}
