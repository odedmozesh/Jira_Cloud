AP.context.getContext(async function (context) {
  console.log("🔍 AP context:", context);
  alert("🔍 AP context: " + JSON.stringify(context, null, 2));


  const issueKey = context?.jira?.issue?.key;

  if (!issueKey) {
    document.getElementById("error").textContent = "❌ Issue key not found.";
    return;
  }

  document.getElementById("issueKey").textContent = issueKey;

  try {
    const response = await fetch("/rest/api/3/issue/" + issueKey + "?fields=summary,issuelinks");
    if (!response.ok) throw new Error("Failed to fetch issue: " + response.status);
    
    const issue = await response.json();

    document.getElementById("summary").textContent = issue.fields.summary;

    const list = document.getElementById("linkedIssues");
    (issue.fields.issuelinks || []).forEach(link => {
      const linked = link.inwardIssue || link.outwardIssue;
      if (linked) {
        const li = document.createElement("li");
        li.textContent = `${link.type.name}: ${linked.key}`;
        list.appendChild(li);
      }
    });

    document.getElementById("sendEmailBtn").onclick = async () => {
      const webhookUrl = "https://api.atlassian.com/automation/webhooks/jira/your-cloud-id/webhook-id";
      const webhookSecret = "your-secret";

      const payload = {
        secret: webhookSecret,
        issue: { key: issueKey, summary: issue.fields.summary }
      };

      console.log("📦 Payload:", payload);
      alert("🔍 AP context: " + JSON.stringify(payload, null, 2));

      
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        document.getElementById("msg").textContent = "✅ Email sent.";
        document.getElementById("error").textContent = "";
      } else {
        document.getElementById("error").textContent = "❌ Failed to send: " + res.status;
        document.getElementById("msg").textContent = "";
      }
    };
  } catch (e) {
    console.error("❌ Error fetching issue:", e);
    document.getElementById("error").textContent = `❌ ${e}`;
  }
});
