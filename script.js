const form = document.getElementById("form");
const lista = document.getElementById("lista");

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editando = null;

form.addEventListener("submit", salvarCliente);

function salvarLocal() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
}

function salvarCliente(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !email) {
        alert("Preencha todos os campos.");
        return;
    }

    if (editando === null) {
        clientes.push({
            id: Date.now(),
            nome,
            email
        });

        // POST /clientes
    } else {
        const indice = clientes.findIndex(c => c.id === editando);

        clientes[indice].nome = nome;
        clientes[indice].email = email;

        // PUT /clientes/{id}

        editando = null;
    }

    salvarLocal();
    form.reset();
    listarClientes();
}

function listarClientes() {

    lista.innerHTML = "";

    clientes.forEach(cliente => {

        const card = document.createElement("div");
        card.className = "card";

        const info = document.createElement("div");
        info.className = "info";
        info.innerHTML = `
            <strong>${cliente.nome}</strong>
            <span>${cliente.email}</span>
        `;

        const botoes = document.createElement("div");
        botoes.className = "botoes";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "editar";

        btnEditar.addEventListener("click", () => {
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("email").value = cliente.email;
            editando = cliente.id;
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.className = "excluir";

        btnExcluir.addEventListener("click", () => {
            clientes = clientes.filter(c => c.id !== cliente.id);

            salvarLocal();
            listarClientes();

            // DELETE /clientes/{id}
        });

        botoes.appendChild(btnEditar);
        botoes.appendChild(btnExcluir);

        card.appendChild(info);
        card.appendChild(botoes);

        lista.appendChild(card);
    });

    // GET /clientes
}

listarClientes();