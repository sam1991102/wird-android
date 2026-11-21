# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# --- وِرد ---
# كود التطبيق نفسه (الإضافات بتتنادى من الجافاسكربت بالانعكاس، والمستقبِلات والخدمات من المانيفست)
-keep class dev.pages.wird_azkar.app.** { *; }
# Capacitor: الجسر والإضافات بتتنادى بالاسم من الويب
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
}
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
# أرقام السطور في تقارير Crashlytics (ملف الخريطة بيترفع تلقائي مع البناء)
-keepattributes *Annotation*,SourceFile,LineNumberTable,Signature,InnerClasses,EnclosingMethod
-renamesourcefileattribute SourceFile
# الإضافات بتتحمّل بالاسم من capacitor.plugins.json (Class.forName)، ومكتبات Cordova بالانعكاس
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class com.capacitorjs.** { *; }
-keep class org.apache.cordova.** { *; }
