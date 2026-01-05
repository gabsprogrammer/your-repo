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

whatsappClient.on('message', async (msg) => {
  // Ignorar mensagens do próprio bot
  if (msg.fromMe) return;

  const corretorNumero = "5581997012344@c.us";

  // Se for resposta do cliente, encaminhar para o corretor
  if (msg.body.trim() === "1" || msg.body.toLowerCase().includes("falar") || msg.body.toLowerCase().includes("corretor")) {
    await whatsappClient.sendMessage(corretorNumero, `Cliente ${msg._data.notifyName || 'Anônimo'} solicitou contato direto:\nNúmero: ${msg.from.replace('@c.us', '')}`);
    await msg.reply("Perfeito! O corretor entrará em contato em breve. 📞");
  } else if (msg.body.trim() === "2" || msg.body.toLowerCase().includes("corrigir")) {
    await msg.reply("Envie as informações corrigidas e nosso corretor será notificado. ✏️");
  } else {
    // Encaminhar mensagem para o corretor
    await whatsappClient.sendMessage(corretorNumero, `Mensagem do cliente ${msg._data.notifyName || 'Anônimo'} (${msg.from.replace('@c.us', '')}):\n\n${msg.body}`);
    await msg.reply("Mensagem encaminhada para o corretor! Ele responderá em breve. ✅");
  }
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

  // API Endpoint para consultar placa
  app.get("/api/consultar-placa/:placa", async (req, res) => {
    try {
      const { placa } = req.params;
      // Usando a API fornecida pelo usuário
      const apiUrl = `https://wdapi2.com.br/consulta/${placa}/7e3a242a95267f9dd6ad791e417ffb36`;
      
      console.log(`Consultando placa: ${placa}`);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      res.json(data);
    } catch (error) {
      console.error("Erro ao consultar placa:", error);
      res.status(500).json({ error: "Erro ao consultar serviço de placa" });
    }
  });

  // API Endpoint para enviar cotação
  app.post("/api/enviar-cotacao", async (req, res) => {
    try {
      const { nome, telefone, tipoSeguro, email, veiculo, motorista } = req.body;

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

      if (tipoSeguro === 'automovel' && veiculo && motorista) {
        mensagem += `Fique tranquilo(a)! Nossos especialistas já estão analisando as melhores opções para seu veículo entre nossas 14 seguradoras parceiras.\n\n` +
          `Em breve entraremos em contato para apresentar as propostas personalizadas.\n\n` +
          `*Resumo do pedido:*\n` +
          `📋 Tipo: Seguro Automóvel\n` +
          `🚗 Tipo de veículo: ${veiculo.tipo}\n` +
          `📅 Ano: ${veiculo.anoModelo}\n` +
          `🏷️ Marca: ${veiculo.marca}\n` +
          `🚙 Modelo: ${veiculo.modelo}\n` +
          `🔢 Zero km: ${veiculo.zeroKm ? 'Sim' : 'Não'}\n` +
          `📋 Placa: ${veiculo.placa || 'Não informada'}\n` +
          `💼 Tipo de uso: ${veiculo.usoComercial ? 'Comercial' : 'Particular'}\n` +
          `⛽ Kit gás: ${veiculo.kitGas ? 'Sim' : 'Não'}\n` +
          `🏠 Local de pernoite: ${motorista.cepPernoite}\n` +
          `📍 Endereço: ${motorista.enderecoResumido}\n` +
          `👤 Motorista 18-25: ${motorista.motoristaJovem ? 'Sim' : 'Não'}\n` +
          `📜 Já tem seguro: ${motorista.veiculoJaSegurado ? 'Sim' : 'Não'}\n` +
          `🎂 Data nascimento: ${motorista.dataNascimento}\n` +
          `👨‍🚗 Principal motorista: ${motorista.ehPrincipalCondutor ? 'Próprio Segurado' : 'Outra Pessoa'}\n` +
          `${!motorista.ehPrincipalCondutor ? `👤 Nome Condutor: ${motorista.nomePrincipalCondutor}\n🎂 Nasc. Condutor: ${motorista.nascPrincipalCondutor}\n` : ''}` +
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

      // Enviar para o corretor
      const corretorNumero = "5581997012344@c.us"; // 81997012344 com 55
      await whatsappClient.sendMessage(corretorNumero, `Nova cotação recebida:\n\n${mensagem.replace(`Olá *${nome}*!`, `Cliente: ${nome}`)}`);

      console.log(`Mensagem enviada para ${nome} (${chatId}) e corretor`);

      // Aguardar 5 segundos e enviar mensagem de acompanhamento
      setTimeout(async () => {
        const followupMessage = `Olá ${nome}! 😊\n\n` +
          `Sua solicitação de cotação foi recebida com sucesso!\n\n` +
          `Escolha uma opção:\n` +
          `1️⃣ *Falar diretamente com o corretor* - Converse agora mesmo\n` +
          `2️⃣ *Corrigir alguma informação* - Envie os dados corrigidos\n\n` +
          `Responda com o número da opção ou envie sua mensagem.`;

        await whatsappClient.sendMessage(chatId, followupMessage);
        console.log(`Mensagem de acompanhamento enviada para ${nome}`);
      }, 5000);

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
