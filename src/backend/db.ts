import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const db = new Database("database.sqlite");

export function initDb() {
  // Companies
  db.exec(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cnpj TEXT UNIQUE NOT NULL,
      plano TEXT DEFAULT 'basic',
      status TEXT DEFAULT 'ativo',
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users (Admin/Attendants)
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL, -- 'admin', 'consultor'
      status TEXT DEFAULT 'online',
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);

  // Clients
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      consultor_id INTEGER,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      telefone TEXT,
      whatsapp_numero TEXT,
      whatsapp_notificacoes_ativas INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ativo',
      FOREIGN KEY (empresa_id) REFERENCES empresas(id),
      FOREIGN KEY (consultor_id) REFERENCES usuarios(id)
    )
  `);

  // Migrations
  try {
    db.prepare("ALTER TABLE usuarios ADD COLUMN status TEXT DEFAULT 'online'").run();
  } catch (e) {
    // Column already exists
  }
  
  try {
    db.prepare("ALTER TABLE clientes ADD COLUMN consultor_id INTEGER").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE clientes ADD COLUMN whatsapp_numero TEXT").run();
    db.prepare("ALTER TABLE clientes ADD COLUMN whatsapp_notificacoes_ativas INTEGER DEFAULT 0").run();
  } catch (e) {}

  // Categories
  db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);

  // Priorities
  db.exec(`
    CREATE TABLE IF NOT EXISTS prioridades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      tempo_sla INTEGER NOT NULL, -- in hours
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);

  // Protocols
  db.exec(`
    CREATE TABLE IF NOT EXISTS protocolos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      categoria_id INTEGER,
      prioridade_id INTEGER,
      status TEXT DEFAULT 'aberto', -- 'aberto', 'em atendimento', 'aguardando cliente', 'concluido'
      responsavel_id INTEGER,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_fechamento DATETIME,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
    )
  `);

  // Interactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS interacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      protocolo_id INTEGER NOT NULL,
      autor_id INTEGER NOT NULL,
      autor_tipo TEXT NOT NULL, -- 'admin', 'cliente'
      mensagem TEXT NOT NULL,
      anexo_url TEXT,
      visivel_cliente INTEGER DEFAULT 1,
      data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (protocolo_id) REFERENCES protocolos(id)
    )
  `);

  // Channels (Canais)
  db.exec(`
    CREATE TABLE IF NOT EXISTS canais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      nome TEXT NOT NULL, -- 'Mercado Livre', 'Amazon', 'Shopee'
      status TEXT DEFAULT 'ativo', -- 'ativo', 'inativo', 'pendente'
      status_cor TEXT DEFAULT 'verde', -- 'verde', 'amarelo', 'vermelho'
      estoque_tipo TEXT DEFAULT 'Full', -- 'Fulfillment', 'FBA', 'Full'
      estoque_cor TEXT DEFAULT 'verde', -- 'verde', 'amarelo', 'vermelho'
      data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
  `);

  // Evolution History
  db.exec(`
    CREATE TABLE IF NOT EXISTS cliente_evolucao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      consultor_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (consultor_id) REFERENCES usuarios(id)
    )
  `);

  // Insights
  db.exec(`
    CREATE TABLE IF NOT EXISTS insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
  `);

  // White-label Configuration
  db.exec(`
    CREATE TABLE IF NOT EXISTS configuracoes_whitelabel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER UNIQUE NOT NULL,
      nome_sistema TEXT NOT NULL,
      logo_url TEXT,
      cor_primaria TEXT DEFAULT '#0a47c2',
      cor_secundaria TEXT DEFAULT '#fbbf24',
      cor_fundo_claro TEXT DEFAULT '#f5f6f8',
      cor_fundo_escuro TEXT DEFAULT '#101622',
      whatsapp_api_provider TEXT,
      whatsapp_api_token TEXT,
      whatsapp_numero_remetente TEXT,
      whatsapp_webhook_url TEXT,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);

  // Migrations for existing tables
  const tableInfoClientes = db.prepare("PRAGMA table_info(clientes)").all() as any[];
  const hasWhatsappNumero = tableInfoClientes.some(col => col.name === 'whatsapp_numero');
  if (!hasWhatsappNumero) {
    db.exec("ALTER TABLE clientes ADD COLUMN whatsapp_numero TEXT");
    db.exec("ALTER TABLE clientes ADD COLUMN whatsapp_notificacoes_ativas INTEGER DEFAULT 0");
  }

  const tableInfoConfig = db.prepare("PRAGMA table_info(configuracoes_whitelabel)").all() as any[];
  const hasWhatsappProvider = tableInfoConfig.some(col => col.name === 'whatsapp_api_provider');
  if (!hasWhatsappProvider) {
    db.exec("ALTER TABLE configuracoes_whitelabel ADD COLUMN whatsapp_api_provider TEXT");
    db.exec("ALTER TABLE configuracoes_whitelabel ADD COLUMN whatsapp_api_token TEXT");
    db.exec("ALTER TABLE configuracoes_whitelabel ADD COLUMN whatsapp_numero_remetente TEXT");
    db.exec("ALTER TABLE configuracoes_whitelabel ADD COLUMN whatsapp_webhook_url TEXT");
  }

  // Products
  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      sku TEXT NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      marca TEXT,
      preco_sugerido REAL,
      imagem_principal_url TEXT,
      status TEXT DEFAULT 'ativo',
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
  `);

  // Protocol Products (Link protocols to products for analysis)
  db.exec(`
    CREATE TABLE IF NOT EXISTS protocolo_produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      protocolo_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      FOREIGN KEY (protocolo_id) REFERENCES protocolos(id),
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    )
  `);

  // Strategic Opinions (Pareceres)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pareceres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      consultor_id INTEGER NOT NULL,
      conteudo TEXT NOT NULL,
      status_resultado TEXT NOT NULL, -- 'superou', 'dentro', 'atencao'
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (consultor_id) REFERENCES usuarios(id)
    )
  `);

  seedData();

  // Ensure Admin User exists (for demo purposes)
  const defaultPassword = "Acesso@007";
  const hashedAdminPwd = bcrypt.hashSync(defaultPassword, 10);
  
  // Update ALL existing users to the new password as requested
  db.prepare("UPDATE usuarios SET senha = ?").run(hashedAdminPwd);
  db.prepare("UPDATE clientes SET senha = ?").run(hashedAdminPwd);

  const adminUser = db.prepare("SELECT id FROM usuarios WHERE email = ?").get("admin@test.com") as any;
  if (!adminUser) {
    const company = db.prepare("SELECT id FROM empresas LIMIT 1").get() as any;
    if (company) {
      db.prepare("INSERT INTO usuarios (empresa_id, nome, email, senha, perfil) VALUES (?, ?, ?, ?, ?)").run(
        company.id,
        "Admin Teste",
        "admin@test.com",
        hashedAdminPwd,
        "admin"
      );
    }
  } else {
    // Force update password to be sure
    db.prepare("UPDATE usuarios SET senha = ? WHERE email = ?").run(hashedAdminPwd, "admin@test.com");
  }

  // Ensure Consultant User exists
  const consultUser = db.prepare("SELECT id FROM usuarios WHERE email = ?").get("consult@test.com") as any;
  if (!consultUser) {
    const company = db.prepare("SELECT id FROM empresas LIMIT 1").get() as any;
    if (company) {
      db.prepare("INSERT INTO usuarios (empresa_id, nome, email, senha, perfil) VALUES (?, ?, ?, ?, ?)").run(
        company.id,
        "Consultor Teste",
        "consult@test.com",
        hashedAdminPwd,
        "consultor"
      );
    }
  } else {
    db.prepare("UPDATE usuarios SET senha = ? WHERE email = ?").run(hashedAdminPwd, "consult@test.com");
  }

  // Ensure Client User exists
  const clientUser = db.prepare("SELECT id FROM clientes WHERE email = ?").get("cliente@test.com") as any;
  if (clientUser) {
    db.prepare("UPDATE clientes SET senha = ? WHERE email = ?").run(hashedAdminPwd, "cliente@test.com");
  }

  // Ensure specific categories exist for the first company
  const firstCompany = db.prepare("SELECT id FROM empresas LIMIT 1").get() as any;
  if (firstCompany) {
    const categories = ["Dúvida", "Produto", "Financeiro", "Mídia", "Marketplace"];
    for (const cat of categories) {
      const exists = db.prepare("SELECT id FROM categorias WHERE empresa_id = ? AND nome = ?").get(firstCompany.id, cat);
      if (!exists) {
        db.prepare("INSERT INTO categorias (empresa_id, nome) VALUES (?, ?)").run(firstCompany.id, cat);
      }
    }

    const priorities = [
      { name: "Baixa", sla: 72 },
      { name: "Média", sla: 24 },
      { name: "Alta", sla: 4 }
    ];
    for (const prio of priorities) {
      const exists = db.prepare("SELECT id FROM prioridades WHERE empresa_id = ? AND nome = ?").get(firstCompany.id, prio.name);
      if (!exists) {
        db.prepare("INSERT INTO prioridades (empresa_id, nome, tempo_sla) VALUES (?, ?, ?)").run(firstCompany.id, prio.name, prio.sla);
      }
    }
  }
}

function seedData() {
  const companyCount = db.prepare("SELECT COUNT(*) as count FROM empresas").get() as any;
  if (companyCount.count > 0) return;

  console.log("Seeding initial data...");

  // Create Test Company
  const companyId = db.prepare("INSERT INTO empresas (nome, cnpj, plano) VALUES (?, ?, ?)").run(
    "E-COM e VC",
    "12.345.678/0001-90",
    "premium"
  ).lastInsertRowid;

  // Create White-label Config
  db.prepare(`
    INSERT INTO configuracoes_whitelabel (empresa_id, nome_sistema, cor_primaria, cor_secundaria)
    VALUES (?, ?, ?, ?)
  `).run(companyId, "OperFlow", "#0a47c2", "#fbbf24");

  // Create Admin User
  const hashedAdminPwd = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Acesso@007", 10);
  const hashedClientPwd = bcrypt.hashSync(process.env.CLIENT_PASSWORD || "Acesso@007", 10);
  db.prepare("INSERT INTO usuarios (empresa_id, nome, email, senha, perfil) VALUES (?, ?, ?, ?, ?)").run(
    companyId,
    "Admin Teste",
    "admin@test.com",
    hashedAdminPwd,
    "admin"
  );

  // Create Consultant User
  const consultorId = db.prepare("INSERT INTO usuarios (empresa_id, nome, email, senha, perfil) VALUES (?, ?, ?, ?, ?)").run(
    companyId,
    "Consultor Teste",
    "consult@test.com",
    hashedAdminPwd,
    "consultor"
  ).lastInsertRowid as number;

  // Create Client
  const clientId = db.prepare("INSERT INTO clientes (empresa_id, consultor_id, nome, email, senha, telefone) VALUES (?, ?, ?, ?, ?, ?)").run(
    companyId,
    consultorId,
    "Loja Exemplo",
    "cliente@test.com",
    hashedAdminPwd,
    "11999999999"
  ).lastInsertRowid;

  // Create 20 test clients for the consultant
  for (let i = 1; i <= 20; i++) {
    db.prepare("INSERT INTO clientes (empresa_id, consultor_id, nome, email, senha, telefone) VALUES (?, ?, ?, ?, ?, ?)").run(
      companyId,
      consultorId,
      `Lojista de Teste ${i}`,
      `lojista${i}@test.com`,
      hashedClientPwd,
      `1198888${i.toString().padStart(4, '0')}`
    );
  }

  // Create Channels for Client
  db.prepare("INSERT INTO canais (cliente_id, nome, status, status_cor, estoque_tipo, estoque_cor) VALUES (?, ?, ?, ?, ?, ?)").run(clientId, "Mercado Livre", "ativo", "verde", "Full", "verde");
  db.prepare("INSERT INTO canais (cliente_id, nome, status, status_cor, estoque_tipo, estoque_cor) VALUES (?, ?, ?, ?, ?, ?)").run(clientId, "Amazon", "pendente", "amarelo", "FBA", "verde");
  db.prepare("INSERT INTO canais (cliente_id, nome, status, status_cor, estoque_tipo, estoque_cor) VALUES (?, ?, ?, ?, ?, ?)").run(clientId, "Shopee", "inativo", "vermelho", "Fulfillment", "vermelho");

  // Create Evolution for Client
  db.prepare("INSERT INTO cliente_evolucao (cliente_id, consultor_id, titulo, descricao) VALUES (?, ?, ?, ?)").run(
    clientId,
    consultorId,
    "Início da Consultoria",
    "O cliente iniciou com baixa performance em marketplaces secundários. Focamos na estruturação do Mercado Livre primeiro."
  );
  db.prepare("INSERT INTO cliente_evolucao (cliente_id, consultor_id, titulo, descricao) VALUES (?, ?, ?, ?)").run(
    clientId,
    consultorId,
    "Otimização de Anúncios",
    "Realizamos a revisão de 150 anúncios, melhorando títulos e descrições. O CTR aumentou em 25%."
  );

  // Create Insight for Client
  db.prepare("INSERT INTO insights (cliente_id, titulo, descricao) VALUES (?, ?, ?)").run(
    clientId,
    "Feedback Estratégico",
    "Identificamos oportunidade de 15% de crescimento migrando 80 SKUs para o modelo Full. Seu estoque na Amazon (FBA) está próximo do limite crítico para itens Curva A. Recomendamos o reabastecimento imediato do SKU ECOM-PRO-X2."
  );

  // Create Products
  const prodId = db.prepare(`
    INSERT INTO produtos (empresa_id, cliente_id, sku, titulo, descricao, marca, preco_sugerido, imagem_principal_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    companyId,
    clientId,
    "PROD-9923-XB",
    "Câmera Mirrorless Profissional 4K TechVision Z1",
    "A TechVision Z1 é uma câmera de última geração com sensor full-frame de 45MP, gravação em 4K nativo a 60fps e sistema de foco automático híbrido ultra-rápido.",
    "TechVision",
    12499.00,
    "https://picsum.photos/seed/camera/800/800"
  ).lastInsertRowid;

  // Create Opinion
  db.prepare(`
    INSERT INTO pareceres (cliente_id, consultor_id, conteudo, status_resultado)
    VALUES (?, ?, ?, ?)
  `).run(
    clientId,
    1,
    "Sua performance no Full cresceu 15% este mês. Recomendamos aumentar o estoque de itens curva A para a Black Friday. O canal Amazon apresenta oportunidade em eletrônicos.",
    "superou"
  );

  // Create Categories
  const categories = ["Dúvida", "Produto", "Financeiro", "Mídia", "Marketplace"];
  const catIds = categories.map(name => db.prepare("INSERT INTO categorias (empresa_id, nome) VALUES (?, ?)").run(companyId, name).lastInsertRowid);

  // Create Priorities
  const priorities = [
    { name: "Baixa", sla: 72 },
    { name: "Média", sla: 24 },
    { name: "Alta", sla: 4 }
  ];
  const prioIds = priorities.map(p => db.prepare("INSERT INTO prioridades (empresa_id, nome, tempo_sla) VALUES (?, ?, ?)").run(companyId, p.name, p.sla).lastInsertRowid);

  // Create some fake protocols
  for (let i = 1; i <= 20; i++) {
    db.prepare(`
      INSERT INTO protocolos (empresa_id, cliente_id, titulo, descricao, categoria_id, prioridade_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      companyId,
      1,
      `Protocolo de Teste #${i}`,
      `Descrição detalhada do protocolo de teste número ${i}.`,
      catIds[i % catIds.length],
      prioIds[i % prioIds.length],
      i % 5 === 0 ? 'concluido' : (i % 4 === 0 ? 'em atendimento' : 'aberto')
    );
  }
}

export default db;
