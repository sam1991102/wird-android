package dev.pages.wird_azkar.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WirdAdhanPlugin.class);
        super.onCreate(savedInstanceState);
        AdhanStore.ensureChannels(this);
        AdhanStore.armAll(this);
    }
}
