export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    const { awbno } = req.query;
    const apiKey = process.env.CM_API_KEY;
  
    if (!awbno) {
      return res.status(400).json({ error: "Missing 'awbno'" });
    }
  
    try {
      const url = `https://faneudev.couriermanager.eu/faneudev/API/print?pdf=true&format=A6&awbno=${awbno}`;
      const pdfRes = await fetch(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });
  
      if (!pdfRes.ok) {
        return res.status(pdfRes.status).json({ error: 'Failed to fetch PDF' });
      }
  
      const pdfBlob = await pdfRes.blob();
      const buffer = await pdfBlob.arrayBuffer();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="label.pdf"');
      res.status(200).send(Buffer.from(buffer));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  