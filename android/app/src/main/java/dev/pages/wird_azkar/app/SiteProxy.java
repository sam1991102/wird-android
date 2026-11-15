package dev.pages.wird_azkar.app;

import android.content.Context;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;

import org.json.JSONArray;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * الموقع كله جوه التطبيق (مجلد www) على نفس الدومين wird-azkar.pages.dev، فبيانات المستخدم
 * (الختمة، المفضلة، الإعدادات) فاضلة زي ما هي.
 *
 * لكل طلب على الدومين:
 *  - /api/…            ← من الإنترنت دايمًا (الخادم).
 *  - ملفات ما بتتغيّرش (صفحات المصحف، صور og، الخطوط، الصور) وموجودة جوه التطبيق ← من الجهاز.
 *  - ملفات الموقع (html/js/css/json) ← من الإنترنت الأول عشان التحديثات توصل على طول،
 *    ولو مفيش نت أو الرد فشل ← النسخة اللي جوه التطبيق (Capacitor).
 * أي حاجة مش جوه التطبيق ← من الإنترنت.
 */
final class SiteProxy {
    static final String HOST = "wird-azkar.pages.dev";
    private static final String BASE = "https://" + HOST;
    private static Set<String> bundled;

    private SiteProxy() {}

    private static synchronized Set<String> bundled(Context c) {
        if (bundled != null) return bundled;
        Set<String> s = new HashSet<>();
        try (InputStream in = c.getAssets().open("public/app-files.json");
             BufferedReader r = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder(); String line;
            while ((line = r.readLine()) != null) sb.append(line);
            JSONArray a = new JSONArray(sb.toString());
            for (int i = 0; i < a.length(); i++) s.add(a.getString(i));
        } catch (Exception ignored) {}
        bundled = s;
        return s;
    }

    /** ملفات ثابتة بتتخدم من الجهاز من غير ما نسأل الإنترنت. */
    private static boolean immutable(String path) {
        return path.startsWith("/mushaf/") || path.startsWith("/qdata/") || path.startsWith("/og/") || path.startsWith("/fonts/")
                || path.startsWith("/kids/") || path.matches(".*\\.(png|jpe?g|webp|gif|ico|woff2?|ttf|svg)$");
    }

    /** يرجّع null لو Capacitor يخدم الطلب من الملفات اللي جوه التطبيق. */
    static WebResourceResponse intercept(Context c, WebResourceRequest req) {
        Uri u = req.getUrl();
        if (u == null || !HOST.equalsIgnoreCase(u.getHost())) return null;
        if (!"GET".equalsIgnoreCase(req.getMethod())) return null;
        String path = u.getPath() == null ? "/" : u.getPath();
        boolean api = path.startsWith("/api/");
        boolean have = bundled(c).contains(path);
        if (!api && have && immutable(path)) return null;

        WebResourceResponse net = fetch(u, req.getRequestHeaders(), api ? 15000 : 10000);
        if (net != null) return net;
        if (api) return json(503, "{\"ok\":false,\"offline\":true}");
        return null; // مفيش نت: النسخة اللي جوه التطبيق
    }

    private static WebResourceResponse fetch(Uri u, Map<String, String> reqHeaders, int readTimeout) {
        HttpURLConnection con = null;
        try {
            String q = u.getEncodedQuery();
            URL url = new URL(BASE + (u.getEncodedPath() == null ? "/" : u.getEncodedPath()) + (q != null ? "?" + q : ""));
            con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(4000);
            con.setReadTimeout(readTimeout);
            con.setInstanceFollowRedirects(true);
            if (reqHeaders != null) for (Map.Entry<String, String> h : reqHeaders.entrySet()) {
                String k = h.getKey();
                if (k == null) continue;
                String kl = k.toLowerCase();
                // الضغط بيفكّه HttpURLConnection بنفسه، وطلبات «اتغيّر ولا لأ» ممكن ترجع 304 والـ WebView مش بيفهمها هنا
                if (kl.equals("host") || kl.equals("accept-encoding") || kl.startsWith("if-") || kl.equals("connection")) continue;
                con.setRequestProperty(k, h.getValue());
            }
            int code = con.getResponseCode();
            if (code < 200 || code >= 400) { con.disconnect(); return null; }
            String type = con.getContentType();
            String mime = "application/octet-stream", enc = null;
            if (type != null) {
                String[] parts = type.split(";");
                mime = parts[0].trim();
                for (String p : parts) { p = p.trim(); if (p.toLowerCase().startsWith("charset=")) enc = p.substring(8).replace("\"", ""); }
            }
            Map<String, String> headers = new HashMap<>();
            for (Map.Entry<String, List<String>> h : con.getHeaderFields().entrySet()) {
                String k = h.getKey();
                if (k == null || h.getValue() == null || h.getValue().isEmpty()) continue;
                String kl = k.toLowerCase();
                if (kl.equals("content-encoding") || kl.equals("content-length") || kl.equals("transfer-encoding")
                        || kl.equals("connection") || kl.equals("set-cookie")) continue;
                headers.put(k, h.getValue().get(0));
            }
            String reason = con.getResponseMessage();
            if (reason == null || reason.isEmpty()) reason = code == 206 ? "Partial Content" : "OK";
            return new WebResourceResponse(mime, enc, code, reason, headers, con.getInputStream());
        } catch (Exception e) {
            if (con != null) con.disconnect();
            return null;
        }
    }

    private static WebResourceResponse json(int code, String body) {
        Map<String, String> h = new HashMap<>();
        h.put("Cache-Control", "no-store");
        return new WebResourceResponse("application/json", "utf-8", code, "Service Unavailable", h,
                new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8)));
    }
}
