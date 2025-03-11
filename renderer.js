document.getElementById("printButton").addEventListener("click", () => {
    const numeroTurno = "A123";
    const turnoID = "ABC123XYZ";

    window.electronAPI.imprimirTicket({ numeroTurno, turnoID });
});