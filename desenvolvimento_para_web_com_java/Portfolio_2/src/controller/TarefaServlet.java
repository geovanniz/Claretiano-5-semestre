package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import model.Tarefa;

@WebServlet("/TarefaServlet")
public class TarefaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession();
        List<Tarefa> tarefas = (List<Tarefa>) session.getAttribute("tarefas");

        if (tarefas == null) {
            tarefas = new ArrayList<>();
            session.setAttribute("tarefas", tarefas);
        }

        String action = request.getParameter("action");
        if (action == null) action = "listar";

        switch (action) {

            case "adicionar": {
                // Gera ID único mesmo após exclusões
                int nextId = tarefas.stream().mapToInt(Tarefa::getId).max().orElse(0) + 1;
                String titulo     = request.getParameter("titulo");
                String desc       = request.getParameter("descricao");
                String prioridade = request.getParameter("prioridade");
                String data       = request.getParameter("data");
                tarefas.add(new Tarefa(nextId, titulo, desc, prioridade, data));
                response.sendRedirect("TarefaServlet");
                return;
            }

            case "concluir": {
                int idConcluir = Integer.parseInt(request.getParameter("id"));
                tarefas.stream()
                       .filter(t -> t.getId() == idConcluir)
                       .findFirst()
                       .ifPresent(t -> t.setConcluida(true));
                response.sendRedirect("TarefaServlet");
                return;
            }

            case "excluir": {
                int idExcluir = Integer.parseInt(request.getParameter("id"));
                tarefas.removeIf(t -> t.getId() == idExcluir);
                response.sendRedirect("TarefaServlet");
                return;
            }

            case "editar": {
                // Carrega a tarefa para exibir no formulário de edição
                int idEditar = Integer.parseInt(request.getParameter("id"));
                Tarefa tarefaEditar = tarefas.stream()
                       .filter(t -> t.getId() == idEditar)
                       .findFirst()
                       .orElse(null);
                request.setAttribute("tarefaEditar", tarefaEditar);
                break;
            }

            case "salvarEdicao": {
                int idSalvar          = Integer.parseInt(request.getParameter("id"));
                String tituloEdit     = request.getParameter("titulo");
                String descEdit       = request.getParameter("descricao");
                String prioridadeEdit = request.getParameter("prioridade");
                String dataEdit       = request.getParameter("data");

                tarefas.stream()
                       .filter(t -> t.getId() == idSalvar)
                       .findFirst()
                       .ifPresent(t -> {
                           t.setTitulo(tituloEdit);
                           t.setDescricao(descEdit);
                           t.setPrioridade(prioridadeEdit);
                           t.setData(dataEdit);
                       });
                response.sendRedirect("TarefaServlet");
                return;
            }
        }

        // Estatísticas de produtividade
        long total      = tarefas.size();
        long concluidas = tarefas.stream().filter(Tarefa::isConcluida).count();
        long pendentes  = total - concluidas;
        double percentual = calcularPercentualConclusao(tarefas);

        request.setAttribute("totalTarefas", total);
        request.setAttribute("concluidas",   concluidas);
        request.setAttribute("pendentes",    pendentes);
        request.setAttribute("estatistica",  String.format("%.1f", percentual));

        // Filtros combinados
        String filtroPrioridade = request.getParameter("filtroPrioridade");
        String filtroStatus     = request.getParameter("filtroStatus");

        List<Tarefa> listaExibicao = filtrarTarefas(tarefas, filtroPrioridade, filtroStatus);
        request.setAttribute("listaTarefas",      listaExibicao);
        request.setAttribute("filtroPrioridade",  filtroPrioridade != null ? filtroPrioridade : "Todas");
        request.setAttribute("filtroStatus",      filtroStatus     != null ? filtroStatus     : "Todos");

        request.getRequestDispatcher("index.jsp").forward(request, response);
    }

    /**
     * Calcula o percentual de tarefas concluídas em relação ao total.
     * Retorna 0.0 se não houver tarefas.
     */
    private double calcularPercentualConclusao(List<Tarefa> tarefas) {
        if (tarefas.isEmpty()) return 0.0;
        long concluidas = tarefas.stream().filter(Tarefa::isConcluida).count();
        return (double) concluidas / tarefas.size() * 100;
    }

    /**
     * Filtra a lista de tarefas por prioridade e/ou status (Pendentes / Concluídas).
     */
    private List<Tarefa> filtrarTarefas(List<Tarefa> tarefas, String prioridade, String status) {
        return tarefas.stream()
            .filter(t -> {
                if (prioridade == null || prioridade.isEmpty() || prioridade.equals("Todas")) return true;
                return t.getPrioridade().equalsIgnoreCase(prioridade);
            })
            .filter(t -> {
                if (status == null || status.isEmpty() || status.equals("Todos")) return true;
                if (status.equals("Pendentes"))  return !t.isConcluida();
                if (status.equals("Concluidas")) return  t.isConcluida();
                return true;
            })
            .collect(Collectors.toList());
    }
}
