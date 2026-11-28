# اختبار التطبيق على محاكي أندرويد

6 من 14 نجحوا

- ❌ emulator has internet
- ❌ fresh: wizard opens for a new user
- ✅ fresh: no other sheet on top of the wizard
- ❌ fresh: Android asks for location only after the button — `no location dialog`
- ✅ fresh: a hint while locating takes long
- ✅ fresh: location found or a clear message
- ❌ fresh: adhan screen
- ❌ fresh: Android asks for notifications after «تفعيل الأذان» — `no notification dialog`
- ❌ fresh: ready-steps screen lists only what is missing
- ✅ fresh: step «exact» — `not needed on this phone`
- ✅ fresh: step «battery» — `not needed on this phone`
- ❌ fresh: done screen
- ✅ fresh: wizard closes to home
- ❌ test run — `Error: ReferenceError: __wirdReady is not defined
    at <anonymous>:1:1
    at js (file:///home/runner/work/wird-android/wird-android/qa/device/run.mjs:53:41)
    at async file:///home/runner/work/wird-android/wird-android/qa/device/run.mjs:116:16`
