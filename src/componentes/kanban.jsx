// ─────────────────────────────────────────────────────────────────────────────
// Kanban.jsx — MODIFICADO (Semana 5, Dia 2)
// App.jsx foi refatorado para Kanban.jsx, mantendo o mesmo conteúdo.
//
// MUDANÇAS em relação à versão anterior:
//   1. adicionarTarefa → campo coluna: 'afazer' adicionado ao objeto da tarefa
//   2. moverTarefa     → nova função (mesmo padrão do alternarConcluida)
//   3. return          → seção de controles substituída pelo quadro Kanban
//                        com três colunas, cada uma usando <ListaTarefas>
//
// COMPONENTES REUTILIZADOS:
//   • Header, Contador  — sem nenhuma alteração
//   • ListaTarefas      — recebe props de Kanban e as repassa para TarefaItem
//   • TarefaItem        — estendido com props opcionais (ver TarefaItem.jsx)
//
// FLUXO DE DADOS:
//   App → ListaTarefas (tarefas filtradas + onMover + colunas)
//       → TarefaItem   (texto + prioridade + botões ← →)
// ─────────────────────────────────────────────────────────────────────────────

import Header from "./Header";
import Contador from "./Contador";
import ListaTarefas from "./ListaTarefas"; // reutilizado nas colunas
import { useState, useEffect } from "react";
import api from "../api";

function Kanban() {
  // ── Estado das tarefas — inicializador de função carrega do localStorage ──
  // Sem alteração em relação à versão anterior
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const[erro, setErro] = useState('');


  // ── useEffect: salva tarefas no localStorage sempre que mudar ─────────────
  // Sem alteração — persiste o campo coluna automaticamente
  useEffect(() => {
    async function carregandoTarefas() {
      try {
        setCarregando (true);
        setErro ("");
      
        await new Promise((resolver) => setTimeout(resolver,2000));
        const resposta = await api.get('/tarefas');
        setTarefas(resposta.data);
     
      }catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexao");
          console.error(e);
      }finally{
        setCarregando(false);
      }
    }
    carregandoTarefas();
  }, []);

  // ── MODIFICAÇÃO 1: adicionarTarefa ganha o campo coluna ──────────────────
  // Toda tarefa nova começa na primeira coluna: 'afazer'
  // Valores possíveis: 'afazer' | 'andamento' | 'concluido'
  async function deletarTarefa(id) {
try{
  await api.delete(`/tarefas/${id}`);
  setTarefas(
    tarefas.filter(t => t.id !== id)
  );
}    catch (erro) {
  setErro('Erro ao deletar.');
}
   
  }

  async function salvarTarefas(dados) {
    if (dados.id === undefined) {
      try{
        const resposta  = await api.post('/tarefas', dados);
      }
    }
 }

  const adicionarTarefa = () => {
    if (texto.trim() === "") return;

    const novaTarefa = {
      id: proximaId,
      texto: texto,
      concluida: false,
      prioridade: prioridade,
      coluna: "afazer", // ← CAMPO NOVO: ponto de entrada do fluxo Kanban
    };

    setTarefas([...tarefas, novaTarefa]);
    setProximaId(proximaId + 1);
    setTexto("");
    setPrioridade("media");
  };

  // ── Sem alteração ─────────────────────────────────────────────────────────
  const deletarTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  // ── Sem alteração ─────────────────────────────────────────────────────────
  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };

  // ── MODIFICAÇÃO 2: moverTarefa — nova função ──────────────────────────────
  // Mesmo padrão do alternarConcluida: .map() + spread
  // Recebe o id da tarefa e o nome da nova coluna
  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, coluna: novaColuna } // spread copia tudo, só coluna muda
          : tarefa,
      ),
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Sem alteração */}
      <Contador />
      <Header
        titulo="TaskFlow - Teste"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      <main className="container">
        {/* Formulário — sem alteração */}
        <section id="formulario">
          <div className="campo-linha">
            <input
              id="input-tarefa"
              type="text"
              placeholder="Nova tarefa..."
              required
              autoComplete="off"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <select
              id="sel-prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>
            <button id="btn-adicionar" type="button" onClick={adicionarTarefa}>
              Adicionar
            </button>
          </div>
        </section>

        {/*
          ── MODIFICAÇÃO 3: quadro Kanban ──────────────────────────────────────
          Substitui a <section id="controles"> e o <ListaTarefas> original.

          Cada coluna usa o mesmo <ListaTarefas> — agora com:
            • tarefas já filtradas pelo campo coluna (evita lógica duplicada)
            • onMover → função que atualiza o campo coluna
            • colunaAnterior / colunaProxima → controlam quais botões aparecem

          null em colunaAnterior = primeira coluna, sem botão ←
          null em colunaProxima  = última coluna,   sem botão →

          Estilos em index.css — seção "16. KANBAN"
        */}
        <div className="kanban-quadro">
          {/* ── COLUNA 1: A FAZER ────────────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              {/* Contador usa array completo para mostrar o total real */}
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "afazer").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          {/* ── COLUNA 2: EM ANDAMENTO ───────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "andamento").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          {/* ── COLUNA 3: CONCLUÍDO ──────────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "concluido").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
        {/* fim .kanban-quadro */}
      </main>

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Prof. Alan Glei &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;
