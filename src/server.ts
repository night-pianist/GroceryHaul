import http, { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenerativeAI } from '@google/generative-ai';

const port = 3001;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { message, apiKey } = JSON.parse(body);

      // Initialize GoogleGenerativeAI with apiKey
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const generationConfig = {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };
      
      let chatSession = model.startChat({ generationConfig });

      const result = await chatSession.sendMessage(message);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response: result.response.text() }));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
