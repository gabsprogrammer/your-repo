import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialização do Cliente WhatsApp
const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, "..", ".wwebjs_auth")
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  }
});

let isWhatsappReady = false;

whatsappClient.on('qr', (qr: string) => {
  console.log('\n================================================================');
  console.log('QR CODE GERADO! ESCANEIE COM SEU WHATSAPP:');
  console.log('================================================================\n');
  qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
  console.log('\n================================================================');
  console.log('WHATSAPP CONECTADO COM SUCESSO!');
  console.log('================================================================\n');
  isWhatsappReady = true;
});

whatsappClient.on('authenticated', () => {
  console.log('WhatsApp autenticado!');
});

whatsappClient.on('auth_failure', (msg: any) => {
  console.error('Falha na autenticação do WhatsApp:', msg);
});

whatsappClient.initialize();

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware para processar JSON
  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API Endpoint para enviar cotação
  app.post("/api/enviar-cotacao", async (req, res) => {
    try {
      const { nome, telefone, tipoSeguro, email } = req.body;

      if (!isWhatsappReady) {
        return res.status(503).json({ 
          success: false, 
          message: "Servidor de WhatsApp ainda não está pronto. Tente novamente em instantes." 
        });
      }

      // Formatar número de telefone (remover caracteres não numéricos)
      // Assumindo formato brasileiro (55 + DDD + Numero)
      let numeroLimpo = telefone.replace(/\D/g, "");
      
      // Adicionar 55 se não tiver
      if (numeroLimpo.length <= 11) {
        numeroLimpo = "55" + numeroLimpo;
      }

      // Verificar se o número está registrado no WhatsApp
      const numberId = await whatsappClient.getNumberId(numeroLimpo);
      if (!numberId) {
        console.error(`Número ${numeroLimpo} não está registrado no WhatsApp`);
        return res.status(400).json({
          success: false,
          message: "Número de telefone não encontrado no WhatsApp. Verifique se o número está correto e possui WhatsApp ativo."
        });
      }

      // Usar o ID correto do WhatsApp
      const chatId = numberId._serialized;

      let mensagem = `Olá *${nome}*! 👋\n\n` +
        `Recebemos sua solicitação de cotação para *Seguro ${tipoSeguro === 'automovel' ? 'Automóvel' : tipoSeguro}* na Madureira Seguros.\n\n`;

      if (tipoSeguro === 'automovel') {
        mensagem += `Fique tranquilo(a)! Nossos especialistas já estão analisando as melhores opções para seu veículo entre nossas 14 seguradoras parceiras.\n\n` +
          `Em breve entraremos em contato para apresentar as propostas personalizadas.\n\n` +
          `*Resumo do pedido:*\n` +
          `📋 Tipo: Seguro Automóvel\n` +
          `🚗 Tipo de veículo: ${req.body.tipoVeiculo}\n` +
          `📅 Ano: ${req.body.anoVeiculo}\n` +
          `🏷️ Marca: ${req.body.marcaVeiculo}\n` +
          `🚙 Modelo: ${req.body.modeloVeiculo}\n` +
          `🔢 Zero km: ${req.body.zeroKm ? 'Sim' : 'Não'}\n` +
          `📋 Placa: ${req.body.placa || 'Não informada'}\n` +
          `💼 Uso comercial: ${req.body.usoComercial ? 'Sim' : 'Não'}\n` +
          `🛡️ Blindagem: ${req.body.blindagem ? 'Sim' : 'Não'}\n` +
          `⛽ Kit gás: ${req.body.kitGas ? 'Sim' : 'Não'}\n` +
          `💰 Benefício fiscal: ${req.body.beneficioFiscal ? 'Sim' : 'Não'}\n` +
          `🏠 Local de pernoite: ${req.body.cep}\n` +
          `👤 Motorista 18-25: ${req.body.motorista1825 ? 'Sim' : 'Não'}\n` +
          `📜 Já tem seguro: ${req.body.jaTemSeguro ? 'Sim' : 'Não'}\n` +
          `🎂 Data nascimento: ${req.body.dataNascimento}\n` +
          `👨‍🚗 Principal motorista: ${req.body.principalMotorista ? 'Sim' : 'Não'}\n` +
          `${req.body.principalMotorista ? `👤 Nome motorista: ${req.body.nomeMotorista}\n🎂 Data nascimento motorista: ${req.body.dataNascimentoMotorista}\n` : ''}` +
          `📧 Email: ${email}\n\n`;
      } else {
        mensagem += `Fique tranquilo(a)! Uma pessoa especializada entrará em contato em breve para prosseguir com sua cotação.\n\n` +
          `*Resumo do pedido:*\n` +
          `📋 Tipo: ${tipoSeguro}\n` +
          `📧 Email: ${email}\n\n`;
      }

      mensagem += `Atenciosamente,\n` +
        `*Equipe Madureira Seguros* 🛡️`;

      await whatsappClient.sendMessage(chatId, mensagem);

      console.log(`Mensagem enviada para ${nome} (${chatId})`);

      res.json({ success: true, message: "Cotação recebida e mensagem enviada!" });

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      res.status(500).json({ success: false, message: "Erro interno ao processar cotação." });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Porta 3001 para o backend (API + Bot), o frontend roda na 3000
  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`\n🚀 SERVIDOR BACKEND RODANDO NA PORTA ${port}`);
    console.log(`👉 Aguardando inicialização do WhatsApp...`);
  });
}

startServer().catch(console.error);
