import{
    getPremios,
    createPremios,
    updatePremios,
    deletePremios,
    getPeliculas
}from "./IndexService.js"

document.addEventListener("DOMContentLoaded", () =>{
    const tableBody = document.querySelector("#premiosTable tbody");
    const from =  document.getElementById("premiosForm");
    const modal = new bootstrap.Modal(document.getElementById("premiosModal"));
    const lblModal = document.getElementById("premioModalLabel");
    const btnAdd = document.getElementById("btnAddPremio");
    const peliSelect = document.getElementById("premioPeli");

    async function loadPelis() {
        try{
            const pelis = await getPeliculas();
            peliSelect.innerHTML = `<option value = "">Seleccionar Película</option>`;
            titulo.forEach(t => {
                peliSelect.innerHTML += `<option value="${t.ID_PELICULA}">${t.TITULO}</option>`;
            });
        }catch(err){
            console.error("Error cargando Pelis: ", err)
        }
    }

    btnAdd.addEventListener("click", async(e) =>{
        form.reset();
        form.premiosId.value = "";
        lblModal.textContent = "Agregar premio";
        await loadPelis(); //llenar combo cuando abras el modal
        modal.show();
    });

    from.addEventListener("submit", async(e) =>{
        e.preventDefault();

        const id = form.premiosId.value;
        const data = {
            ID_PELICULA: form.premioPeli.value,
            NOMBRE_PREMIO: form.nombre.value.trim(),
            CATEGORIA: form.categoria.value.trim(),
            ANO_PREMIO: form.year.value.trim(),
            RESULTADO: form.resultado.value.trim(),
            FECHA_REGISTRO: form.fecha.value //help
        };

        try{
            let response;
            if(id){
                response = await updatePremios(id, data);
            }else{
                response = await createPremios(data);
            }
            Swal.fire({
                icon: "success",
                title: "Operación existosa",
                text: err.message || "Premio guardado"
            });

            modal.hide();
            await loadPremios();
        }
        catch(err){
            console.error("Error: ", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Problema al guardar"
            });
        }
    });
    
    async function loadPremios() {
        try{
            const premios = await getPremios();
            allPremios = premios;

            tableBody.innerHTML = "";

            if(!premios || premios.length == 0){
                tableBody.innerHTML = `<td colspan = "5">No hay</td>`
                return;
            }

            premios.forEach((pr) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td>${pr.ID_PREMIOS}</td>
                <td>${pr.TITULO}</td>
                <td>${pr.NOMBRE_PREMIO}</td>
                <td>${pr.CATEGORIA}</td>
                <td>${pr.ANO_PREMIO}</td>
                <td>${pr.RESULTADO}</td>
                <td>${pr.FECHA_REGISTRO}</td>
                <td>
                    <button class= "btn btn-sm btn-outline-secondary edit-btn">Editar</button>
                    <button class= "btn btn-sm btn-outline-danger delete-btn">Eiminar</button>
                </td>`;

                tr.querySelector(".edit-btn").addEventListener("click", () => {
                    form.premiosId.value = pr.ID_PREMIOS;
                    loadPelis().then(() =>{
                        peliSelect.value = pr.ID_PELICULA;
                    });
                    form.premiosId.value = pr.ID_PREMIOS;
                    form.nombre.value = pr.NOMBRE_PREMIO;
                    form.categoria.value = pr.CATEGORIA;
                    form.year.value = pr.ANO_PREMIO;
                    form.resultado.value = pr.RESULTADO;
                    form.fecha.value = pr.FECHA_REGISTRO;
                });

                tr.querySelector(".delete-btn").addEventListener("click", () => {
                    Swal.fire({
                        title: "¿Desea eliminar este transportista?",
                        text: "Esta acción no se puede deshacer.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar"
                    }).then(async (resultado) => {
                        if (resultado.isConfirmed) {
                            try {
                                const res = await deletePremios(pr.ID_PREMIOS);
                                if (res.status === "Éxito") {
                                    await loadPremios(); 
                                    Swal.fire({
                                        icon: "success",
                                        title: "Eliminado",
                                        text: "El premio ha sido eliminado correctamente"
                                    });
                                }
                            } catch (err) {
                                console.error(err);
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: "Ocurrió un problema al eliminar el premio"
                                });
                            }
                        }
                    });
                });
                tableBody.appendChild(tr); 
            });
        }catch(err){
            console.error("Error cargando transportista")
        }
    }
});