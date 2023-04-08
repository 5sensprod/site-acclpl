export function showSpinner() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.opacity = '1'; // Ajouter cette ligne pour faire apparaître l'overlay

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    // Ajouter une icône de chargement
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-spinner', 'fa-spin');
    spinner.appendChild(icon);

    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
}

export function hideSpinner() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        const spinner = document.querySelector('.spinner');
        spinner.remove(); // Supprimer le spinner

        // Afficher l'icône de validation
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('fas', 'fa-check');
        overlay.appendChild(checkIcon);

        // Afficher la phrase "Mission accomplie"
        const message = document.createElement('div');
        message.classList.add('message');
        message.textContent = 'Mission accomplie';
        overlay.appendChild(message);

        // Ajouter une classe pour l'animation de disparition
        setTimeout(() => {
            overlay.classList.add('overlay-disappear');
        }, 2000);

        // Supprimer l'overlay après l'animation
        setTimeout(() => {
            overlay.remove();
        }, 4000);
    }
}