<h1>🐙 Quizzy — AI-Powered Quiz Generator</h1>

<p><strong>Cloudflare Workers • Workers AI • React • Zero APIs • Zero Secrets</strong></p>

<p>
  Quizzy is a playful, fully serverless AI quiz generator that creates a
  <strong>5-question multiple-choice quiz</strong> on any topic you enter
  (e.g., computers, history, oceans). It runs entirely on
  <strong>Cloudflare Workers + Workers AI</strong> — no API keys required, no backend servers, no secrets.
</p>

<hr />

<h2>🚀 Features</h2>
<ul>
  <li>✅ AI-generated quizzes (always 5 MCQs)</li>
  <li>✅ Cloudflare Workers AI — free, serverless inference</li>
  <li>✅ Bulletproof JSON extraction from LLM output</li>
  <li>✅ React UI with scoring, state, and validation</li>
  <li>✅ Zero server hosting, zero key management</li>
  <li>✅ Safe to upload to GitHub (no secrets included)</li>
</ul>

<hr />

<h2>📂 Project Structure</h2>

<pre><code>root/
├── public/               # Static assets
├── src/
│   ├── app.tsx           # React quiz UI
│   ├── styles.css        # App styling
│   ├── server.ts         # Cloudflare Worker backend
│   └── ...               # Providers, hooks, utils
├── wrangler.jsonc        # Cloudflare Worker config + AI binding
└── package.json
</code></pre>

<hr />

<h2>🔧 Running Locally</h2>

<ol>
  <li>
    <p><strong>Install dependencies</strong></p>
    <pre><code>npm install
</code></pre>
  </li>
  <li>
    <p><strong>Start Cloudflare Worker + React UI</strong></p>
    <pre><code>npm run start
</code></pre>
  </li>
  <li>
    <p><strong>Open the app</strong></p>
    <pre><code>http://localhost:5173
</code></pre>
  </li>
</ol>

<hr />

<h2>🌐 Deployment (Cloudflare Workers)</h2>

<p><strong>Deploy with one command:</strong></p>

<pre><code>npx wrangler deploy
</code></pre>

<p>
  Workers AI runs automatically via the AI binding —
  <strong>no secrets or extra config needed.</strong>
</p>

<hr />

<h2>📡 API Endpoint</h2>

<p><code>POST /api/makeQuiz</code></p>

<p>Generates a 5-question quiz.</p>

<p><strong>Request</strong></p>
<pre><code>{
  "topic": "trees"
}
</code></pre>

<p><strong>Response</strong></p>
<pre><code>{
  "questions": [
    {
      "question": "What is the primary function of roots in a tree?",
      "options": ["A", "B", "C", "D"],
      "correct": "A"
    }
  ]
}
</code></pre>

<h2>🎨 UI Preview</h2>

<p align="center">
  <img
    width="700"
    src="https://github.com/user-attachments/assets/adbb8834-1909-4d47-a477-876556ee00e4"
    alt="Quizzy screenshot 1"
  />
</p>
<p align="center">
  <img
    width="700"
    src="https://github.com/user-attachments/assets/8dd20dce-426c-43ba-9dfb-6eb11719061f"
    alt="Quizzy screenshot 2"
  />
</p>

<hr />

<h2>📄 License</h2>

<p>MIT License.</p>

<hr />

<h2>👩‍💻 Author</h2>

<p><strong>Anagha Shyama Prakash</strong><br />MSCS @ University of Southern California</p>
