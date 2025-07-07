(function testScriptRunnerPanel() {
  document.body.innerHTML += `<p style="color:blue;">✅ ScriptRunner JS loaded</p>`;
  console.log("✅ ScriptRunner fragment JS is running");

  // Wait for AP
  if (typeof AP === 'undefined') {
    document.body.innerHTML += `<p style="color:red;">❌ AP is not defined</p>`;
    console.log("❌ AP is not defined");
  } else {
    document.body.innerHTML += `<p style="color:green;">✅ AP is defined</p>`;
    console.log("✅ AP is defined:", AP);
  }
})();
