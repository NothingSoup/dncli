package com.dnmaze.dncli.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import javax.script.Compilable;
import javax.script.CompiledScript;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 * Created by blei on 6/19/16.
 */
public class JsUtil {
  private static final ScriptEngineManager scriptEngineManager = new ScriptEngineManager();
  private static final ScriptEngine scriptEngine = scriptEngineManager.getEngineByName("nashorn");

  /**
   * <p>A helper method to compile a javascript file and return
   * an engine that is common.</p>
   *
   * @param script the javascript file
   * @return the script engine
   * @throws FileNotFoundException if file was not found
   * @throws ScriptException       if cannot eval the javascript file
   */
  public static Invocable compileAndEval(File script)
      throws ScriptException, FileNotFoundException {

    FileInputStream fis = new FileInputStream(script);
    InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
    CompiledScript compiledScript = ((Compilable) scriptEngine).compile(isr);

    compiledScript.eval();

    return (Invocable) compiledScript.getEngine();
  }
}
