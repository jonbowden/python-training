/**
 * Custom notebook launch buttons for JupyterLab and Jupyter Notebook
 * Adds additional launch options to the Jupyter Book launch dropdown
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the page to fully render
    setTimeout(addNotebookLaunchers, 500);
});

function addNotebookLaunchers() {
    // Find the launch buttons dropdown (jupyter-book 1.x uses dropdown-launch-buttons)
    const launchDropdown = document.querySelector('.dropdown-launch-buttons');
    if (!launchDropdown) return;

    // Get the dropdown menu
    const dropdownMenu = launchDropdown.querySelector('.dropdown-menu');
    if (!dropdownMenu) return;

    // Get repository info from existing Binder link
    const binderLink = dropdownMenu.querySelector('a[href*="mybinder.org"]');
    if (!binderLink) return;

    // Parse the Binder URL to extract repo info and notebook path
    const binderUrl = binderLink.href;

    // Extract the base URL and path from the existing Binder link
    // Format: https://mybinder.org/v2/gh/{owner}/{repo}/{branch}?urlpath=tree/{path}
    const urlObj = new URL(binderUrl);
    const baseMatch = urlObj.pathname.match(/\/v2\/gh\/([^\/]+)\/([^\/]+)\/([^\/]+)/);
    if (!baseMatch) return;

    const [, owner, repo, branch] = baseMatch;
    const urlPath = urlObj.searchParams.get('urlpath') || '';

    // Extract the notebook path from urlpath (removes the 'tree/' prefix)
    const notebookPath = urlPath.replace(/^tree\//, '').replace(/^\.\//, '');

    if (!notebookPath || !notebookPath.endsWith('.ipynb')) return;

    // Create JupyterLab launch button (opens directly in JupyterLab)
    const jupyterLabUrl = `https://mybinder.org/v2/gh/${owner}/${repo}/${branch}?urlpath=lab/tree/${notebookPath}`;
    const jupyterLabItem = createLaunchItem('JupyterLab', jupyterLabUrl, '_static/images/logo_jupyterlab.svg', 'JupyterLab logo');

    // Create Jupyter Notebook launch button (opens directly in classic notebook)
    const jupyterNotebookUrl = `https://mybinder.org/v2/gh/${owner}/${repo}/${branch}?urlpath=notebooks/${notebookPath}`;
    const jupyterNotebookItem = createLaunchItem('Jupyter Notebook', jupyterNotebookUrl, '_static/images/logo_jupyter.svg', 'Jupyter logo');

    // Hide the original generic Binder button since we now have specific options
    const binderListItem = binderLink.closest('li');
    if (binderListItem) {
        binderListItem.style.display = 'none';
    }

    // Add the new items to the dropdown (insert at the beginning, after hiding Binder)
    if (dropdownMenu.firstChild) {
        dropdownMenu.insertBefore(jupyterNotebookItem, dropdownMenu.firstChild);
        dropdownMenu.insertBefore(jupyterLabItem, dropdownMenu.firstChild);
    } else {
        dropdownMenu.appendChild(jupyterLabItem);
        dropdownMenu.appendChild(jupyterNotebookItem);
    }
}

function createLaunchItem(label, url, iconSrc, iconAlt) {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'btn btn-sm dropdown-item';
    a.title = `Launch on ${label}`;
    a.setAttribute('data-bs-placement', 'left');
    a.setAttribute('data-bs-toggle', 'tooltip');

    // Create icon container span
    const iconContainer = document.createElement('span');
    iconContainer.className = 'btn__icon-container';

    // Create the icon image
    const icon = document.createElement('img');
    icon.alt = iconAlt;
    icon.src = iconSrc;

    iconContainer.appendChild(icon);

    // Create text container span
    const textContainer = document.createElement('span');
    textContainer.className = 'btn__text-container';
    textContainer.textContent = label;

    a.appendChild(iconContainer);
    a.appendChild(textContainer);
    li.appendChild(a);

    return li;
}
