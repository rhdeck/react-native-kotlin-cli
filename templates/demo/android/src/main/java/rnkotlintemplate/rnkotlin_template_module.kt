package com.rnkotlin_template
import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
class rnkotlin_template(internal var reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    //@ReactClassName=rnkotlin_template
    val _name: String = "rnkotlin_template"
    override fun getName(): String { return _name }
    @ReactMethod
    fun test(s: String, p: Promise)  {
        val m = Arguments.createMap();
        m.putString("message", s + " and such")
        p.resolve(m)
    }
}
