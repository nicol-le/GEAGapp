document.addEventListener('DOMContentLoaded', () => {
    let nomePragueiro = localStorage.getItem("nomePragueiro") || "";
    let numeroPlanta = parseInt(localStorage.getItem("numeroPlanta")) || 1;
    let dadosPragas = JSON.parse(localStorage.getItem("dadosPragas")) || [];

    // Referências aos elementos
    const nomePragueiroInput = document.getElementById('nomePragueiro');
    const numeroPlantaInput = document.getElementById('numeroPlanta');
    const adicionarPlantaBtn = document.getElementById('adicionarPlanta');
    const adicionarPragaBtn = document.getElementById('adicionarPraga');
    const tabelaDados = document.getElementById('tabelaDados');

    // Inicializa os valores
    nomePragueiroInput.value = nomePragueiro;
    numeroPlantaInput.value = numeroPlanta;

    // Atualizar visualização dos dados
    function atualizarTabela() {
        tabelaDados.innerHTML = "";
        dadosPragas.forEach((registro, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${registro.Planta}</td>
                <td>${registro.Pragueiro}</td>
                <td>${registro.Nome}</td>
                <td>${registro.Quantidade}</td>
                <td>${registro.Observacoes}</td>
            `;
            tabelaDados.appendChild(row);
        });
    }

    atualizarTabela();

    // Adicionar nova planta
    adicionarPlantaBtn.addEventListener('click', () => {
        numeroPlanta++;
        numeroPlantaInput.value = numeroPlanta;
        localStorage.setItem("numeroPlanta", numeroPlanta); // Salva estado offline
    });

    // Adicionar nova praga
    adicionarPragaBtn.addEventListener('click', () => {
        const nomePraga = document.getElementById('nomePraga').value.trim();
        const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
        const observacoes = document.getElementById('observacoes').value.trim();

        if (!nomePragueiro) {
            alert("Por favor, insira o nome do pragueiro.");
            return;
        }

        if (!nomePraga) {
            alert("Por favor, insira o nome da praga.");
            return;
        }

        const registro = {
            Planta: numeroPlanta,
            Pragueiro: nomePragueiro,
            Nome: nomePraga,
            Quantidade: quantidade,
            Observacoes: observacoes,
        };

        dadosPragas.push(registro);
        localStorage.setItem("dadosPragas", JSON.stringify(dadosPragas)); // Salva localmente
        atualizarTabela(); // Atualiza a tabela visível
        alert("Praga registrada!");

        document.getElementById('pragaForm').reset();
        numeroPlantaInput.value = numeroPlanta; // Preserva número da planta
    });
});
document.getElementById('baixarExcel').addEventListener('click', () => {
    const dadosPragas = JSON.parse(localStorage.getItem("dadosPragas")) || [];
    if (dadosPragas.length === 0) {
        alert("Nenhum dado para exportar.");
        return;
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(dadosPragas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pragas");

        XLSX.writeFile(workbook, "registro_pragas.xlsx");
    } catch (error) {
        console.error("Erro ao gerar Excel:", error);
        alert("Erro ao gerar o arquivo Excel.");
    }
});
