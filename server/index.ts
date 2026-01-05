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

// CONFIGURAÇÕES
const PORT = process.env.PORT || 3002;
const CORRETORES = ["5581997012344", "5581988263143"]; // Apenas números, sem @c.us
const API_PLACA_TOKEN = "7e3a242a95267f9dd6ad791e417ffb36"; // Idealmente, mova para .env

// Tratamento de erros globais para evitar crash do servidor
process.on('uncaughtException', (err) => {
  console.error('ERRO CRÍTICO NÃO TRATADO:', err);
  // Não saia do processo, apenas logue para manter o servidor online
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('PROMISE REJEITADA NÃO TRATADA:', reason);
});

// Inicialização do Cliente WhatsApp com configurações de estabilidade
const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, "..", ".wwebjs_auth")
  }),
  // Cache da versão para evitar loops de atualização
  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
  puppeteer: {
    executablePath: process.env.CHROME_BIN || undefined, // Útil para deploy em Linux
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // CRÍTICO: Evita falta de memória em servidores Linux/Docker
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    headless: true
  }
});

let isWhatsappReady = false;
let whatsappRetryCount = 0;
const MAX_RETRIES = 5;
let qrShown = false;

// Função auxiliar para espera (delay)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Função auxiliar para formatar e validar IDs
async function getWhatsappId(numero: string) {
  try {
    const numeroLimpo = numero.replace(/\D/g, "");
    const finalNumber = numeroLimpo.length <= 11 ? `55${numeroLimpo}` : numeroLimpo;
    const id = await whatsappClient.getNumberId(finalNumber);
    return id ? id._serialized : `${finalNumber}@c.us`; // Fallback se não conseguir validar
  } catch (error) {
    console.error(`Erro ao validar número ${numero}:`, error);
    return `${numero.replace(/\D/g, "")}@c.us`;
  }
}

whatsappClient.on('qr', (qr: string) => {
  if (!qrShown) {
    console.log('\n================================================================');
    console.log('QR CODE GERADO! ESCANEIE COM SEU WHATSAPP:');
    console.log('================================================================\n');
    qrcode.generate(qr, { small: true });
    qrShown = true;
  } else {
    console.log("Novo QR Code gerado (sessão anterior expirou).");
  }
});

whatsappClient.on('ready', () => {
  console.log('\n================================================================');
  console.log('WHATSAPP CONECTADO E PRONTO!');
  console.log('================================================================\n');
  isWhatsappReady = true;
  whatsappRetryCount = 0;
  qrShown = false;
});

whatsappClient.on('authenticated', () => {
  console.log('WhatsApp autenticado com sucesso!');
});

whatsappClient.on('disconnected', async (reason: string) => {
  console.log('WhatsApp desconectado:', reason);
  isWhatsappReady = false;
  
  // Lógica de reconexão mais robusta
  if (whatsappRetryCount < MAX_RETRIES) {
    whatsappRetryCount++;
    console.log(`Tentando reconectar... (${whatsappRetryCount}/${MAX_RETRIES}) em 10 segundos...`);
    await sleep(10000);
    try {
      whatsappClient.initialize();
    } catch (err) {
      console.error("Erro fatal ao tentar reinicializar:", err);
    }
  } else {
    console.error('Máximo de tentativas de reconexão atingido. Reinicie o processo manualmente.');
  }
});

whatsappClient.on('message', async (msg: any) => {
  if (msg.fromMe) return;

  try {
    const body = msg.body.trim().toLowerCase();
    const isResponseToQuote = msg.hasQuotedMsg; // Pode ser útil no futuro

    if (body === "1" || body.includes("falar") || body.includes("corretor") || 
        body === "2" || body.includes("corrigir")) {
      
      const isCorrection = body === "2" || body.includes("corrigir");
      const clientName = msg._data.notifyName || 'Cliente Anônimo';
      const clientPhone = msg.from.replace('@c.us', '');
      
      const brokerMsg = isCorrection 
        ? `📝 *Solicitação de Correção*\nCliente: ${clientName}\nTel: ${clientPhone}\n\nO cliente deseja corrigir informações da cotação.`
        : `📞 *Solicitação de Contato*\nCliente: ${clientName}\nTel: ${clientPhone}\n\nO cliente deseja falar diretamente com um corretor.`;

      // Envia para TODOS os corretores com delay para evitar bloqueio
      console.log(`Encaminhando solicitação de ${clientName} para corretores...`);
      
      for (const numero of CORRETORES) {
        try {
          const brokerId = await getWhatsappId(numero);
          await whatsappClient.sendMessage(brokerId, brokerMsg);
          await sleep(1000); // Delay de 1 segundo entre envios
        } catch (error) {
          console.error(`Erro ao enviar para corretor ${numero}:`, error);
        }
      }

      await msg.reply(isCorrection 
        ? "Entendido! Envie as informações corretas abaixo e nosso corretor atualizará sua proposta. ✏️"
        : "Perfeito! Já notifiquei nosso corretor. Ele entrará em contato com você em breve. 📞");

    } else {
      // Mensagem genérica - encaminhar conversas
      // Opcional: só encaminhar se o cliente já estiver em um "fluxo" de atendimento
      for (const numero of CORRETORES) {
        try {
          const brokerId = await getWhatsappId(numero);
          await whatsappClient.sendMessage(brokerId, `💬 Mensagem de ${msg._data.notifyName || 'Anônimo'} (${msg.from.replace('@c.us', '')}):\n\n"${msg.body}"`);
          await sleep(500);
        } catch (error) {
          console.error(`Erro ao repassar msg para ${numero}:`, error);
        }
      }
      
      // Auto-reply simples para confirmar recebimento
      // await msg.react('✅'); 
    }
  } catch (err) {
    console.error("Erro no processamento de mensagem recebida:", err);
  }
});

async function startServer() {
  const app = express();

  const server = createServer({
    headersTimeout: 65000, // Maior que o padrão
    keepAliveTimeout: 61000, // Maior que o do Nginx/LoadBalancer padrão
  }, app);

  app.use(express.json({ limit: '10mb' }));

  const staticPath = process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // --- API: Consultar Placa ---
  app.get("/api/consultar-placa/:placa", async (req, res) => {
    try {
      const { placa } = req.params;
      const apiUrl = `https://wdapi2.com.br/consulta/${placa}/${API_PLACA_TOKEN}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Erro ao consultar placa:", error);
      if (error.name === 'AbortError') {
        res.status(504).json({ error: "Tempo limite excedido ao consultar serviço de placa" });
      } else {
        res.status(500).json({ error: "Erro ao consultar serviço de placa" });
      }
    }
  });

  // --- API: Enviar Cotação ---
  app.post("/api/enviar-cotacao", async (req, res) => {
    try {
      const { nome, telefone, tipoSeguro, email, veiculo, motorista } = req.body;

      if (!isWhatsappReady) {
        return res.status(503).json({
          success: false,
          message: "Sistema de WhatsApp reiniciando ou indisponível. Tente em 1 minuto."
        });
      }

      // Validação e formatação do telefone do cliente
      let numberId;
      try {
        const numeroLimpo = telefone.replace(/\D/g, "");
        const numeroFormatado = numeroLimpo.length <= 11 ? "55" + numeroLimpo : numeroLimpo;
        numberId = await whatsappClient.getNumberId(numeroFormatado);
      } catch (e) {
        console.error("Erro ao validar número do cliente:", e);
      }

      if (!numberId) {
        return res.status(400).json({
          success: false,
          message: "Este número não possui WhatsApp válido. Verifique o número digitado."
        });
      }

      const chatId = numberId._serialized;

      // Construção da Mensagem COMPLETA (Restaurada)
      let mensagem = `Olá *${nome}*! 👋\n\n` +
        `Recebemos sua solicitação de cotação para *Seguro ${tipoSeguro === 'automovel' ? 'Automóvel' : tipoSeguro}* na Madureira Seguros.\n\n`;

      if (tipoSeguro === 'automovel' && veiculo && motorista) {
        mensagem += `Fique tranquilo(a)! Nossos especialistas já estão analisando as melhores opções para seu veículo entre nossas 14 seguradoras parceiras.\n\n` +
          `Em breve entraremos em contato para apresentar as propostas personalizadas.\n\n` +
          `*Detalhes do pedido:*\n` +
          `📋 Tipo: Seguro Automóvel\n` +
          `🚗 Veículo: ${veiculo.modelo}\n` +
          `🏷️ Marca: ${veiculo.marca}\n` +
          `📅 Ano: ${veiculo.anoModelo}\n` +
          `📋 Placa: ${veiculo.placa || 'Não informada'}\n` +
          `🔢 Zero Km: ${veiculo.zeroKm ? 'Sim' : 'Não'}\n` +
          `💼 Uso: ${veiculo.usoComercial ? 'Comercial' : 'Particular'}\n` +
          `⛽ Kit Gás: ${veiculo.kitGas ? 'Sim' : 'Não'}\n` +
          `🏠 CEP Pernoite: ${motorista.cepPernoite}\n` +
          `📍 Endereço: ${motorista.enderecoResumido || 'N/A'}\n` +
          `👤 Motorista 18-25: ${motorista.motoristaJovem ? 'Sim' : 'Não'}\n` +
          `📜 Renovação/Já tem seguro: ${motorista.veiculoJaSegurado ? 'Sim' : 'Não'}\n` +
          `🎂 Data Nasc. Segurado: ${motorista.dataNascimento}\n` +
          `👨‍🚗 Principal Condutor: ${motorista.ehPrincipalCondutor ? 'Próprio Segurado' : 'Outra Pessoa'}\n` +
          `${!motorista.ehPrincipalCondutor ? `👤 Nome Condutor: ${motorista.nomePrincipalCondutor}\n🎂 Nasc. Condutor: ${motorista.nascPrincipalCondutor}\n` : ''}` +
          `📧 Email: ${email}\n\n`;
      } else {
        mensagem += `Fique tranquilo(a)! Uma pessoa especializada entrará em contato em breve para prosseguir com sua cotação.\n\n` +
          `*Resumo do pedido:*\n` +
          `📋 Tipo: ${tipoSeguro}\n` +
          `📧 Email: ${email}\n\n`;
      }

      mensagem += `Atenciosamente,\n*Equipe Madureira Seguros* 🛡️`;

      // 1. Enviar para o Cliente
      try {
        await whatsappClient.sendMessage(chatId, mensagem);
      } catch (err) {
        console.error(`Falha ao enviar msg para cliente ${nome}:`, err);
        // Não retorna erro para o frontend, pois queremos tentar avisar os corretores
      }

      // 2. Enviar para os Corretores (Com retry e validação)
      const msgCorretor = `🚨 *NOVA COTAÇÃO RECEBIDA*\n\nCliente: ${nome}\nWhats: https://wa.me/${chatId.replace('@c.us', '')}\n\n${mensagem}`;
      
      // Processar envio para corretores em background (não bloqueia a resposta HTTP)
      (async () => {
        for (const numero of CORRETORES) {
          try {
            const brokerId = await getWhatsappId(numero);
            await whatsappClient.sendMessage(brokerId, msgCorretor);
            await sleep(1500); // Delay entre corretores
          } catch (err) {
            console.error(`Falha crítica ao notificar corretor ${numero}:`, err);
          }
        }
      })();

      // 3. Agendar Follow-up para o Cliente
      setTimeout(async () => {
        try {
          const followup = `O que deseja fazer agora?\n\n1️⃣ *Falar com corretor*\n2️⃣ *Corrigir dados*\n\nResponda com o número.`;
          await whatsappClient.sendMessage(chatId, followup);
        } catch (e) { /* ignorar erro no follow-up */ }
      }, 6000);

      res.json({ success: true, message: "Solicitação enviada com sucesso!" });

    } catch (error) {
      console.error("Erro interno no endpoint de cotação:", error);
      res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
  });

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  server.listen(PORT, () => {
    console.log(`\n🚀 SERVIDOR ONLINE NA PORTA ${PORT}`);
  });
}

(async () => {
  try {
    console.log('Iniciando sistema...');
    await startServer();
    console.log('Inicializando cliente WhatsApp...');
    whatsappClient.initialize();
  } catch (error) {
    console.error('Erro fatal na inicialização:', error);
  }
})();