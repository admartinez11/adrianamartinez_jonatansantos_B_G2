const API_URL = "http://localhost:8080/apiPremios"
const API2_URL = "http://localhost:8080/apiPeliculas"

//CMB DE PELIS
export async function getPeliculas() {
    const res = await fetch(`${API2_URL}/getPeliculas`);
    return res.json();
}

//Premios
export async function getPremios() {
    const res = await fetch(`${API_URL}/getPremios`);
    return res.json();
}

export async function createPremios(data) {
    const response = await fetch (`${API_URL}/postPremios`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorText = await response.text();
            console.error("Error creando premio:", errorText);
        }
    return await response.json();
}

export async function updatePremios(id, data) {
    const response = await fetch (`${API_URL}/updatePremios/${id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(data)
        });
        if(!response.ok){
            const errorText = await response.text();
            console.error("Error actualizando premio:", errorText);
        }
    return await response.json();
}

export async function deletePremios(id) {
    const response = await fetch (`${API_URL}/deletePremios/${id}`,{
        method: "DELETE",
        credentials: "include",
        });
        if(!response.ok){
            throw new Error("Error al eliminar premio");
        }
}
