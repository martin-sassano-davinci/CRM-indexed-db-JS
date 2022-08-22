(function() {
    let DB;
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const form = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', ()=>{
        conectarDB();
        const searchParams = new URLSearchParams(window.location.search);
        idCliente = searchParams.get('id');
        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
            
        }
        form.addEventListener('submit', actualizarCliente);
    });

    function obtenerCliente(id) {
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    const cliente = objectStore.openCursor();
    cliente.onsuccess = (e)=>{
        const cursor = e.target.result;

        if (cursor.value.id === Number(id)) {
            llenarFormulario(cursor.value);
        }
        cursor.continue();
    }
    }

    function llenarFormulario(datosCliente) {
        const {nombre, email, telefono, empresa} = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = ()=>{
            imprimirAlerta("Cliente editado");
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
        transaction.onerror = ()=>{
            imprimirAlerta('Error al editar cliente','error');
        }
    }
    function conectarDB() {
        const crearDB = window.indexedDB.open("crm", 1);
        crearDB.onerror = () => {
          console.log("Error al crear la DB");
        };
        crearDB.onsuccess = () => {
          DB = crearDB.result;
        };
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
})();