(function () {
  let DB;
  const form = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();
    form.addEventListener("submit", validarCliente);
  });

  function conectarDB() {
    const crearDB = window.indexedDB.open("crm", 1);
    crearDB.onerror = () => {
      console.log("Error al crear la DB");
    };
    crearDB.onsuccess = () => {
      DB = crearDB.result;
    };
  }

  function validarCliente(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    const cliente = {
      nombre,
      email,
      telefono,
      empresa,
      id: Date.now(),
    };
    agregarNuevoCliente(cliente);
  }
  function imprimirAlerta(mensaje, tipo) {
    const alerta = document.querySelector(".alerta");

    if (!alerta) {
      const divMsj = document.createElement("div");
      divMsj.classList.add(
        "px-4",
        "py-3",
        "rounded",
        "max-w-lg",
        "mx-auto",
        "mt-6",
        "text-center",
        "border",
        "alerta"
      );

      divMsj.textContent = mensaje;
      if (tipo === "error") {
        divMsj.classList.add("bd-red-100", "border-red-400", "text-red-700");
      } else {
        divMsj.classList.add(
          "bd-green-100",
          "border-green-400",
          "text-green-700"
        );
      }
      form.appendChild(divMsj);
      setTimeout(() => {
        divMsj.remove();
      }, 3000);
    }
  }

  function agregarNuevoCliente(cliente) {
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    objectStore.add(cliente);

    transaction.onerror = () => {
      imprimirAlerta("Error al agregar nuevo cliente", error);
    };
    transaction.oncomplete = () => {
      imprimirAlerta("Nuevo cliente agregado a la DB");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };
  }
})();
