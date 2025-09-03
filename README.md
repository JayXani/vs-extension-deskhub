# Maestro VSCode Extension

Extensão do **Maestro** para o Visual Studio Code. Ela integra ações do Maestro diretamente no editor para agilizar a inicialização e o fluxo de trabalho do seu projeto.

---

## 📌 Para que serve

* **Inicializar projetos Maestro** sem sair do VS Code, executando o equivalente a `maestro --init` pela Paleta de Comandos.
* **Padronizar o setup** de ambiente do projeto (estrutura básica, arquivos iniciais, etc.).
* **Integrar com o ecossistema Maestro** (ex.: comandos, webviews e recursos internos da extensão).
* **Evitar falhas comuns** ao configurar manualmente, centralizando a inicialização num comando único.

> Observação: a extensão não substitui o CLI do Maestro; ela o **orquestra** sempre que aplicável.

---

## ⬇️ Passo a passo para baixar/instalar a extensão

### Opção A — Marketplace (recomendado)

1. Abra o **Visual Studio Code**.
2. Acesse a aba **Extensions** (atalho: `Ctrl+Shift+X` no Windows/Linux ou `Cmd+Shift+X` no macOS).
3. Pesquise por **"Maestro"** (ou o **nome exato** da extensão publicado).
4. Clique em **Install**.
5. Reinicie/recaregue o VS Code se for solicitado.

> Dica: confirme o **publisher** e o **ID** da extensão antes de instalar, para garantir que está instalando a extensão correta.

### Opção B — Arquivo VSIX (instalação offline ou build local)

1. Baixe o arquivo `*.vsix` da extensão (por exemplo, a partir de *Releases* do seu repositório).
2. No VS Code, vá em **Extensions** → botão de **mais opções (⋯)** → **Install from VSIX…**.
3. Selecione o arquivo `.vsix` e confirme a instalação.

### Opção C — Linha de comando do VS Code

Se você souber o **publisher** e o **ID** da extensão (definidos no `package.json`), instale com:

```bash
code --install-extension <publisher>.<extension-id>
```

Para atualizar:

```bash
code --install-extension <publisher>.<extension-id> --force
```

> Substitua `<publisher>.<extension-id>` pelo valor real (ex.: `minhaorg.maestro-vscode`).

---

## 🧭 Como usar (resumo rápido)

1. Com o projeto aberto, abra a **Command Palette**: `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (macOS).
2. Digite **Maestro** para filtrar os comandos da extensão.
3. Escolha **"Maestro: Init"** para rodar a inicialização (`maestro --init`).

Se o projeto exigir parâmetros adicionais, a extensão/CLI poderá solicitar interações.

---

## ⌨️ Comandos disponíveis

### Paleta de Comandos (VS Code)

| Nome visível      | ID do comando  | O que faz                                                                        |
| ----------------- | -------------- | -------------------------------------------------------------------------------- |
| **Maestro: Init** | `maestro.init` | Executa a inicialização do projeto via Maestro (equivalente a `maestro --init`). |

> Observação: conforme a extensão evoluir, novos comandos podem ser adicionados. Mantenha esta tabela atualizada de acordo com os itens definidos no `contributes.commands` do `package.json`.

### Linha de comando (CLI do Maestro — opcional)

Se você utiliza o **CLI do Maestro** no seu ambiente, os comandos de terminal continuam funcionando normalmente fora do VS Code. Exemplo:

```bash
maestro --init
```

A extensão pode chamar o CLI por baixo dos panos, quando disponível, para manter uma experiência consistente entre terminal e editor.

---

## 🧩 Requisitos

* **Usuário (para usar a extensão):** VS Code estável e acesso aos recursos do projeto. O CLI do Maestro é **opcional**, mas pode ser necessário em cenários específicos de inicialização.
* **Desenvolvimento (para contribuir):** Node.js LTS, npm ou pnpm, TypeScript (se o projeto usar TS), e VS Code.

---

## ❓ Perguntas frequentes

* **Preciso do CLI para usar a extensão?**
  Não necessariamente. Porém, quando presente, o CLI é utilizado para garantir o mesmo comportamento do terminal.

* **Quais permissões a extensão usa?**
  Apenas as necessárias para executar comandos e interagir com o workspace atual.

---

## 🐛 Suporte

Abra uma *issue* no repositório da extensão com:

* Versão do VS Code
* Sistema operacional
* Logs ou prints do problema
* Passo a passo para reproduzir

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT** (ou a definida no repositório). Consulte o arquivo `LICENSE`.
