<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Gerenciador de Tarefas</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f5;
            color: #333;
            padding: 30px 20px;
        }

        .container {
            max-width: 1000px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        h2 { color: #0056b3; margin-bottom: 20px; font-size: 1.6rem; }
        h3 { color: #0056b3; margin-bottom: 14px; }

        /* ---- Estatísticas ---- */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }

        .stat-card {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            border-radius: 6px;
            padding: 14px;
            text-align: center;
        }

        .stat-card.verde  { border-left-color: #28a745; }
        .stat-card.laranja{ border-left-color: #fd7e14; }
        .stat-card.roxo   { border-left-color: #6f42c1; }

        .stat-card .valor { font-size: 1.8rem; font-weight: bold; color: #0056b3; }
        .stat-card.verde  .valor  { color: #28a745; }
        .stat-card.laranja .valor { color: #fd7e14; }
        .stat-card.roxo   .valor  { color: #6f42c1; }
        .stat-card .label { font-size: 0.8rem; color: #666; margin-top: 4px; }

        /* Barra de progresso */
        .progress-bar-container {
            background: #e9ecef;
            border-radius: 20px;
            height: 18px;
            margin-bottom: 24px;
            overflow: hidden;
        }

        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
            color: white;
            min-width: 30px;
            transition: width 0.4s ease;
        }

        /* ---- Formulários ---- */
        .form-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }

        input[type="text"],
        input[type="date"],
        select,
        textarea {
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.9rem;
            width: 100%;
        }

        textarea { resize: vertical; min-height: 60px; }

        .form-full { grid-column: 1 / -1; }

        .btn {
            padding: 8px 14px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            color: white;
        }

        .btn-primary  { background: #007bff; }
        .btn-success  { background: #28a745; }
        .btn-warning  { background: #fd7e14; }
        .btn-danger   { background: #dc3545; }
        .btn-info     { background: #17a2b8; }
        .btn-secondary{ background: #6c757d; }

        .btn:hover { opacity: 0.88; }

        /* ---- Filtros ---- */
        .filter-bar {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .filter-bar .form-group { min-width: 160px; }

        /* ---- Tabela ---- */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        th {
            background: #0056b3;
            color: white;
            padding: 12px 10px;
            text-align: left;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: middle;
        }

        tr:hover td { background: #f5f8ff; }

        tr.concluida td { opacity: 0.55; }
        tr.concluida .titulo-cell { text-decoration: line-through; }

        /* Badges de prioridade */
        .badge {
            display: inline-block;
            padding: 3px 9px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: bold;
        }

        .badge-alta   { background: #fde8e8; color: #c0392b; }
        .badge-media  { background: #fef9e7; color: #d68910; }
        .badge-baixa  { background: #e8f8f1; color: #1a7a45; }

        .badge-feita    { background: #d4edda; color: #155724; }
        .badge-pendente { background: #fff3cd; color: #856404; }

        .acoes { display: flex; gap: 6px; }

        /* Mensagem lista vazia */
        .empty-msg {
            text-align: center;
            padding: 30px;
            color: #999;
            font-style: italic;
        }

        hr { border: none; border-top: 1px solid #dee2e6; margin: 24px 0; }
    </style>
</head>
<body>
<div class="container">

    <h2>Gerenciador de Tarefas</h2>

    <!-- ==================== ESTATÍSTICAS ==================== -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="valor">${totalTarefas}</div>
            <div class="label">Total de Tarefas</div>
        </div>
        <div class="stat-card laranja">
            <div class="valor">${pendentes}</div>
            <div class="label">Pendentes</div>
        </div>
        <div class="stat-card verde">
            <div class="valor">${concluidas}</div>
            <div class="label">Concluídas</div>
        </div>
        <div class="stat-card roxo">
            <div class="valor">${estatistica}%</div>
            <div class="label">Percentual Concluído</div>
        </div>
    </div>

    <!-- Barra de progresso -->
    <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${estatistica}%">
            <c:if test="${estatistica >= 10}">${estatistica}%</c:if>
        </div>
    </div>

    <!-- ==================== FORMULÁRIO (Adicionar / Editar) ==================== -->
    <div class="form-section">

        <c:choose>
            <c:when test="${tarefaEditar != null}">
                <!-- Formulário de EDIÇÃO -->
                <h3>Editar Tarefa</h3>
                <form action="TarefaServlet" method="POST">
                    <input type="hidden" name="action" value="salvarEdicao">
                    <input type="hidden" name="id"     value="${tarefaEditar.id}">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Título *</label>
                            <input type="text" name="titulo" value="${tarefaEditar.titulo}" required>
                        </div>
                        <div class="form-group">
                            <label>Data *</label>
                            <input type="date" name="data" value="${tarefaEditar.data}" required>
                        </div>
                        <div class="form-group form-full">
                            <label>Descrição</label>
                            <textarea name="descricao">${tarefaEditar.descricao}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Prioridade</label>
                            <select name="prioridade">
                                <option value="Alta"  <c:if test="${tarefaEditar.prioridade == 'Alta'}">selected</c:if>>Alta</option>
                                <option value="Media" <c:if test="${tarefaEditar.prioridade == 'Media'}">selected</c:if>>Média</option>
                                <option value="Baixa" <c:if test="${tarefaEditar.prioridade == 'Baixa'}">selected</c:if>>Baixa</option>
                            </select>
                        </div>
                        <div class="form-group" style="justify-content: flex-end; flex-direction: row; gap: 10px; align-items: flex-end;">
                            <button type="submit" class="btn btn-warning">Salvar Alterações</button>
                            <a href="TarefaServlet" class="btn btn-secondary">Cancelar</a>
                        </div>
                    </div>
                </form>
            </c:when>

            <c:otherwise>
                <!-- Formulário de ADIÇÃO -->
                <h3>Adicionar Nova Tarefa</h3>
                <form action="TarefaServlet" method="POST">
                    <input type="hidden" name="action" value="adicionar">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Título *</label>
                            <input type="text" name="titulo" placeholder="Título da tarefa" required>
                        </div>
                        <div class="form-group">
                            <label>Data *</label>
                            <input type="date" name="data" required>
                        </div>
                        <div class="form-group form-full">
                            <label>Descrição</label>
                            <textarea name="descricao" placeholder="Descrição opcional"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Prioridade</label>
                            <select name="prioridade">
                                <option value="Alta">Alta</option>
                                <option value="Media">Média</option>
                                <option value="Baixa">Baixa</option>
                            </select>
                        </div>
                        <div class="form-group" style="justify-content: flex-end; flex-direction: row; align-items: flex-end;">
                            <button type="submit" class="btn btn-success">+ Adicionar Tarefa</button>
                        </div>
                    </div>
                </form>
            </c:otherwise>
        </c:choose>

    </div>

    <hr>

    <!-- ==================== FILTROS ==================== -->
    <form action="TarefaServlet" method="GET">
        <div class="filter-bar">
            <div class="form-group">
                <label>Filtrar por Prioridade</label>
                <select name="filtroPrioridade" onchange="this.form.submit()">
                    <option value="Todas"  <c:if test="${filtroPrioridade == 'Todas'}">selected</c:if>>Todas</option>
                    <option value="Alta"   <c:if test="${filtroPrioridade == 'Alta'}">selected</c:if>>Alta</option>
                    <option value="Media"  <c:if test="${filtroPrioridade == 'Media'}">selected</c:if>>Média</option>
                    <option value="Baixa"  <c:if test="${filtroPrioridade == 'Baixa'}">selected</c:if>>Baixa</option>
                </select>
            </div>
            <div class="form-group">
                <label>Filtrar por Status</label>
                <select name="filtroStatus" onchange="this.form.submit()">
                    <option value="Todos"      <c:if test="${filtroStatus == 'Todos'}">selected</c:if>>Todos</option>
                    <option value="Pendentes"  <c:if test="${filtroStatus == 'Pendentes'}">selected</c:if>>Pendentes</option>
                    <option value="Concluidas" <c:if test="${filtroStatus == 'Concluidas'}">selected</c:if>>Concluídas</option>
                </select>
            </div>
        </div>
    </form>

    <!-- ==================== TABELA DE TAREFAS ==================== -->
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Prioridade</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${empty listaTarefas}">
                    <tr>
                        <td colspan="7" class="empty-msg">Nenhuma tarefa encontrada.</td>
                    </tr>
                </c:when>
                <c:otherwise>
                    <%-- Loop de exibição das tarefas --%>
                    <c:forEach var="t" items="${listaTarefas}">
                        <tr class="${t.concluida ? 'concluida' : ''}">
                            <td>${t.id}</td>
                            <td class="titulo-cell">${t.titulo}</td>
                            <td>${t.descricao}</td>
                            <td>
                                <c:choose>
                                    <c:when test="${t.prioridade == 'Alta'}">
                                        <span class="badge badge-alta">Alta</span>
                                    </c:when>
                                    <c:when test="${t.prioridade == 'Media'}">
                                        <span class="badge badge-media">Média</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="badge badge-baixa">Baixa</span>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td>${t.data}</td>
                            <td>
                                <c:choose>
                                    <c:when test="${t.concluida}">
                                        <span class="badge badge-feita">Concluída</span>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="badge badge-pendente">Pendente</span>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td>
                                <div class="acoes">
                                    <%-- Botão Concluir: exibido apenas se a tarefa ainda está pendente --%>
                                    <c:if test="${!t.concluida}">
                                        <a href="TarefaServlet?action=concluir&id=${t.id}"
                                           class="btn btn-info"
                                           title="Marcar como concluída"
                                           onclick="return confirm('Marcar como concluída?')">
                                            Concluir
                                        </a>
                                        <a href="TarefaServlet?action=editar&id=${t.id}"
                                           class="btn btn-warning"
                                           title="Editar tarefa">
                                            Editar
                                        </a>
                                    </c:if>
                                    <a href="TarefaServlet?action=excluir&id=${t.id}"
                                       class="btn btn-danger"
                                       title="Excluir tarefa"
                                       onclick="return confirm('Excluir a tarefa \'${t.titulo}\'?')">
                                        Excluir
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>

</div>
</body>
</html>
