# ذكر الساعة — خطة التنفيذ

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** إشعار ذكر قصير كل ساعة بزراير عدّ، من قايمة مختارة على حسب الوقت.
**Architecture:** الويب يبني أحداث `dhikr-*` في جدولة الأذان الحالية (`__dhikrEvents`)؛ سكربت الربط في index.html يعدّيها للأندرويد بنوع `dhikr` ومعاها `x={text,fadl,src,reps}`؛ الأندرويد يرسمها بقناة وزراير، ويخزّن الضغطات لحد ما التطبيق يتفتح.
**Tech Stack:** JS (ui.js modules)، Java (Capacitor plugin، AlarmManager، NotificationCompat).
**Spec:** `docs/superpowers/specs/2026-11-20-dhikr-hourly-notif-design.md`

## Global Constraints
- الإعداد `wird-dr` = `{on, every:1|2|3, from:"HH:MM", to:"HH:MM", heads:0|1}`؛ القديم `{on,list,...}` يتحوّل مع الإبقاء على `on`.
- مفيش حديث أو مصدر غير موثّق؛ المصدر بالاسم من غير أرقام.
- إشعار الذكر رقمه ثابت `4242` (الجديد يحل محل القديم).
- قنوات: `wird_dhikr` (عالية، من غير صوت، اهتزاز قصير) و`wird_dhikr_quiet` (منخفضة).
- APK قديم لازم يفضل يعرض الذكر كإشعار عادي (نوع غير معروف = تذكير عادي).
- الأقفال: theme-lint وui-lint ما يزيدوش.

## Review Focus
- ساعة في أول ١٥ دقيقة بعد أذان → تتأخر لـ٢٠ دقيقة بعد الأذان (مش تتلغى).
- `from` بعد `to` (مثلًا ٢٢:٠٠ → ٠٢:٠٠) → الفترة تعدّي نص الليل.
- نفس الذكر ما يتكررش في نفس اليوم حتى لو `every=1` و١٦ ساعة.
- التطبيق مفتوح وقت التذكير → ما يظهرش إشعار.
- ضغطات على الإشعار ليوم فات → ما تتضافش لعدّاد النهارده.

---

### Task 1: الويب — القايمة والجدولة والإعدادات
**Files:** Create `web/ui/core/41-dhikr-hourly.js`; Modify `web/ui/core/16-qari.js` (شيل PRE/DR/`__dhikrEvents`/قسم `#st-dr`)، `web/ui/core/24-dhikr-reminders.js` (شيل خلط الأذكار وزرار المثال)، `web/manifest.json`، `web/css/19-prayer-page.css` → ستايل `.dh-*` في `web/css/20-dhikr.css`.
**Produces:** `window.__dhikrEvents(days) -> [{t,title,body,tag:"dhikr-<key>",url:"/#tasbih",x:{text,fadl,src,reps}}]`، `window.__dhikrPick(date:Date) -> item`.
- [ ] اختبار Playwright `/tmp/pt/dh.mjs`: `every=1,from=08:00,to=22:00` → ١٥ حدث/يوم، مفيش مفتاح متكرر في اليوم، مفيش حدث في [أذان، أذان+١٥د]، `22:00→02:00` → ٥ أحداث.
- [ ] تنفيذ؛ اختيار الذكر حتمي من (التاريخ، رقم الفترة)، والوعاء حسب الوقت (قبل الظهر: تسبيح/دعاء، الظهر–العصر: تسبيح/حوقلة، العصر–المغرب: استغفار، بعد المغرب: صلاة على النبي/دعاء، الجمعة: صلاة على النبي أولًا).
- [ ] صفحة `#st-dr`: تفعيل، كل قد إيه، من/لحد، يظهر فوق الشاشة، مثال للإشعار؛ أي تغيير → `__wirdPush.sync(true)`.
- [ ] build + lints + commit.

### Task 2: الربط — index.html
**Files:** Modify `web/site/index.html` (سكربت wird-native).
- [ ] اختبار `/tmp/pt/nat.mjs`: أحداث `dhikr-*` توصل `schedule` بـ`kind:"dhikr"` و`x` و`heads`.
- [ ] تنفيذ + commit.

### Task 3: الأندرويد — الإشعار والزراير والضغطات
**Files:** Modify `AdhanStore.java` (قناتين)، `AdhanReceiver.java` (نوع dhikr + أفعال `DHIKR_DONE`/`DHIKR_ADD10`)، `WNotify.java` (`dhikr(c, ev)` يبني الإشعار)، `WirdAdhanPlugin.java` (`dhikrTaps()` → `{date,n}` ويصفّر)، `MainActivity.java` (`static boolean fg`)، `AndroidManifest.xml` لو الأفعال محتاجة تسجيل.
- [ ] `./gradlew assembleDebug` في GitHub Actions (مفيش SDK هنا) — compile check محلي بـ`javac` على الملفات مستحيل من غير android.jar؛ نعتمد على بناء الـCI.
- [ ] الويب: عند الفتح/الرجوع `dhikrTaps()` → `day.tasbih += n` لو التاريخ النهارده، `saveDay()`.
- [ ] commit + push، ونطلب من سام يشغّل بناء الـAPK.
