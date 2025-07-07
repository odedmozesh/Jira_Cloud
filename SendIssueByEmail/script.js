AP.dialog.getCustomData(async function (data) {
    const issueKey = data.issueKey;
    const webhookUrl = "https://api.atlassian.com/automation/webhooks/jira/your-cloud-id/webhook-id";
    const webhookSecret = "your-secret";
  
    try {
      const response = await fetch("/rest/api/3/issue/" + issueKey + "?fields=summary,issuelinks");
      const issue = await response.json();
  
      document.getElementById("issueKey").textContent = issueKey;
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
        const payload = {
          secret: webhookSecret,
          issue: { key: issueKey, summary: issue.fields.summary }
        };
  
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
  
        if (res.ok) {
          document.getElementById("msg").textContent = "✅ Email sent.";
        } else {
          document.getElementById("error").textContent = "❌ Failed to send: " + res.status;
        }
      };
    } catch (e) {
      document.getElementById("error").textContent = `❌ ${e}`;
    }
  });
  