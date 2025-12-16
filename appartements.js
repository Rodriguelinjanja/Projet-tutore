// Charger les appartements dans le SELECT
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("appartementSelect");

    fetch("../api/api.php?action=get_appartements")
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) return;

            data.forEach(app => {
                let opt = document.createElement("option");
                opt.value = app.id;
                opt.textContent = `${app.nom} — ${app.prix_par_nuit} $/nuit`;
                opt.dataset.prix = app.prix_par_nuit;

                select.appendChild(opt);
            });
        });
});
