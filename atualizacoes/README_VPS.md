# Guia de Instalação - Madureira Seguros (Site + Bot WhatsApp)

Este guia explica como colocar o site e o bot de WhatsApp para rodar no seu servidor VPS Ubuntu.

## Pré-requisitos
- Servidor VPS com Ubuntu (20.04 ou superior)
- Node.js instalado (versão 18 ou superior)
- Acesso ao terminal do servidor

## Passo a Passo

### 1. Preparar o Projeto
1. Envie a pasta do projeto para o seu servidor (ou clone se estiver no git).
2. Entre na pasta do projeto:
   ```bash
   cd madureira_seguros
   ```

### 2. Instalar Dependências
Instale todas as bibliotecas necessárias:
```bash
npm install
```
*(Se você usar pnpm, pode rodar `pnpm install`)*

### 3. Construir o Site (Build)
Gere a versão otimizada do site para produção:
```bash
npm run build
```
Isso criará uma pasta `dist` com todos os arquivos prontos.

### 4. Instalar Gerenciador de Processos (PM2)
Para manter o site e o bot rodando 24h (mesmo se você fechar o terminal), usaremos o PM2:
```bash
npm install -g pm2
```

### 5. Iniciar o Servidor (IMPORTANTE: Modo Interativo Primeiro)
**ATENÇÃO:** Na primeira vez, precisamos rodar o servidor manualmente para escanear o QR Code.

1. Rode o comando abaixo e **fique de olho no terminal**:
   ```bash
   npm start
   ```
2. Aguarde alguns segundos. Um **QR Code gigante** aparecerá no terminal.
3. Abra o WhatsApp no seu celular > Aparelhos Conectados > Conectar um aparelho.
4. Escaneie o QR Code.
5. Quando aparecer "WHATSAPP CONECTADO COM SUCESSO!", pressione `Ctrl + C` para parar o servidor manual.

### 6. Iniciar em Modo Definitivo (24h)
Agora que o WhatsApp já salvou a sessão, vamos ligar o servidor para rodar para sempre:

```bash
pm2 start npm --name "madureira-app" -- start
```

### 7. Comandos Úteis
- **Ver status:** `pm2 status`
- **Reiniciar:** `pm2 restart madureira-app`
- **Parar:** `pm2 stop madureira-app`
- **Ver logs:** `pm2 logs madureira-app`

## Testando
Acesse o IP do seu servidor ou domínio na porta 3001 (ex: `http://seu-ip:3001`).
Faça uma cotação teste e verifique se a mensagem chega no WhatsApp informado!

---
**Nota:** Certifique-se de que a porta 3001 está liberada no firewall do seu VPS.
Se usar ufw: `sudo ufw allow 3001`
