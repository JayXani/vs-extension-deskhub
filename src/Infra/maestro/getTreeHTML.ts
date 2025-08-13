export function getTreeHtml(items: any[] = []): string {

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fluxo Maestro - Editor Avançado</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />

  <!-- CodeMirror Core + Themes -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/darcula.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/eclipse.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/material-darker.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/lint/lint.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/hint/show-hint.css" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --primary-color: #6366f1;
      --primary-hover: #4f46e5;
      --dark-bg: #1e293b;
      --card-bg: #ffffff;
      --text-color: #334155;
      --light-gray: #f1f5f9;
      --border-radius: 12px;
      --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    [data-theme="dark"] {
      --card-bg: #1e293b;
      --text-color: #e2e8f0;
      --light-gray: #0f172a;
    }

    body {
      background-color: var(--light-gray);
      font-family: 'Inter', sans-serif;
      color: var(--text-color);
      line-height: 1.6;
      transition: background-color 0.3s, color 0.3s;
    }

    .navbar {
      background-color: var(--card-bg);
      transition: background-color 0.3s;
    }

    .navbar-brand {
      font-weight: 600;
      color: var(--primary-color);
    }

    h2 {
      text-align: center;
      margin: 2rem 0;
      font-weight: 600;
      color: var(--primary-color);
    }

    .container-mermaid {
      background: var(--card-bg);
      border-radius: var(--border-radius);
      padding: 2rem;
      box-shadow: var(--box-shadow);
      overflow-x: auto;
      margin-bottom: 2rem;
      border: 1px solid #e2e8f0;
      transition: background-color 0.3s, border-color 0.3s;
    }

    [data-theme="dark"] .container-mermaid {
      border-color: #334155;
    }

    .mermaid {
      text-align: center;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .CodeMirror {
      height: 500px;
      font-size: 14px;
      border-radius: var(--border-radius);
      border: 1px solid #e2e8f0;
      font-family: 'Fira Code', 'Consolas', monospace;
      transition: background-color 0.3s, border-color 0.3s;
    }

    [data-theme="dark"] .CodeMirror {
      border-color: #334155;
    }

    .form-select {
      max-width: 250px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      transition: background-color 0.3s, border-color 0.3s;
    }

    [data-theme="dark"] .form-select {
      border-color: #334155;
      background-color: #1e293b;
      color: #e2e8f0;
    }

    .modal-content {
      border-radius: var(--border-radius);
      border: none;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      background-color: var(--card-bg);
      color: var(--text-color);
      transition: background-color 0.3s, color 0.3s;
    }

    .modal-header {
      border-bottom: 1px solid #e2e8f0;
      padding: 1.5rem;
      transition: border-color 0.3s;
    }

    [data-theme="dark"] .modal-header {
      border-color: #334155;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      border-top: 1px solid #e2e8f0;
      padding: 1rem 1.5rem;
      transition: border-color 0.3s;
    }

    [data-theme="dark"] .modal-footer {
      border-color: #334155;
    }

    .btn-primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .btn-primary:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
    }

    .editor-toolbar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .editor-toolbar-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .editor-toolbar-label {
      font-weight: 500;
      font-size: 0.875rem;
      color: #64748b;
    }

    .status-bar {
      background-color: #f8fafc;
      padding: 0.5rem 1rem;
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      border-top: 1px solid #e2e8f0;
      font-size: 0.75rem;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      transition: background-color 0.3s, border-color 0.3s, color 0.3s;
    }

    [data-theme="dark"] .status-bar {
      background-color: #1e293b;
      border-color: #334155;
      color: #94a3b8;
    }

    .node-tooltip {
      position: absolute;
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      box-shadow: var(--box-shadow);
      font-size: 0.875rem;
      z-index: 100;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    }

    [data-theme="dark"] .node-tooltip {
      background: #1e293b;
      color: #e2e8f0;
    }

    .loading-spinner {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      border: 3px solid rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      border-top-color: var(--primary-color);
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-text {
      color: var(--primary-color);
      font-weight: 500;
    }

    .theme-switcher {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background-color: rgba(99, 102, 241, 0.1);
    }

    .theme-switcher:hover {
      background-color: rgba(99, 102, 241, 0.2);
    }

    .theme-icon {
      font-size: 1.2rem;
      color: var(--primary-color);
    }
  </style>
</head>
<body data-theme="light">
  <nav class="navbar navbar-expand-lg shadow-sm">
    <div class="container">
      <a class="navbar-brand" href="#">
        <i class="bi bi-diagram-3 me-2"></i>
        Fluxo Maestro
      </a>
      <div class="d-flex align-items-center gap-3">
        <div class="theme-switcher" id="themeToggle">
          <i class="bi bi-sun-fill theme-icon"></i>
          <span>Tema Claro</span>
        </div>
        <button class="btn btn-outline-primary">
          <i class="bi bi-cloud-arrow-up me-1"></i> Exportar
        </button>
      </div>
    </div>
  </nav>

  <div class="container my-4">
    <h2><i class="bi bi-diagram-3 me-2"></i>Fluxo do Maestro</h2>
    <div class="container-mermaid">
      <div class="mermaid">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">Carregando diagrama...</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="codeModal" tabindex="-1" aria-labelledby="codeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="codeModalLabel">
            <i class="bi bi-code-square me-2"></i>Editor de Código
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="editor-toolbar">
            <div class="editor-toolbar-item">
              <span class="editor-toolbar-label">Linguagem:</span>
              <select class="form-select form-select-sm" id="languageSelect">
                <option value="python">Python</option>
                <option value="htmlmixed">HTML</option>
                <option value="javascript">JavaScript</option>
                <option value="application/json">JSON</option>
              </select>
            </div>
            <div class="editor-toolbar-item">
              <span class="editor-toolbar-label">Tema:</span>
              <select class="form-select form-select-sm" id="themeSelect">
                <option value="default">Claro</option>
                <option value="eclipse">Eclipse</option>
                <option value="darcula">Darcula</option>
                <option value="material-darker">Material Darker</option>
              </select>
            </div>
            <div class="editor-toolbar-item ms-auto">
              <button class="btn btn-sm btn-outline-secondary" id="formatBtn">
                <i class="bi bi-braces me-1"></i>Formatar
              </button>
            </div>
          </div>
          <textarea id="codeEditor"># Digite seu código Python aqui
def exemplo_funcao(parametro):
    """Exemplo de docstring"""
    try:
        if parametro > 0:
            return parametro * 2
        else:
            raise ValueError("Parâmetro deve ser positivo")
    except Exception as e:
        print(f"Erro: {e}")
        return None</textarea>
          <div class="status-bar">
            <span id="cursorPosition">Linha 1, Coluna 1</span>
            <span id="syntaxStatus">✓ Sintaxe válida</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x-lg me-1"></i>Fechar
          </button>
          <button class="btn btn-primary" id="saveBtn">
            <i class="bi bi-save me-1"></i>Salvar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Node tooltip (hidden by default) -->
  <div class="node-tooltip" id="nodeTooltip"></div>

  <!-- CodeMirror JS -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/javascript/javascript.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/htmlmixed/htmlmixed.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/python/python.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/javascript/json.js"></script>
  
  <!-- CodeMirror Addons -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/lint/lint.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/lint/json-lint.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/lint/javascript-lint.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/edit/matchbrackets.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/edit/closebrackets.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/hint/show-hint.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/hint/javascript-hint.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/hint/html-hint.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.16/addon/comment/comment.js"></script>

  <!-- Linters -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jsonlint/1.6.0/jsonlint.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jshint/2.13.6/jshint.min.js"></script>

  <!-- Formatters -->
  <script src="https://cdn.jsdelivr.net/npm/js-beautify@1.14.7/js/lib/beautify.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/js-beautify@1.14.7/js/lib/beautify-html.min.js"></script>

  <!-- Mermaid JS -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

  <!-- Bootstrap Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

  <script>
    // Configuração inicial do tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);

    // Função para alternar entre temas
    function toggleTheme() {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeToggle(newTheme);
      
      // Atualizar o tema do Mermaid
      initializeMermaid(newTheme);
      generateMermaid();
    }

    // Atualizar o botão de alternância de tema
    function updateThemeToggle(theme) {
      const toggle = document.getElementById('themeToggle');
      if (theme === 'dark') {
        toggle.innerHTML = '<i class="bi bi-moon-fill theme-icon"></i><span>Tema Escuro</span>';
      } else {
        toggle.innerHTML = '<i class="bi bi-sun-fill theme-icon"></i><span>Tema Claro</span>';
      }
    }

    // Inicialização do Mermaid com tema dinâmico
    function initializeMermaid(theme) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: theme === 'dark' ? 'dark' : 'default',
        flowchart: {
          curve: 'basis',
          useMaxWidth: true,
          htmlLabels: true,
          nodeSpacing: 50,
          rankSpacing: 100
        },
        fontFamily: 'Inter, sans-serif'
      });
    }

    // Inicializar Mermaid com o tema salvo
    initializeMermaid(savedTheme);

    const tree = ${items};

    const nodeDescriptions = {
      "BEGIN_init": "Ponto de início do fluxo",
      "IF_1": "Condicional - Verifica entrada",
      "FALSE_1": "Caminho quando condição é falsa",
      "TRUE_1": "Caminho quando condição é verdadeira",
      "PARSE_1": "Processamento de dados (caminho falso)",
      "PARSE_2": "Processamento de dados (caminho verdadeiro)",
      "LOOP_1": "Loop de repetição",
      "STOP_1": "Ponto de parada",
      "HTTP_1": "Requisição HTTP"
    };

    const getIcon = (node) => {
      if (node.startsWith("IF_")) return "bi bi-diagram-3";
      if (node.startsWith("PARSE_")) return "bi bi-code-square";
      if (node.startsWith("LOOP_")) return "bi bi-arrow-repeat";
      if (node.startsWith("BEGIN_")) return "bi bi-box-arrow-in-right";
      if (node.startsWith("STOP_")) return "bi bi-stop-circle";
      if (node.startsWith("HTTP_")) return "bi bi-globe2";
      if (node.startsWith("TRUE_") || node.startsWith("FALSE_")) return "bi bi-check-circle";
      return "bi bi-file-earmark";
    };

    const generateMermaid = () => {
      const lines = new Set();
      const nodes = new Set();

      for (const path of tree) {
        for (let i = 0; i < path.length - 1; i++) {
          const from = path[i];
          const to = path[i + 1];

          if (!nodes.has(from)) {
            lines.add(\`\${from}["<i class='\${getIcon(from)}'></i><br>\${from}"]\`);
            nodes.add(from);
          }

          if (!nodes.has(to)) {
            lines.add(\`\${to}["<i class='\${getIcon(to)}'></i><br>\${to}"]\`);
            nodes.add(to);
          }

          lines.add(\`\${from} --> \${to}\`);

          if (to.startsWith("PARSE_")) {
            lines.add(\`click \${to} showModal "\${to}"\`);
          }
        }
      }

      const output = "flowchart TD\\n" + Array.from(lines).join("\\n");
      const mermaidDiv = document.querySelector(".mermaid");
      mermaidDiv.innerHTML = output;
      
      mermaid.init(undefined, mermaidDiv).then(() => {
        // Add hover effects after diagram is rendered
        document.querySelectorAll('.mermaid .node').forEach(node => {
          const nodeId = node.id.replace(/^flowchart-/, '');
          
          node.addEventListener('mouseenter', (e) => {
            const tooltip = document.getElementById('nodeTooltip');
            tooltip.textContent = nodeDescriptions[nodeId] || 'Nó do fluxo';
            tooltip.style.left = \`\${e.pageX + 15}px\`;
            tooltip.style.top = \`\${e.pageY + 15}px\`;
            tooltip.style.opacity = '1';
          });
          
          node.addEventListener('mouseleave', () => {
            document.getElementById('nodeTooltip').style.opacity = '0';
          });
        });
      });
    };

    window.showModal = (nodeId) => {
      document.getElementById("codeModalLabel").innerHTML = \`
        <i class="bi bi-code-square me-2"></i>Editor - \${nodeId}
        <span class="badge bg-primary ms-2">\${nodeDescriptions[nodeId] || ''}</span>
      \`;
      
      // Set default code based on node type
      let defaultCode = '';
      if (nodeId.startsWith("PARSE_")) {
        defaultCode = \`# Processamento de dados para \${nodeId}\\n\\ndef process_data(input):\\n    """\\n    Processa os dados recebidos\\n    \\n    Args:\\n        input: Dados de entrada\\n    \\n    Returns:\\n        Dados processados\\n    """\\n    try:\\n        # Implemente sua lógica aqui\\n        processed = input * 2\\n        return processed\\n    except Exception as e:\\n        print(f"Erro no processamento: {e}")\\n        return None\`;
      } else if (nodeId.startsWith("HTTP_")) {
        defaultCode = \`// Requisição HTTP para \${nodeId}\\n\\nconst fetchData = async (url) => {\\n  try {\\n    const response = await fetch(url);\\n    if (!response.ok) {\\n      throw new Error(\`HTTP error! status: \${response.status}\`);\\n    }\\n    const data = await response.json();\\n    return data;\\n  } catch (error) {\\n    console.error('Error fetching data:', error);\\n    return null;\\n  }\\n};\`;
      }
      
      editor.setValue(defaultCode || \`// Código para \${nodeId}\`);
      
      // Auto-detect language based on node type
      if (nodeId.startsWith("PARSE_")) {
        document.getElementById("languageSelect").value = "python";
        editor.setOption("mode", "python");
      } else if (nodeId.startsWith("HTTP_")) {
        document.getElementById("languageSelect").value = "javascript";
        editor.setOption("mode", "javascript");
      }
      
      const modal = new bootstrap.Modal(document.getElementById('codeModal'));
      modal.show();
    };

    // Validador de Python simples (sem dependências externas)
    function validatePythonSyntax(code) {
      try {
        // Verifica padrões comuns de erro de sintaxe
        const errors = {
          'IndentationError': /^IndentationError:/m,
          'SyntaxError': /^SyntaxError:/m,
          'unexpected indent': /unexpected indent/m,
          'expected an indented block': /expected an indented block/m,
          'invalid syntax': /invalid syntax/m,
          'unterminated string literal': /unterminated string literal/m,
          'unmatched ': /unmatched \\(|unmatched \\[|unmatched \\{/m
        };

        // Verifica parênteses/chaves/colchetes balanceados
        const stack = [];
        const pairs = {'(': ')', '[': ']', '{': '}'};
        
        for (let i = 0; i < code.length; i++) {
          const char = code[i];
          if (pairs[char]) {
            stack.push(char);
          } else if (Object.values(pairs).includes(char)) {
            if (stack.length === 0 || pairs[stack.pop()] !== char) {
              return {valid: false, error: "Parênteses/colchetes/chaves não balanceados"};
            }
          }
        }

        if (stack.length > 0) {
          return {valid: false, error: \`Fechamento faltando para: \${stack.pop()}\`};
        }

        // Verifica erros comuns
        for (const [errorType, pattern] of Object.entries(errors)) {
          if (pattern.test(code)) {
            return {valid: false, error: errorType};
          }
        }

        return {valid: true};
      } catch (e) {
        return {valid: false, error: e.message};
      }
    }

    const formatCode = () => {
      const mode = editor.getOption("mode");
      let code = editor.getValue();
      
      try {
        if (mode === "application/json") {
          code = JSON.stringify(JSON.parse(code), null, 2);
        } else if (mode === "javascript") {
          code = js_beautify(code, { indent_size: 2 });
        } else if (mode === "htmlmixed") {
          code = html_beautify(code, { indent_size: 2 });
        } else if (mode === "python") {
          // Formatação básica para Python
          const lines = code.split('\\n');
          let formatted = [];
          let indent = 0;
          
          for (let line of lines) {
            line = line.trim();
            if (line.endsWith(':')) {
              formatted.push(' '.repeat(indent * 4) + line);
              indent++;
            } else if (line === '' && indent > 0) {
              indent--;
              formatted.push(' '.repeat(indent * 4) + line);
            } else {
              formatted.push(' '.repeat(indent * 4) + line);
            }
          }
          
          code = formatted.join('\\n');
        }
        
        editor.setValue(code);
        document.getElementById("syntaxStatus").textContent = "✓ Código formatado";
        document.getElementById("syntaxStatus").style.color = "green";
      } catch (error) {
        document.getElementById("syntaxStatus").textContent = \`Erro de formatação: \${error.message}\`;
        document.getElementById("syntaxStatus").style.color = "red";
      }
    };

    const validateCode = () => {
      const mode = editor.getOption("mode");
      let isValid = true;
      let message = "✓ Sintaxe válida";
      
      try {
        if (mode === "application/json") {
          JSON.parse(editor.getValue());
        } else if (mode === "javascript") {
          JSHINT(editor.getValue());
          if (JSHINT.errors && JSHINT.errors.length > 0) {
            throw new Error(JSHINT.errors[0].reason);
          }
        } else if (mode === "python") {
          const result = validatePythonSyntax(editor.getValue());
          if (!result.valid) {
            throw new Error(result.error);
          }
        }
      } catch (error) {
        isValid = false;
        message = \`Erro de sintaxe: \${error.message}\`;
      }
      
      document.getElementById("syntaxStatus").textContent = message;
      document.getElementById("syntaxStatus").style.color = isValid ? "green" : "red";
      return isValid;
    };

    // Inicialização quando o DOM estiver pronto
    document.addEventListener("DOMContentLoaded", () => {
      // Configurar o alternador de tema
      document.getElementById('themeToggle').addEventListener('click', toggleTheme);

      // Inicializar o editor
      editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
        lineNumbers: true,
        mode: "python",
        theme: savedTheme === 'dark' ? 'material-darker' : 'default',
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,  // Python usa 4 espaços
        tabSize: 4,
        lineWrapping: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete",
          "Ctrl-/": "toggleComment",
          "Shift-Tab": "indentLess",
          "Tab": (cm) => {
            if (cm.getMode().name === 'python') {
              cm.execCommand('indentMore');
            } else {
              cm.execCommand('insertTab');
            }
          }
        }
      });

      // Atualizar posição do cursor
      editor.on("cursorActivity", () => {
        const cursor = editor.getCursor();
        document.getElementById("cursorPosition").textContent = 
          \`Linha \${cursor.line + 1}, Coluna \${cursor.ch + 1}\`;
      });

      // Validar código quando houver mudanças
      editor.on("change", () => {
        validateCode();
      });

      // Mudar linguagem
      document.getElementById("languageSelect").addEventListener("change", (e) => {
        const lang = e.target.value;
        editor.setOption("mode", lang);
        
        // Habilitar/desabilitar linting baseado na linguagem
        if (lang === "application/json") {
          editor.setOption("lint", true);
        } else if (lang === "javascript") {
          editor.setOption("lint", true);
        } else {
          editor.setOption("lint", false);
        }
        
        validateCode();
      });

      // Mudar tema do editor
      document.getElementById("themeSelect").addEventListener("change", (e) => {
        editor.setOption("theme", e.target.value);
      });

      // Botão de formatar
      document.getElementById("formatBtn").addEventListener("click", formatCode);
      
      // Botão de salvar
      document.getElementById("saveBtn").addEventListener("click", () => {
        if (validateCode()) {
          // Aqui você normalmente salvaria o código no backend
          alert("Código salvo com sucesso!");
          bootstrap.Modal.getInstance(document.getElementById("codeModal")).hide();
        }
      });

      // Gerar o diagrama inicial
      generateMermaid();
    });
  </script>
</body>
</html>
`;
}