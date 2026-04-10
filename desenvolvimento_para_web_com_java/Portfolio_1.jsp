<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.text.NumberFormat"%>
<%@page import="java.util.Locale"%>

<%!
    public static class CalculadoraViagem {
        private static final double TAXA_DEPRECIACAO_KM = 0.78;

        public double calcularLitros(double distancia, double autonomia) {
            if (autonomia <= 0) return 0;
            return distancia / autonomia;
        }

        public double calcularCustoCombustivel(double litros, double precoLitro) {
            return litros * precoLitro;
        }

        public double calcularCustoTotal(double custoCombustivel, double distancia) {
            return custoCombustivel + (distancia * TAXA_DEPRECIACAO_KM);
        }
    }
%>

<%
    request.setCharacterEncoding("UTF-8");
    
    String destino = request.getParameter("destino");
    String distanciaStr = request.getParameter("distancia");
    String precoStr = request.getParameter("preco");
    String autonomiaStr = request.getParameter("autonomia");
    
    boolean isPost = "POST".equalsIgnoreCase(request.getMethod());
    boolean calculoRealizado = false;
    
    double litrosGastos = 0;
    double valorCombustivel = 0;
    double valorTotal = 0;
    
    if (isPost && destino != null && !destino.trim().isEmpty()) {
        try {
            double distancia = Double.parseDouble(distanciaStr.replace(",", "."));
            double preco = Double.parseDouble(precoStr.replace(",", "."));
            double autonomia = Double.parseDouble(autonomiaStr.replace(",", "."));
            
            CalculadoraViagem calc = new CalculadoraViagem();
            litrosGastos = calc.calcularLitros(distancia, autonomia);
            valorCombustivel = calc.calcularCustoCombustivel(litrosGastos, preco);
            valorTotal = calc.calcularCustoTotal(valorCombustivel, distancia);
            
            calculoRealizado = true;
        } catch (NumberFormatException ignored) {
        }
    }

    Locale ptBR = new Locale("pt", "BR");
    NumberFormat moedaFormat = NumberFormat.getCurrencyInstance(ptBR);
    NumberFormat numFormat = NumberFormat.getNumberInstance(ptBR);
    numFormat.setMaximumFractionDigits(2);
%>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cálculo de Viagem</title>
    <style>
        :root {
            --primary-color: #0056b3;
            --bg-color: #f8f9fa;
            --container-bg: #ffffff;
            --text-color: #333333;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            background-color: var(--container-bg);
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 500px;
        }
        h1, h2 {
            color: var(--primary-color);
            text-align: center;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 1rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
        }
        button:hover {
            background-color: #004494;
        }
        .result-card {
            margin-top: 2rem;
            padding: 1.5rem;
            background-color: #e9ecef;
            border-left: 5px solid var(--primary-color);
            border-radius: 4px;
        }
        .result-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 0.25rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Planejador de Viagem</h1>
        
        <form method="POST" action="calculadoraViagem.jsp">
            <div class="form-group">
                <label for="destino">Destino:</label>
                <input type="text" id="destino" name="destino" required 
                       value="<%= isPost && destino != null ? destino : "" %>">
            </div>
            
            <div class="form-group">
                <label for="distancia">Distância Percorrida (km):</label>
                <input type="number" id="distancia" name="distancia" step="0.01" required
                       value="<%= isPost && distanciaStr != null ? distanciaStr : "" %>">
            </div>
            
            <div class="form-group">
                <label for="preco">Valor do Combustível (R$):</label>
                <input type="number" id="preco" name="preco" step="0.01" required
                       value="<%= isPost && precoStr != null ? precoStr : "" %>">
            </div>
            
            <div class="form-group">
                <label for="autonomia">Autonomia (km/l):</label>
                <input type="number" id="autonomia" name="autonomia" step="0.01" required
                       value="<%= isPost && autonomiaStr != null ? autonomiaStr : "" %>">
            </div>
            
            <button type="submit">Calcular Viagem</button>
        </form>

        <% if (calculoRealizado) { %>
            <div class="result-card">
                <h2>Resumo para <%= destino %></h2>
                <div class="result-item">
                    <span>Combustível Gasto:</span>
                    <strong><%= numFormat.format(litrosGastos) %> Litros</strong>
                </div>
                <div class="result-item">
                    <span>Custo do Combustível:</span>
                    <strong><%= moedaFormat.format(valorCombustivel) %></strong>
                </div>
                <div class="result-item">
                    <span>Custo Total (C/ Depreciação):</span>
                    <strong><%= moedaFormat.format(valorTotal) %></strong>
                </div>
            </div>
        <% } %>
    </div>
</body>
</html>