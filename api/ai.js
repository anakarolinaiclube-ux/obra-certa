import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { superficie, material, altura, largura } = req.body;
  const area = (parseFloat(altura) * parseFloat(largura)).toFixed(2);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um mestre de obras experiente. Calcule materiais, mão de obra e custos estimados para o Brasil. Retorne APENAS um HTML formatado de forma limpa, sem tags markdown ou blocos de código."
        },
        {
          role: "user",
          content: `Gere um orçamento para: 
          Superfície: ${superficie}
          Material: ${material}
          Área Total: ${area} m² (${altura}m x ${largura}m).
          Inclua:
          1. Quantidade de material principal (com 10% de perda).
          2. Materiais necessários (argamassa, rejunte, etc).
          3. Estimativa de tempo.
          4. Custo médio de mão de obra (R$).
          5. Custo total estimado.
          Use tags HTML como <h4>, <p> e <b>.`
        }
      ],
    });

    const result = completion.choices[0].message.content;
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}