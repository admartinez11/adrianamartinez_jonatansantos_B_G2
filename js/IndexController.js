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
        e.preventDefault();

        const id = form.premiosId.value = "";
        lblModal.textContent = "Agregar premio"
        await loadPelis();
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



});